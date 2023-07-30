import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMeetingApplicants, setMeetingParticipants, setMeetingParticipantsLoaded } from '../../../redux/reducers/meetingReducer'
import { RootState } from '../../../redux/store'
import { ApiGetMeetingParticipants } from '../../../types/Meeting'
import { api } from '../../../utils/api'
import useAuth from '../../../utils/useAuth'
import ApplicantUserItem from './ApplicantUserItem'
import styles from './Participants.module.scss'
import UserItem from './UserItem'


export default () => {
    const meeting = useSelector((state: RootState) => state.meeting)

    const { user } = useAuth()

    const dispatch = useDispatch()

    const getParticipants = async () => {
        if (!meeting.meetingParticipantsLoaded) {
            const { data: request } = await api<ApiGetMeetingParticipants>(`meetings/${meeting.meeting?.code}/participants`, 'get', {}, user?.token)

            dispatch(setMeetingParticipantsLoaded(true))
            dispatch(setMeetingParticipants(request.participants))
            dispatch(setMeetingApplicants(request.applicants))
        }
    }

    const admins = meeting.meetingParticipants?.filter((item) => item.is_admin == true)
    const applicants = meeting.meetingApplicants
    const participants = meeting.meetingParticipants?.filter((item) => item.is_admin == false)

    useEffect(() => {
        getParticipants()
    }, [meeting.meetingParticipantsLoaded])

    return (
        <div className={styles.container}>
            {applicants?.length != 0 && meeting.meetingParticipantInfo.is_admin ?
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span>Aguardando permissão</span>
                        <span>{applicants?.length}</span>
                    </div>
                    <div className={styles.cardBody}>
                        {applicants?.map((item) => (
                            <ApplicantUserItem
                                key={item.user.id}
                                data={item}
                            />
                        ))}
                    </div>
                </div>
                : ''}

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span>Administradores</span>
                    <span>{admins?.length}</span>
                </div>
                <div className={styles.cardBody}>
                    {admins?.map((item) => (
                        <UserItem
                            key={item.user.id}
                            data={item}
                            user_is_admin={meeting.meetingParticipantInfo.is_admin}
                        />
                    ))}
                </div>
            </div>

            {participants?.length != 0 &&
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span>Participantes</span>
                        <span>{participants?.length}</span>
                    </div>
                    <div className={styles.cardBody}>
                        {participants?.map((item) => (
                            <UserItem
                                key={item.user.id}
                                data={item}
                                user_is_admin={meeting.meetingParticipantInfo.is_admin}
                            />
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}