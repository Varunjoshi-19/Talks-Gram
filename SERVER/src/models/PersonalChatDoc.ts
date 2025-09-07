import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({


    chatId: {
        type: String,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },

    otherUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    },

    senderUsername: {
        type: String,
        required: true,
    },
    receiverUsername: {
        type: String,
        required: true
    },

    initateTime: {
        type: String,
        required: true
    },

    chat: {
        type: String,
    },

    seenStatus: {
        type: Boolean,
        default: false,
    },

    AdditionalData: [{
        url: String,
        contentType: String
    }],

    sharedContent: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts",
        }
    }

}, { timestamps: true });


export default mongoose.model("Messages", MessageSchema);