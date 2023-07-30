import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/mysql";
import { Meeting } from "./Meeting";
import { User } from "./User";

interface MeetingParticipantsInstance extends Model {
    id: number;
    meeting_id: number;
    user_id: number;
    socket_id: string;
    is_admin: boolean;
    is_banned: boolean;
    is_online: boolean;
}

export const MeetingParticipants = sequelize.define<MeetingParticipantsInstance>('MeetingParticipants', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    meeting_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'meetings',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    socket_id: {
        type: DataTypes.STRING
    },
    is_admin: {
        type: DataTypes.BOOLEAN
    },
    is_banned: {
        type: DataTypes.BOOLEAN
    },
    is_online: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'meeting_participants',
    timestamps: false
})

Meeting.hasMany(MeetingParticipants, { foreignKey: 'meeting_id' })
User.hasOne(MeetingParticipants, { foreignKey: 'user_id' })