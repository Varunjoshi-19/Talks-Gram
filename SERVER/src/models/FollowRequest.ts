import mongoose from "mongoose";

const FollowRequestSchema = new mongoose.Schema({

    userId: {

        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    userIdOf: {

        type: mongoose.Schema.Types.ObjectId,
        required: true

    },

    usernameOf: {
        type: String,
        required: true

    },

    acceptedStatus: {
        type: Boolean,
        default: false
    }

});



export default mongoose.model("FollowRequests", FollowRequestSchema);