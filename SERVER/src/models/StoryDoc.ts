import mongoose from "mongoose";



const StorySchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true
    },

    storyData: {
        data: Buffer,
        duration: Number,
        contentType: String
    },


    createdTime: {  
        type: Date,
        required: true
    },
    expiredAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    },

    peopleViewedId: [{ type: mongoose.Schema.Types.ObjectId }]


});


export default mongoose.model("Story", StorySchema);