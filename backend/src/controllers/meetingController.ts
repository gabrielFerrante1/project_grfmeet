import { Request, Response } from "express";
import { Meeting } from "../models/Meeting";
import { getUser } from "../utils/auth";
import { v4 as uuidv4 } from 'uuid';
import { MeetingParticipants } from "../models/MeetingParticipants";
import { io } from "../server";

export const create = async (req: Request, res: Response) => {
    const user = await getUser(req)

    const newMeeting = await Meeting.create({
        code: uuidv4() + user?.id,
        user_id: user?.id
    })

    await MeetingParticipants.create({
        meeting_id: newMeeting.id,
        user_id: user?.id,
        is_admin: true
    })

    res.json({ error: "", meeting: newMeeting })
}

export const findOne = async (req: Request, res: Response) => {
    const { code: meeting_code } = req.params;

    const user = await getUser(req)

    const meeting = await Meeting.findOne({ where: { code: meeting_code } })
    if (!meeting) {
        res.json({ error: 'meeting_not_found' })
        return;
    }

    const checkBanned = await MeetingParticipants.findOne({ where: { meeting_id: meeting.id, user_id: user?.id, is_banned: true } })
    if (checkBanned && meeting.user_id != user?.id) {
        res.json({ error: 'participant_is_banned' })
        return;
    }

    res.json({ error: "", meeting })
} 