import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    noteMessage: {
        type: String,
        required: true
    },

    expiredAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    }

});


export default mongoose.model("Note" , NoteSchema);