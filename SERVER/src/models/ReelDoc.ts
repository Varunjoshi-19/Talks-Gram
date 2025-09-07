import mongoose, { mongo } from "mongoose";


const ReelSchema = new mongoose.Schema({


    reelVideo: {
        url: String,
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

    authorUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    }



}, { timestamps: true });


export default mongoose.model("Reels", ReelSchema);