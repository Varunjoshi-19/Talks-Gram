const mongoose=  require("mongoose");


const CommSchema  = mongoose.Schema({
     
userId  : {
     type : String,
     required : true
},

commId : {
     type : String,
     required : true
}

})

module.exports = mongoose.model("CommunicationIds" , CommSchema);