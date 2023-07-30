import { Avatar, Button } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { MeetingApplicant } from '../../../types/Meeting';
import { socket } from '../../Layout';
import styles from './Participants.module.scss';

type Props = {
    data: MeetingApplicant;
}

export default ({ data }: Props) => {
    const meeting = useSelector((state: RootState) => state.meeting)

    const handleDecline = () => {
        socket.emit('request_entry_meeting_emit_response', {
            status: 'decline',
            meeting_id: meeting.meeting?.id,
            user_id: data.user.id
        })
    }

    const handleAccepted = () => {
        socket.emit('request_entry_meeting_emit_response', {
            status: 'accepted',
            meeting_id: meeting.meeting?.id,
            user_id: data.user.id
        })
    }
    return (
        <div className={styles.userApplicant}>
            <div className='flex items-center gap-2'>
                <div className={styles.userApplicantAvatar}>
                    <Avatar name={data.user.name} size='sm' className={styles.userApplicantAvatarImg} />
                </div>

                <div className={styles.userApplicantInfo}>
                    <span className={`${styles.userApplicantInfoName} truncate`}>{data.user.name}</span>
                    <span className={`${styles.userApplicantInfoEmail} truncate`}>{data.user.email}</span>
                </div>
            </div>

            <div className={styles.userApplicantActions}>
                <Button onClick={handleDecline} size='sm' colorScheme='blue' variant='outline'>
                    Negar
                </Button>

                <Button onClick={handleAccepted} size='sm' colorScheme='blue' variant='solid'>
                    Permitir
                </Button>
            </div>
        </div>
    )
}