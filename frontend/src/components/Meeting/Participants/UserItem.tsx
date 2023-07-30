import { Avatar, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Tooltip } from '@chakra-ui/react';
import { MeetingParticipant } from '../../../types/Meeting'
import styles from './Participants.module.scss'
import { HiDotsVertical } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import useAuth from '../../../utils/useAuth';
import { MdOutlineKey, MdOutlineKeyOff, MdOutlineNotInterested, MdRemoveCircleOutline } from 'react-icons/md';
import { socket } from '../../Layout';

type Props = {
    data: MeetingParticipant;
    user_is_admin: boolean
}

export default ({ data, user_is_admin }: Props) => {
    const meeting = useSelector((state: RootState) => state.meeting)

    const { user } = useAuth()

    const handleKick = (mode: 'kick' | 'ban') => {
        socket.emit('emit_kick_meeting', {
            meeting_id: meeting.meeting?.id,
            user_id: data.user.id,
            mode
        })
    }

    const handleUpdateAdmin = (admin: boolean) => {
        socket.emit('emit_update_admin', {
            meeting_id: meeting.meeting?.id,
            user_id: data.user.id,
            admin
        })
    }

    return (
        <div className={styles.user}>
            <div className={styles.userAvatar}>
                <Avatar name={data.user.name} size='sm' className={styles.userAvatarImg} />
            </div>

            <div className={styles.userInfo}>
                <span className={`${styles.userInfoName} truncate`}>{data.user.name} {data.user.id == user?.id && '(Você)'}</span>
                <span className={`${styles.userInfoEmail} truncate`}>{data.user.id == meeting.meeting?.user_id ? 'Organizador da reunião' : data.user.email}</span>
            </div>

            {user_is_admin && meeting.meeting?.user_id != data.user.id && data.user.id != user?.id ?
                <Tooltip label='Mais opções' placement='bottom' openDelay={500}>

                    <Menu isLazy >
                        <MenuButton className={styles.userActions}> <HiDotsVertical className={styles.userActionsIcon} /> </MenuButton>
                        <MenuList>
                            {data.is_admin ?
                                <MenuItem onClick={() => handleUpdateAdmin(false)} icon={<MdOutlineKeyOff className={'text-xl'} />}>Remover admin</MenuItem>
                                :
                                <MenuItem onClick={() => handleUpdateAdmin(true)} icon={<MdOutlineKey className={'text-xl'} />}>Promover admin</MenuItem>
                            }
                            <MenuDivider />
                            <MenuItem onClick={() => handleKick('kick')} icon={<MdRemoveCircleOutline className={'text-xl'} />}>Expulsar</MenuItem>
                            <MenuItem onClick={() => handleKick('ban')} icon={<MdOutlineNotInterested className={'text-xl'} />} color='red.600'>Banir</MenuItem>

                        </MenuList>
                    </Menu>
                </Tooltip>
                : ''}
        </div>
    )
}