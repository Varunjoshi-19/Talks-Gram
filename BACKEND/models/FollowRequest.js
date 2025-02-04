const mongoose = require("mongoose");


const FollowRequestSchema = mongoose.Schema({
     
userId :  {
     
    type : String,
    required : true
},

userIdOf : {
    
    type : String,
    required : true

},

usernameOf : {
    type : String,
    required : true 

},

acceptedStatus : {
     type : Boolean,
     default : false   
}

});



module.exports  = mongoose.model("FollowRequests" , FollowRequestSchema);