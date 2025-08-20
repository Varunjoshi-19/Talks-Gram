import mongoose from "mongoose";


const PostSchema = new mongoose.Schema({

    postImage: {
        data: Buffer,
        contentType: String

    },

    postLike: {
        type: Number,
        default: 0
    },

    postComment: {
        type: Number,
        default: 0
    },

    postShare: {
        type: Number,
        default: 0

    },

    postDescription: {
        type: String,
        default: ""
    },

    author: {

        userId: {
            type: mongoose.Schema.ObjectId,
            required: true,

        }
    }

}, { timestamps: true });


export default mongoose.model("Posts", PostSchema);