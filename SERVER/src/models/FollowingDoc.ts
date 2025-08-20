import mongoose from "mongoose";

const FollowingSchema = new  mongoose.Schema({

 userId : {
   
    type : String,
    required : true
    
 },

 FollowingWhomId : {
     type : String,
     required : true
 },

 FollowingWhomUsername : {
     type : String,
     required : true
 }



})


export default  mongoose.model("Followings" , FollowingSchema);