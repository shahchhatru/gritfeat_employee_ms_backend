import { Attendence } from "../../../../types/attendence";
import { AttendenceDocument, AttendenceModel } from "../../../../models/attendence";


export const createAttendence = (attendence: Attendence): Promise<AttendenceDocument> => {
    const attend = new AttendenceModel(attendence);
    return attend.save();
}