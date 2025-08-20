import mongoose from "mongoose";

const CommSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    commId: {
        type: String,
        required: true
    }

})

export default mongoose.model("CommunicationIds", CommSchema);