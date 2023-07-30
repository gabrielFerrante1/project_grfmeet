import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/mysql";
import { Meeting } from "./Meeting";
import { User } from "./User";

interface MeetingChatMessagesInstance extends Model {
    id: number;
    meeting_id: number;
    user_id: number;
    body: string;
    date: Date
}

export const MeetingChatMessages = sequelize.define<MeetingChatMessagesInstance>('MeetingChatMessages', {
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
    date: {
        type: DataTypes.STRING
    },
    body: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'meeting_chat_messages',
    timestamps: false
})

Meeting.hasOne(MeetingChatMessages, { foreignKey: 'meeting_id' })
User.hasMany(MeetingChatMessages, { foreignKey: 'user_id' })