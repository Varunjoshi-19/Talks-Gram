import mongoose from "mongoose";


const LikedPostSchema = new mongoose.Schema({
     
postId :  {
     type : String,
     required : true
},

userId : {
     type : String,
     required : true
},

});



export default mongoose.model("LikedPost" , LikedPostSchema);