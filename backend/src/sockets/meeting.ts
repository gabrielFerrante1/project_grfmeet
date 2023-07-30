import { Socket } from "socket.io";
import { MeetingParticipants } from "../models/MeetingParticipants";
import { MeetingChatMessages } from "../models/MeetingChat";
import { io } from "../server";
import { MeetingApplicants } from "../models/MeetingApplicants";
import { Meeting } from "../models/Meeting";

export const socketsMeeting = (socket: Socket) => {

    socket.on('join_meeting_room', async (
        { meeting_id, user_id }: { meeting_id: number, user_id: number },
        callback: (is_admin: boolean) => void
    ) => {
        socket.join(meeting_id.toString())

        const participant = await MeetingParticipants.findOne({ where: { meeting_id, user_id } })

        if (participant) {
            await participant.update({ is_online: true, socket_id: socket.id })
            callback(participant.is_admin)

            io.to(meeting_id.toString()).emit('update_participants')

            return;
        }

        await MeetingParticipants.create({
            meeting_id,
            user_id,
            socket_id: socket.id
        })

        io.to(meeting_id.toString()).emit('update_participants')

        callback(false)
    })


    socket.on('meeting_chat_emit_new_message', async (
        { meeting_id, user_id, user_name, body }: { meeting_id: number, user_id: number, user_name: string, body: string }
    ) => {

        const date = new Date()
        const dateSQL = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0]

        const dateMessage = new Date(dateSQL)

        const message = {
            body: body,
            date: `${dateMessage.getHours() < 10 ? `0${dateMessage.getHours()}` : dateMessage.getHours()}:${dateMessage.getUTCMinutes() < 10 ? `0${dateMessage.getUTCMinutes()}` : dateMessage.getUTCMinutes()}`,
            user: {
                id: user_id,
                name: user_name
            }
        }

        io.to(meeting_id.toString()).emit('meeting_chat_receive_new_message', message)

        await MeetingChatMessages.create({
            meeting_id,
            user_id,
            body,
            date: dateSQL
        })
    })

    socket.on('request_entry_meeting', async (
        { user_id, meeting_id }: { meeting_id: string, user_id: number }
    ) => {
        await MeetingApplicants.findOrCreate({
            where: { meeting_id, user_id }
        })

        io.to(meeting_id.toString()).emit('update_participants')
    })

    socket.on('request_entry_meeting_emit_response', async (
        { user_id, meeting_id, status }: { meeting_id: string, user_id: number, status: string }
    ) => {
        io.emit('request_entry_meeting_receive_response', {
            status,
            user_id
        })

        await MeetingApplicants.destroy({
            where: { meeting_id, user_id }
        })

        io.to(meeting_id.toString()).emit('update_participants')
    })

    socket.on('emit_kick_meeting', async (
        { meeting_id, user_id, mode }: { meeting_id: number, user_id: number, mode: 'kick' | 'ban' }
    ) => {
        io.to(meeting_id.toString()).emit('receive_kick_meeting', { mode, user_id })

        const participant = await MeetingParticipants.findOne({ where: { meeting_id, user_id } })

        if (mode == 'ban') {
            await participant?.update({
                is_banned: true,
                is_online: false
            })
        } else if (mode == 'kick') {
            await participant?.update({
                is_online: false
            })
        }

        io.to(meeting_id.toString()).emit('update_participants')
    })

    socket.on('emit_update_admin', async (
        { admin, meeting_id, user_id }: { meeting_id: number, user_id: number, admin: boolean }
    ) => {
        socket.broadcast.to(meeting_id.toString()).emit("update_admin", { user_id, admin })

        const participant = await MeetingParticipants.findOne({ where: { meeting_id, user_id } })

        await participant?.update({
            is_admin: admin
        })

        io.to(meeting_id.toString()).emit('update_participants')
    })

    socket.on('emit_update_meeting', async (
        { meeting_id, allowed_entry, allowed_audio, allowed_video, allowed_messages, allowed_screen_sharing }
    ) => {
        const meeting = await Meeting.findByPk(meeting_id)

        const changedMeeting = {
            allowed_entry: allowed_entry ?? meeting?.allowed_entry,
            allowed_audio: allowed_audio ?? meeting?.allowed_audio,
            allowed_video: allowed_video ?? meeting?.allowed_video,
            allowed_messages: allowed_messages ?? meeting?.allowed_messages,
            allowed_screen_sharing: allowed_screen_sharing ?? meeting?.allowed_screen_sharing,
        }

        io.to(meeting_id.toString()).emit('update_meeting', changedMeeting)

        meeting?.update(changedMeeting)
    })

    socket.on('leave_meeting_room', async () => {
        const participant = await MeetingParticipants.findOne({ where: { socket_id: socket.id } })

        if (!participant) return;

        await participant.update({
            is_online: false
        })
      
        socket.broadcast.to(participant.meeting_id.toString()).emit('update_participants')

        socket.leave(participant.meeting_id.toString())
      
    })

    socket.on('disconnect', async () => {
        const participant = await MeetingParticipants.findOne({ where: { socket_id: socket.id } })

        if (participant) {
            await participant.update({
                is_online: false
            })

            socket.broadcast.to(participant.meeting_id.toString()).emit('update_participants')
        }
    });
}   
