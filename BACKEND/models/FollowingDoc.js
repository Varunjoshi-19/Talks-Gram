const mongoose = require("mongoose");


const FollowingSchema = mongoose.Schema({

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


module.exports  =  mongoose.model("Followings" , FollowingSchema);