const mongoose = require("mongoose");


const ProfileSchema = mongoose.Schema({
 

    userAccId : {
      type : String,
      required : true,

    },

     username: {
          type: String,
          required: true
     },

     fullname: {
          type: String,
          required: true
     },

     email: {
          type: String,
          required: true
     },

     post: {
          type: Number,
          default: 0,
     },

     profileImage: {
          data: Buffer,
          contentType: String,

     },

     bio: {
          type: String
     },

     followers: {
          type: Number,
          default: 0
     },

     following: {
          type: Number,
          default: 0
     }


}, { timestamps: true });






module.exports = mongoose.model("Profile", ProfileSchema);