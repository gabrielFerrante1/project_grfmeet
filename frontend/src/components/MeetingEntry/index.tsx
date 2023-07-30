import { useEffect, useRef, useState } from 'react'
import { Meeting } from '../../types/Meeting'
import styles from './MeetingEntry.module.scss'
import {
    BiMicrophone,
    BiMicrophoneOff,
    BiCamera,
    BiCameraOff
} from 'react-icons/bi'
import { CircularProgress, Tooltip } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { setMeetingCurrent, setMeetingMyConfig, setMeetingParticipantInfo } from '../../redux/reducers/meetingReducer'
import { socket } from '../Layout'
import useAuth from '../../utils/useAuth'
import { api } from '../../utils/api'

type Props = {
    meeting: Meeting
}

export default ({ meeting }: Props) => {
    const { user } = useAuth()

    const [audio, setAudio] = useState(meeting.allowed_audio)
    const [video, setVideo] = useState(meeting.allowed_video)
    const [requestStatus, setRequestStatus] = useState<'waiting' | 'decline' | ''>('')

    const dispatch = useDispatch()

    const userVideo = useRef<HTMLVideoElement>(null)

    const videoConstraints = { width: 650, height: 380 }

    const handleToggleAudio = () => {
        if (meeting.allowed_audio) setAudio(!audio)
    }

    const handleToggleVideo = () => {
        if (meeting.allowed_video) setVideo(!video)
    }

    const handleJoinMeeting = () => {
        if (!user) return;

        dispatch(setMeetingMyConfig({ audioIsEnable: audio, videoIsEnable: video }))

        socket.emit('join_meeting_room', { meeting_id: meeting.id, user_id: user.id }, (is_admin: boolean) => {
            dispatch(setMeetingParticipantInfo({ is_admin }))
        })

        dispatch(setMeetingCurrent(meeting))
    }

    const handleRequestJoin = async () => {
        if (!user) return;

        const { data: checkParticipant } = await api<{ isParticipant: boolean }>(`meetings/${meeting.code}/participants/${user?.id}`, 'get', {}, user?.token);

        if (checkParticipant.isParticipant) {
            handleJoinMeeting();
            return;
        }

        setRequestStatus('waiting');

        socket.emit("request_entry_meeting", { meeting_id: meeting.id, user_id: user.id });
    }

    const ControlsItemMic =
        <div onClick={handleToggleAudio} className={`${styles.controlsItem} ${!audio ? styles.controlsItemDisabled : ''}`}>
            {audio ?
                <BiMicrophone className={styles.controlsItemIcon} />
                :
                <BiMicrophoneOff className={styles.controlsItemIcon} />
            }
        </div>

    const ControlsItemCam =
        <div onClick={handleToggleVideo} className={`${styles.controlsItem} ${!video ? styles.controlsItemDisabled : ''}`}>
            {video ?
                <BiCamera className={styles.controlsItemIcon} />
                :
                <BiCameraOff className={styles.controlsItemIcon} />
            }
        </div>

    useEffect(() => {
        socket.on('request_entry_meeting_receive_response', ({ user_id, status }) => {
            if (user_id == user?.id) {
                if (status == 'decline') {
                    setRequestStatus('decline')
                    return;
                }

                handleJoinMeeting();
            }
        })
    }, [])

    useEffect(() => {
        if (audio || video) {
            navigator.mediaDevices.getUserMedia({
                video: video ? videoConstraints : false,
                audio,
            })
                .then((strem: MediaStream) => {
                    if (userVideo.current) userVideo.current.srcObject = strem
                })
        }

        if (!video && userVideo.current) userVideo.current.srcObject = null
    }, [audio, video])

    return (
        <div className={styles.container}>
            <div className={styles.cardLeft}>
                <video className={styles.video} ref={userVideo} playsInline autoPlay muted />

                <div className={styles.controls}>
                    <Tooltip label={!audio ? 'Ativar microfone' : 'Desativar microfone'} placement='bottom' children={ControlsItemMic} />

                    <Tooltip label={!video ? 'Ativar câmera' : 'Desativar câmera'} placement='bottom' children={ControlsItemCam} />
                </div>
            </div>
            <div className={styles.cardRight}>
                {meeting.allowed_entry ?
                    <>
                        <h3>Participe desta chamada, pública</h3>
                        <p>O organizador desta chamada configurou que está chamada seja aberta para qualquer pessoa</p>

                        <button onClick={handleJoinMeeting}>Participar da chamada</button>
                    </>
                    :
                    <>
                        {requestStatus == 'waiting' ?
                            <div className='flex flex-col items-center'>
                                <CircularProgress isIndeterminate color='blue.400' />

                                <h3 className='mt-8'>Seu pedido de participação foi enviado, aguarde a resposta dos organizadores...</h3>
                            </div>
                            : requestStatus == 'decline' ?
                                <>
                                    <h3>O seu pedido para aderir a chamada foi <span className='font-semibold text-red-600'>recusado</span>, entre em contato com os organizadores</h3>
                                </>
                                :
                                <>
                                    <h3>Participe desta chamada, privada</h3>
                                    <p>O organizador desta chamada configurou que está chamada seja privada, dessa forma solicite a participação dessa chamada</p>

                                    <button onClick={handleRequestJoin}>Pedir para participar</button>
                                </>
                        }
                    </>
                }
            </div>
        </div>
    )
}