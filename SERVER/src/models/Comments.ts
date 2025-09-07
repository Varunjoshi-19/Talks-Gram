import mongoose from "mongoose";


const CommentSchema = new mongoose.Schema({

     postId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Posts",
          required: true
     },

     userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Profile",
          required: true
     },

     comment: {
          type: String,
          required: true
     },

     initiateTime: {
          type: Number,
          required: true
     },

}, { timestamps: true })




export default mongoose.model("Comments", CommentSchema);