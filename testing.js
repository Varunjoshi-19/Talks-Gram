const crypto = require("crypto");

const secretKey = "130nd1001ed";

function generateCommId(commonId) { 

    const chatId  = crypto.createHmac("sha256" , secretKey).update(commonId).digest("hex");
    
    return chatId;

}




const myId  = "34";
const otherId = "12";
const sorted = [myId , otherId].sort();
const combinedstring = sorted[0] + sorted[1];


const id = generateCommId(combinedstring);
console.log(id);