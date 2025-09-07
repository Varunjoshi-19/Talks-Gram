import mongoose from "mongoose";


const PostSchema = new mongoose.Schema({

    postImage: {
        url: String,
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

    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    }
}, { timestamps: true });


export default mongoose.model("Posts", PostSchema);