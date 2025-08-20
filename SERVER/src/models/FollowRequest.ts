import mongoose from "mongoose";

const FollowRequestSchema = new mongoose.Schema({

    userId: {

        type: String,
        required: true
    },

    userIdOf: {

        type: String,
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