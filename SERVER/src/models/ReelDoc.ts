import mongoose from "mongoose";


const ReelSchema = new mongoose.Schema({


    reelVideo: {

        data: Buffer,
        contentType: String
    },

    reelLike: {
        type: Number,
        default: 0,
    },

    reelComment: {
        type: Number,
        default: 0,
    },

    reelDescription: {
        type: String,
        default: "",
    },

    author: {
        userId: {
            type: String,
            required: true
        },
        userAccId: {
            type: String,
            required: true
        }
    }



} , {timestamps : true });


export default mongoose.model("Reels" , ReelSchema);