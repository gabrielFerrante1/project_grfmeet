import { CircularProgress, Switch, Tooltip } from '@chakra-ui/react'
import { useEffect, useRef, useState, ChangeEvent } from 'react'
import { AiOutlineSend } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { setMeetingChat, setMeetingChatLoaded, setMeetingCurrent } from '../../../redux/reducers/meetingReducer'
import { RootState } from '../../../redux/store'
import { ApiGetMeetingChatMessages, MeetingChatMessage } from '../../../types/Meeting'
import { api } from '../../../utils/api'
import useAuth from '../../../utils/useAuth'
import { socket } from '../../Layout'
import styles from './Chat.module.scss'

export default () => {
    const meeting = useSelector((state: RootState) => state.meeting)

    const [inputValue, setInputValue] = useState('')
    const [loadingMessages, setLoadingMessages] = useState(true)

    const dispatch = useDispatch()

    const refMessages = useRef<HTMLDivElement>(null)

    const { user } = useAuth()

    const getChatMessages = async () => {
        if (!meeting.meetingChatLoaded) {
            const { data: request } = await api<ApiGetMeetingChatMessages>(`meetings/${meeting.meeting?.code}/chat`, 'get', {}, user?.token)

            dispatch(setMeetingChatLoaded(true))
            dispatch(setMeetingChat(request.messages))
        }

        setLoadingMessages(false)
    }

    const handleSend = () => {
        if (!user) return;

        socket.emit('meeting_chat_emit_new_message', {
            meeting_id: meeting.meeting?.id,
            user_id: user.id,
            user_name: user.name,
            body: inputValue
        })

        setInputValue('')
    }

    const handleChangeAllowMessages = (ev: ChangeEvent<HTMLInputElement>) => {
        const { checked } = ev.target

        if (!meeting.meeting) return;

        dispatch(setMeetingCurrent({ ...meeting.meeting, allowed_messages: checked }))

        socket.emit('emit_update_meeting', {
            meeting_id: meeting.meeting?.id,
            allowed_messages: checked
        })
    }

    socket.on('meeting_chat_receive_new_message', (payload: MeetingChatMessage) => {
        if (meeting.meetingChat) dispatch(setMeetingChat([...meeting.meetingChat, payload]))
    })

    useEffect(() => {
        getChatMessages()
    }, [])

    return (
        <div className={styles.container}>
            {meeting.meetingParticipantInfo.is_admin &&
                <div className={styles.toggleAllowMessages}>
                    <span>Permitir que todos os participantes enviem mensagens</span>
                    <Switch
                        isChecked={meeting.meeting?.allowed_messages}
                        onChange={handleChangeAllowMessages}
                    />
                </div>
            }

            <div ref={refMessages} className={styles.messages} style={{ height: meeting.meetingParticipantInfo.is_admin ? "calc(100% - 200px)" : meeting.meeting?.allowed_messages ? "calc(100% - 120px)" : "calc(100% - 60px)" }}>
                {loadingMessages ?
                    <div className={styles.messagesLoading}>
                        <CircularProgress isIndeterminate color='blue.400' />
                    </div>
                    :
                    meeting.meetingChat?.map((value, index) => (
                        <div key={index} className={styles.messageItem}>
                            <div className={styles.messageItemHeader}>
                                <span className={styles.messageItemHeaderAuthor}>{value.user.id == user?.id ? 'Você' : value.user.id}</span>
                                <span className={styles.messageItemHeaderDate}>{value.date}</span>
                            </div>
                            <div className={styles.messageItemBody}>{value.body}</div>
                        </div>
                    ))
                }
            </div>

            {meeting.meeting?.allowed_messages || meeting.meetingParticipantInfo.is_admin ?
                <div className={styles.sendContainer}>
                    <div className={styles.send}>
                        <input
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder='Enviar uma mensagem'
                            className={styles.sendInput}
                        />

                        <Tooltip label='Enviar mensagem' openDelay={400} placement='top'>
                            <button
                                onClick={inputValue ? handleSend : undefined}
                                className={`${styles.sendBtn} ${inputValue ? 'text-blue-600 cursor-pointer' : 'text-gray-500 cursor-not-allowed'}`}
                            >
                                <AiOutlineSend />
                            </button>
                        </Tooltip>
                    </div>
                </div>
                : ''}

        </div>
    )
}