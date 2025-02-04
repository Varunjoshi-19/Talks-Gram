const mongoose = require("mongoose");


const LikedPostSchema = mongoose.Schema({
     
postId :  {
     type : String,
     required : true
},

userId : {
     type : String,
     required : true
},

});



module.exports = mongoose.model("LikedPost" , LikedPostSchema);