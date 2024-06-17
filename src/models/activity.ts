import { ActivityLog } from "types";
import mongoose,{Document,Schema} from "mongoose";

const activitySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref:"User",
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    },
)


const Activity = mongoose.model<ActivityLog & Document>("Activity", activitySchema);
export default Activity