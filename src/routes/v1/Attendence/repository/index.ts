import { Attendence } from "../../../../types/attendence";
import AttendenceModel, { AttendenceDocument } from "../../../../models/attendence";


export const createAttendence = (attendence: Attendence): Promise<AttendenceDocument> => {
    const attend = new AttendenceModel(attendence);
    return attend.save();
}

export const getAttendenceByUserId = (id: string): Promise<AttendenceDocument[] | null> => {
    return AttendenceModel.find({ user: id }).exec();
}

export const getAttendenceByUserIdAndDate = (id: string, date: string): Promise<AttendenceDocument | null> => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return AttendenceModel.findOne({
        user: id, date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    }).exec()
}

export const updateAttendence = async (
    id: string,
    date: string,
    attendenceData: Partial<Attendence>
): Promise<AttendenceDocument | null> => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return AttendenceModel.findOneAndUpdate(
        {
            user: id,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        },
        attendenceData,
        { new: true }
    );
};


export const deleteAttendence = async (id: string): Promise<AttendenceDocument | null> => {
    return AttendenceModel.findOneAndDelete({ user: id })
}