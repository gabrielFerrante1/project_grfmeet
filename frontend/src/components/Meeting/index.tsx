import styles from './Meeting.module.scss';
import Footer from './Footer';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { IoMdClose } from 'react-icons/io'
import MeetingShare from './MeetingShare';
import Chat from './Chat';
import { useDispatch } from 'react-redux';
import { setMeetingDetail } from '../../redux/reducers/meetingReducer';
import Participants from './Participants';
import Config from './Config';
import ParticipantsVideos from './ParticipantsVideos';

export default () => {
    const meeting = useSelector((state: RootState) => state.meeting)

    const dispatch = useDispatch()

    const handleClose = () => dispatch(setMeetingDetail(''))

    return (
        <div className={styles.container}>
            <div className='flex gap-5 px-8 h-full pt-5 pb-2 flex-1'>
                <div className={styles.participants}>
                    <ParticipantsVideos />
                </div>
                <div
                    className={styles.cardDetail}
                    style={{ width: meeting.meetingDetail ? 360 : 0 }}
                >
                    <div className={styles.cardDetailHeader}>
                        <span className='truncate'>
                            {meeting.meetingDetail == 'info' ?
                                'Detalhes da reunião'
                                : meeting.meetingDetail == 'chat' ?
                                    'Mensagens na chamada'
                                    : meeting.meetingDetail == 'participant_info' ?
                                        'Pessoas'
                                        : meeting.meetingDetail == 'config' ?
                                            'Controles do organizador'
                                            : ''
                            }
                        </span>

                        <IoMdClose onClick={handleClose} />
                    </div>
                    <div className={styles.cardDetailBody}>
                        {meeting.meetingDetail == 'info' ?
                            <MeetingShare />
                            : meeting.meetingDetail == 'chat' ?
                                <Chat />
                                : meeting.meetingDetail == 'participant_info' ?
                                    <Participants />
                                    : meeting.meetingDetail == 'config' ?
                                        <Config />
                                        : ''}
                    </div>
                </div>
            </div>


            <div>
                <Footer />
            </div>
        </div>
    )
}