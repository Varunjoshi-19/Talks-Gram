import mongoose from "mongoose";


const FollowersSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true

    },

    FollowedById: {
        type: String,
        required: true
    },

    FollowedByUsername: {
        type: String,
        required: true
    }



});


export default mongoose.model("Followers", FollowersSchema);