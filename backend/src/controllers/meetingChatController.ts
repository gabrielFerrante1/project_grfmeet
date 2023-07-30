import { Request, Response } from "express";
import { Meeting } from "../models/Meeting";
import { MeetingChatMessages } from "../models/MeetingChat";
import { User } from "../models/User";

export const getChat = async (req: Request, res: Response) => {
    const { code: meeting_code } = req.params;

    const meeting = await Meeting.findOne({ where: { code: meeting_code } })
    if (!meeting) {
        res.json({ error: 'meeting_not_found' })
        return;
    }

    const chatMessages = await MeetingChatMessages.findAll({ where: { meeting_id: meeting.id } })

    let messages: object[] = []

    await Promise.all(chatMessages.map(async (item, index) => {
        const user = await User.findByPk(item.user_id)

        const date = new Date(item.date)

        let objectMessage: { [key: string]: string | object | number } = { 
            body: item.body,
            date: `${date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours()}:${date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes()}`,
            user: {
                id: user?.id,
                name: user?.name
            }
        }

        messages[index] = objectMessage
    }))


    res.json({
        error: '',
        messages
    })
}