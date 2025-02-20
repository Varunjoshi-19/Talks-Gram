const mongoose = require("mongoose");


const ReelSchema = new mongoose.Schema({

    reelVideo: {

        data: Buffer,
        contentType: String
    },

    reelLike: {
        type: Number,
        default: 0,
    },

    reelComment: {
        type: Number,
        default: 0,
    },

    reelDescription: {
        type: String,
        default: "",
    },

    author: {
        userId: {
            type: String,
            required: true
        },
        userAccId: {
            type: String,
            required: true
        }
    }



} , {timestamps : true })


module.exports = mongoose.model("Reels", ReelSchema);