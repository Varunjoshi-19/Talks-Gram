const mongoose = require("mongoose");


const MessageSchema = mongoose.Schema({


    chatId: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true,
    },

    otherUserId: {
        type: String,
        required: true
    },

    username: {

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

    AdditionalData: [{
        data: Buffer,
        contentType: String
    }]

}, { timestamps: true });


module.exports = mongoose.model("Messages", MessageSchema);