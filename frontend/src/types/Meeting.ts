import { Api } from "./Api"

export type Meeting = {
    id: number,
    user_id: number,
    code: string,
    allowed_entry: boolean,
    allowed_messages: boolean,
    allowed_video: boolean,
    allowed_audio: boolean,
    allowed_screen_sharing: boolean
}

export type MeetingChatMessage = {
    body: string,
    date: string,
    user: {
        id: number,
        name: string
    }
}

export type MeetingParticipant = {
    is_admin: boolean,
    user: {
        id: number,
        name: string,
        email: string
    }
}

export type MeetingApplicant = { 
    user: {
        id: number,
        name: string,
        email: string
    }
}

export interface ApiCreateMeeting extends Api {
    meeting: Meeting
}

export interface ApiFindMeeting extends Api {
    meeting: Meeting
}

export interface ApiGetMeetingChatMessages extends Api {
    messages: MeetingChatMessage[]
}

export interface ApiGetMeetingParticipants extends Api {
    participants: MeetingParticipant[],
    applicants: MeetingApplicant[]
}