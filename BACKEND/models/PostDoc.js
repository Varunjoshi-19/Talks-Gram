const mongoose =  require("mongoose");


const PostSchema = mongoose.Schema({ 

postImage : {
    data : Buffer,
    contentType : String
    
},

postLike : {
     type  : Number,
     default : 0
},

postComment : {
     type : Number,
     default : 0
},

postDescription  : { 
    type : String,
    default : ""
},

author : {
     
    userId : {
        type : String,
        required : true,

    },

    userAccId : {
         type : String, 
         required : true
    }


}

} , { timestamps : true });


module.exports = mongoose.model("Posts" , PostSchema );