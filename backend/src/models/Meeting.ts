import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';
import { User } from './User';

export interface MeetingInstance extends Model {
    id: number;
    code: string;
    allowed_entry: boolean;
    allowed_messages: boolean;
    allowed_video: boolean;
    allowed_audio: boolean;
    allowed_screen_sharing: boolean;
    user_id: number;
}

export const Meeting = sequelize.define<MeetingInstance>('Meeting', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    code: {
        type: DataTypes.TEXT
    },
    allowed_entry: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    allowed_messages: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
    },
    allowed_video: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
    },
    allowed_audio: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
    },
    allowed_screen_sharing: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
    },

}, {
    tableName: 'meetings',
    timestamps: false
});

User.hasMany(Meeting, { foreignKey: 'user_id' })