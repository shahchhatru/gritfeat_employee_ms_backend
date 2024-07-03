import CustomError from "../../../utils/Error";
import { messages } from "../../../utils/Messages";
import { Attendence } from "../../../types/attendence";
import {
    createAttendence, getAttendenceByUserId, updateAttendence, deleteAttendence,
    getAttendenceByUserIdAndDate
} from './repository';

const AttendenceService = {
    async createAttendence(attendenceData: Attendence) {
        const attendence = await createAttendence(attendenceData);
        if (!attendence) {
            throw new CustomError(messages.attendence.creation_failed, 403);
        }
        return attendence;
    },
    async getAttendenceByUserId(id: string) {
        const attendence = await getAttendenceByUserId(id);
        if (!attendence) {
            throw new CustomError(messages.attendence.not_found, 404);
        }
        return attendence;
    },
    async updateAttendence(id: string, date: string, attendenceData: Partial<Attendence>) {
        const attendence = await updateAttendence(id, date, attendenceData);
        if (!attendence) {
            throw new CustomError(messages.attendence.not_found, 404);
        }
        return attendence;
    },
    async deleteAttendence(id: string) {
        const attendence = await deleteAttendence(id);
        if (!attendence) {
            throw new CustomError(messages.attendence.not_found, 404);
        }
        return attendence;
    }
    ,
    async getAttendenceByUserIdAndDate(id: string, date: string) {
        const attendence = await getAttendenceByUserIdAndDate(id, date);
        if (!attendence) {
            throw new CustomError(messages.attendence.not_found, 404);
        }
        return attendence;
    }
}
export default AttendenceService