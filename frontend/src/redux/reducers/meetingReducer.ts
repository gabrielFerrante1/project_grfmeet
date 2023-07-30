import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Meeting, MeetingApplicant, MeetingChatMessage, MeetingParticipant } from '../../types/Meeting';

export type MeetingDetails = 'info' | 'chat' | 'participant_info' | 'config' | ''

export type MeetingParticipantInfo = { is_admin: boolean }

type MeetingMyConfig = { videoIsEnable: boolean, audioIsEnable: boolean }

export const slice = createSlice({
    name: 'meeting',
    initialState: {
        meeting: null as Meeting | null,
        meetingDetail: '' as MeetingDetails,
        meetingMyConfig: { videoIsEnable: true, audioIsEnable: true } as MeetingMyConfig,
        meetingChatLoaded: false,
        meetingChat: null as MeetingChatMessage[] | null,
        meetingParticipantsLoaded: false,
        meetingParticipants: null as MeetingParticipant[] | null,
        meetingApplicants: null as MeetingApplicant[] | null,
        meetingParticipantInfo: { is_admin: false } as MeetingParticipantInfo
    },
    reducers: {
        setMeetingCurrent: (state, action: PayloadAction<Meeting | null>) => {
            state.meeting = action.payload
        },
        setMeetingDetail: (state, action: PayloadAction<MeetingDetails>) => {
            state.meetingDetail = action.payload
        },
        setMeetingMyConfig: (state, action: PayloadAction<MeetingMyConfig>) => {
            state.meetingMyConfig = action.payload
        },
        setMeetingChatLoaded: (state, action: PayloadAction<boolean>) => {
            state.meetingChatLoaded = action.payload
        },
        setMeetingChat: (state, action: PayloadAction<MeetingChatMessage[] | null>) => {
            state.meetingChat = action.payload
        },
        setMeetingParticipantsLoaded: (state, action: PayloadAction<boolean>) => {
            state.meetingParticipantsLoaded = action.payload
        },
        setMeetingParticipants: (state, action: PayloadAction<MeetingParticipant[] | null>) => {
            state.meetingParticipants = action.payload
        },
        setMeetingApplicants: (state, action: PayloadAction<MeetingApplicant[] | null>) => {
            state.meetingApplicants = action.payload
        },
        setMeetingParticipantInfo: (state, action: PayloadAction<MeetingParticipantInfo>) => {
            state.meetingParticipantInfo = action.payload
        }
    }
});


export const {
    setMeetingCurrent,
    setMeetingDetail,
    setMeetingMyConfig,
    setMeetingChatLoaded,
    setMeetingChat,
    setMeetingParticipantsLoaded,
    setMeetingParticipants,
    setMeetingApplicants,
    setMeetingParticipantInfo
} = slice.actions;

export default slice.reducer;