import { Switch } from '@chakra-ui/react'
import styles from './Config.module.scss'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { useDispatch } from 'react-redux'
import { setMeetingDetail } from '../../../redux/reducers/meetingReducer'
import { ChangeEvent, useEffect } from 'react'
import { socket } from '../../Layout'

export default () => {
    const meeting = useSelector((state: RootState) => state.meeting)

    const dispatch = useDispatch()

    const handleEmitToMeeting = (key: string, value: boolean) => {
        socket.emit('emit_update_meeting', {
            meeting_id: meeting.meeting?.id,
            [key]: value
        })
    }

    const handleChangeAllowEntry = (ev: ChangeEvent<HTMLInputElement>) => handleEmitToMeeting('allowed_entry', ev.target.checked)

    const handleChangeAllowMessages = (ev: ChangeEvent<HTMLInputElement>) => handleEmitToMeeting('allowed_messages', ev.target.checked)

    const handleChangeAllowVideo = (ev: ChangeEvent<HTMLInputElement>) => handleEmitToMeeting('allowed_video', ev.target.checked)

    const handleChangeAllowAudio = (ev: ChangeEvent<HTMLInputElement>) => handleEmitToMeeting('allowed_audio', ev.target.checked)

    const handleChangeAllowScreenSharing = (ev: ChangeEvent<HTMLInputElement>) => handleEmitToMeeting('allowed_screen_sharing', ev.target.checked)

    useEffect(() => {
        if (!meeting.meetingParticipantInfo.is_admin) {
            dispatch(setMeetingDetail(''))
        }
    }, [meeting.meetingParticipantInfo])

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <span className={styles.cardLabel}>As pessoas podem entrar na reunião sem solicitar a permissão dos administradores</span>

                <Switch
                    isChecked={meeting.meeting?.allowed_entry}
                    onChange={handleChangeAllowEntry}
                />
            </div>
            <div className={styles.card}>
                <span className={styles.cardLabel}>Permitir que todos os participantes enviem mensagens</span>

                <Switch
                    isChecked={meeting.meeting?.allowed_messages}
                    onChange={handleChangeAllowMessages}
                />
            </div>
            <div className={styles.card}>
                <span className={styles.cardLabel}>Permitir que todos os participantes habilitem suas câmeras </span>

                <Switch
                    isChecked={meeting.meeting?.allowed_video}
                    onChange={handleChangeAllowVideo}
                />
            </div>
            <div className={styles.card}>
                <span className={styles.cardLabel}>Permitir que todos os participantes habilitem seus microfones </span>

                <Switch
                    isChecked={meeting.meeting?.allowed_audio}
                    onChange={handleChangeAllowAudio}
                />
            </div>
            <div className={styles.card}>
                <span className={styles.cardLabel}>Permitir que todos os participantes compartilhem suas telas </span>

                <Switch
                    isChecked={meeting.meeting?.allowed_screen_sharing}
                    onChange={handleChangeAllowScreenSharing}
                />
            </div>
        </div>
    )
}