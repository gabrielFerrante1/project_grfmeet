import { Spinner } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../components/Layout'
import MeetingRoom from '../components/Meeting'
import MeetingEntry from '../components/MeetingEntry'
import { setMeetingCurrent, setMeetingMyConfig, setMeetingParticipantInfo, setMeetingParticipantsLoaded } from '../redux/reducers/meetingReducer'
import { RootState } from '../redux/store'
import styles from '../styles/Meeting.module.scss'
import { ApiFindMeeting, Meeting } from '../types/Meeting'
import { api } from '../utils/api'
import useAuth from '../utils/useAuth'

type MeetingErrors = 'meeting_not_found' | 'participant_is_banned' | 'participant_is_kicked'

export default () => {
    const [loading, setLoading] = useState('Carregando reunião...')
    const [error, setError] = useState<MeetingErrors | ''>('')
    const [meeting, setMeeting] = useState<Meeting | null>(null)

    const meetingReducer = useSelector((state: RootState) => state.meeting)

    const dispatch = useDispatch()

    const { user } = useAuth()

    const router = useRouter()
    const { meetingId } = router.query

    socket.on('receive_kick_meeting', ({ mode, user_id }: { user_id: number, mode: 'kick' | 'ban' }) => {
        if (user_id == user?.id) {
            dispatch(setMeetingCurrent(null));
            setMeeting(null);

            if (mode == 'ban') {
                setError('participant_is_banned');
                return;
            }

            if (mode == 'kick') {
                setError('participant_is_kicked');
                return;
            }
        }
    })

    socket.on('update_participants', () => {
        dispatch(setMeetingParticipantsLoaded(false))
    })

    socket.on('update_admin', ({ admin, user_id }: { admin: boolean, user_id: number }) => {
        if (user_id == user?.id) {
            dispatch(setMeetingParticipantInfo({ is_admin: admin }))
        }
    })

    socket.on('update_meeting', (
        props: { allowed_entry: boolean, allowed_audio: boolean, allowed_video: boolean, allowed_messages: boolean, allowed_screen_sharing: boolean }
    ) => {
        if (!meetingReducer.meeting) return;

        dispatch(setMeetingCurrent({ ...meetingReducer.meeting, ...props }))

        // Disabled camera or microphone, per configurations of creator
        if (!meetingReducer.meetingParticipantInfo.is_admin) {
            if (!props.allowed_video) {
                dispatch(setMeetingMyConfig({ ...meetingReducer.meetingMyConfig, videoIsEnable: false }));
                return;
            }

            if (!props.allowed_audio) {
                dispatch(setMeetingMyConfig({ ...meetingReducer.meetingMyConfig, audioIsEnable: false }));
                return;
            }
        }
    })



    useEffect(() => {
        const findMeeting = async () => {
            const { data: meeting } = await api<ApiFindMeeting>(`meetings/${meetingId}`, 'get', {}, user?.token)

            setLoading('')

            if (meeting.error == 'meeting_not_found') setError(meeting.error)
            if (meeting.error == 'participant_is_banned') setError(meeting.error)

            if (!meeting.error && user?.id == meeting.meeting.user_id) {
                dispatch(setMeetingMyConfig({ audioIsEnable: false, videoIsEnable: false }))

                socket.emit('join_meeting_room', { meeting_id: meeting.meeting.id, user_id: user.id }, (is_admin: boolean) => {
                    dispatch(setMeetingParticipantInfo({ is_admin }))
                })

                dispatch(setMeetingCurrent(meeting.meeting))

                return;
            }

            if (!meeting.error) setMeeting(meeting.meeting)
        }

        if (router.isReady && user?.token) findMeeting();
    }, [router.isReady, user])

    if (meetingReducer.meeting) {
        return (
            <div className={styles.container}>
                <MeetingRoom />
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {loading &&
                <div className={styles.loadingMeeting}>
                    <Spinner
                        thickness='4px'
                        color='blue.400'
                        size='xl'
                    />
                    <span className={styles.loadingMeetingLabel}>{loading}</span>
                </div>
            }

            {error == 'meeting_not_found' &&
                <div className={styles.meetingNotFound}>
                    <span>Nome da videochamada inválido</span>
                    <Link href='/'>
                        <button className='bg-blue-600'>Voltar à tela inicial</button>
                    </Link>
                </div>
            }

            {error == 'participant_is_kicked' &&
                <div className={styles.participantBanned}>
                    <div className={styles.participantBannedInfo}>
                        <span>Você foi expulso desta reunião</span>
                        <p>Alguém te removeu desta videochamada</p>
                    </div>
                    <Link href='/'>
                        <button className='bg-blue-600'>Voltar à tela inicial</button>
                    </Link>
                </div>
            }

            {error == 'participant_is_banned' &&
                <div className={styles.participantBanned}>
                    <div className={styles.participantBannedInfo}>
                        <span>Você foi banido desta reunião</span>
                        <p>Entre em contato com o organizador da videochamada</p>
                    </div>
                    <Link href='/'>
                        <button className='bg-blue-600'>Voltar à tela inicial</button>
                    </Link>
                </div>
            }

            {meeting &&
                <MeetingEntry
                    meeting={meeting}
                />
            }
        </div>
    )
}