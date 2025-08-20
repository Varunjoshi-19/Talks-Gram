import mongoose from "mongoose";


const CommentSchema = new mongoose.Schema({
     
postId : {
     type : String,
     required : true
},

userId : {
     type : String,
     required : true
},

comment : {
     type : String,
     required : true
},

initiateTime : {
      type : Number,
      required: true
},
    
} , { timestamps : true })


export default mongoose.model("Comments" , CommentSchema);