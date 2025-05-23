const mongoose = require("mongoose");


const UserSchema = mongoose.Schema({


    fullname : { 
         
        type : String,
        required : true,

    },

    username : { 
      type : String,
      required : true,
      unique : true

    },

    email : { 
       type : String,
       required : true,
       unique : true

    },

    password : { 
        type : String,
        required : true

    },


    salting : { 
        type : String,
        required : true
    }


} , { timestamps : true });



module.exports =  mongoose.model("Accounts", UserSchema);