import { Tooltip, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { ImPhoneHangUp } from 'react-icons/im';
import {
    MdInfoOutline,
    MdOutlineChat,
    MdOutlineGroup,
    MdOutlineMic,
    MdOutlineMicOff,
    MdOutlineSettings,
    MdOutlineVideocam,
    MdOutlineVideocamOff
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { MeetingDetails, setMeetingCurrent, setMeetingDetail, setMeetingMyConfig } from '../../../redux/reducers/meetingReducer';
import { RootState } from '../../../redux/store';
import styles from './Footer.module.scss';
import { socket } from '../../Layout';
import { useRouter } from 'next/router';

export default () => {
    const meeting = useSelector((state: RootState) => state.meeting)

    const dateInitial = new Date()
    const [date, setDate] = useState({ hours: ("0" + dateInitial.getHours()).substr(-2), minutes: ("0" + dateInitial.getMinutes()).substr(-2) })

    const dispatch = useDispatch()

    const router = useRouter()
    const toast = useToast()

    const handleToggleVideo = () => dispatch(setMeetingMyConfig({ ...meeting.meetingMyConfig, videoIsEnable: !meeting.meetingMyConfig.videoIsEnable }))
    const handleToggleAudio = () => dispatch(setMeetingMyConfig({ ...meeting.meetingMyConfig, audioIsEnable: !meeting.meetingMyConfig.audioIsEnable }))

    const handleSetMeetingDetails = (detail: MeetingDetails) => {
        if (detail == meeting.meetingDetail) {
            dispatch(setMeetingDetail(''))
        } else {
            dispatch(setMeetingDetail(detail))
        }
    }

    const handleLeaveMeeting = () => {
        socket.emit('leave_meeting_room')

        dispatch(setMeetingCurrent(null))

        router.push('/')

        toast({
            title: 'Você saiu da videochamada com sucesso!',
            status: 'info',
            position: 'bottom-left',
            duration: 7000
        })
    }

    useEffect(() => {
        const timer = setInterval(() => {
            const date = new Date()

            setDate({
                hours: ("0" + date.getHours()).substr(-2),
                minutes: ("0" + date.getMinutes()).substr(-2)
            })
        }, 5000)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className={styles.container}>
            <div className='text-md font-semibold text-gray-200 truncate'>
                {date.hours}:{date.minutes}ﾠ|ﾠ{meeting.meeting?.code}
            </div>

            <div className={styles.controls}>
                <Tooltip label={meeting.meetingMyConfig.audioIsEnable ? 'Desativar microfone' : 'Ativar microfone'} openDelay={400}>
                    <div
                        className={`${styles.controlsItem} ${!meeting.meetingMyConfig.audioIsEnable ? styles.controlsItemBlocked : ''}`}
                        onClick={meeting.meetingParticipantInfo.is_admin || meeting.meeting?.allowed_audio ? handleToggleAudio : undefined}
                    >
                        {meeting.meetingMyConfig.audioIsEnable ?
                            <MdOutlineMic />
                            :
                            <MdOutlineMicOff />
                        }
                    </div>
                </Tooltip>

                <Tooltip label={meeting.meetingMyConfig.videoIsEnable ? 'Desativar câmera' : 'Ativar câmera'} openDelay={400}>
                    <div
                        className={`${styles.controlsItem} ${!meeting.meetingMyConfig.videoIsEnable ? styles.controlsItemBlocked : ''}`}
                        onClick={meeting.meetingParticipantInfo.is_admin || meeting.meeting?.allowed_video ? handleToggleVideo : undefined}
                    >
                        {meeting.meetingMyConfig.videoIsEnable ?
                            <MdOutlineVideocam />
                            :
                            <MdOutlineVideocamOff />
                        }
                    </div>
                </Tooltip>

                <Tooltip label='Configurações' openDelay={400}>
                    <div className={styles.controlsItem}>
                        <HiDotsVertical />
                    </div>
                </Tooltip>

                <div className={styles.controlsItemLeave} onClick={handleLeaveMeeting}>
                    <ImPhoneHangUp fontSize={21} />
                </div>
            </div>

            <div className={styles.meetingDetails}>
                <Tooltip label='Detalhes da reunião' openDelay={400}>
                    <div
                        onClick={() => handleSetMeetingDetails('info')}
                        className={`${styles.meetingDetailsItem} ${meeting.meetingDetail == 'info' ? styles.meetingDetailsItemActive : ''}`}
                    >
                        <MdInfoOutline />
                    </div>
                </Tooltip>

                <Tooltip label='Mostrar todos' openDelay={400}>
                    <div
                        onClick={() => handleSetMeetingDetails('participant_info')}
                        className={`${styles.meetingDetailsItem} ${meeting.meetingDetail == 'participant_info' ? styles.meetingDetailsItemActive : ''}`}
                    >
                        <MdOutlineGroup fontSize={26} />
                    </div>
                </Tooltip>

                <Tooltip label='Chat com todos' openDelay={400}>
                    <div
                        onClick={() => handleSetMeetingDetails('chat')}
                        className={`${styles.meetingDetailsItem} ${meeting.meetingDetail == 'chat' ? styles.meetingDetailsItemActive : ''}`}
                    >
                        <MdOutlineChat fontSize={23} />
                    </div>
                </Tooltip>

                {meeting.meetingParticipantInfo.is_admin &&
                    <Tooltip label='Controles do organizador' openDelay={400}>
                        <div
                            onClick={() => handleSetMeetingDetails('config')}
                            className={`${styles.meetingDetailsItem} ${meeting.meetingDetail == 'config' ? styles.meetingDetailsItemActive : ''}`}
                        >
                            <MdOutlineSettings fontSize={23} />
                        </div>
                    </Tooltip>
                }
            </div>
        </div>
    )
}