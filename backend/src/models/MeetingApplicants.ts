import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/mysql";
import { Meeting } from "./Meeting";
import { User } from "./User";


interface MeetingApplicantsInstance extends Model {
    id: number;
    meeting_id: number;
    user_id: number;
}

export const MeetingApplicants = sequelize.define<MeetingApplicantsInstance>('MeetingApplicants', {
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
    }
}, {
    tableName: 'meeting_applicants',
    timestamps: false
})

Meeting.hasMany(MeetingApplicants, { foreignKey: 'meeting_id' })
User.hasOne(MeetingApplicants, { foreignKey: 'user_id' })