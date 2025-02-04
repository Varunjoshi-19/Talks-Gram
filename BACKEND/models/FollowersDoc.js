const mongoose  = require("mongoose");


const FollowersSchema = mongoose.Schema({

userId : {
type : String,
required : true
    
},

FollowedById : {
     type : String,
     required : true
},

FollowedByUsername : {
     type : String,
     required : true
}



});


module.exports  = mongoose.model("Followers" , FollowersSchema);