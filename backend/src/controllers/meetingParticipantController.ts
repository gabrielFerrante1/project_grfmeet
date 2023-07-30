import { Request, Response } from "express";
import { Meeting } from "../models/Meeting";
import { User } from "../models/User";
import { MeetingParticipants } from "../models/MeetingParticipants";
import { MeetingApplicants } from "../models/MeetingApplicants";

export const getOneParticipant = async (req: Request, res: Response) => {
    const { code: meeting_code, user: user_id } = req.params;

    const meeting = await Meeting.findOne({ where: { code: meeting_code } })
    if (!meeting) {
        res.json({ error: 'meeting_not_found' })
        return;
    }

    const participant = await MeetingParticipants.findOne({ where: { meeting_id: meeting.id, user_id } })
    let isParticipant = false

    if (participant) isParticipant = true

    res.json({
        error: '',
        isParticipant
    })
}

export const getParticipants = async (req: Request, res: Response) => {
    const { code: meeting_code } = req.params;

    const meeting = await Meeting.findOne({ where: { code: meeting_code } })
    if (!meeting) {
        res.json({ error: 'meeting_not_found' })
        return;
    }

    let participants: object[] = []
    let applicants: object[] = []

    const meetingParticipants = await MeetingParticipants.findAll({ where: { meeting_id: meeting.id, is_online: true } })
    await Promise.all(meetingParticipants.map(async (item, index) => {
        const user = await User.findByPk(item.user_id)

        participants.push({
            is_admin: item.is_admin,
            user: {
                id: user?.id,
                name: user?.name,
                email: user?.email
            }
        })
    }))


    const meetingApplicants = await MeetingApplicants.findAll({ where: { meeting_id: meeting.id } })
    await Promise.all(meetingApplicants.map(async (item) => {
        const user = await User.findByPk(item.user_id)

        applicants.push({
            user: {
                id: user?.id,
                name: user?.name,
                email: user?.email
            }
        })
    }))

    res.json({
        error: '',
        participants,
        applicants
    })
}