const jwt = require("jsonwebtoken");

function SaveAuthentication(userdetail) {
     
const accessToken = jwt.sign(userdetail , process.env.SCERET_TOKEN_KEY);

return accessToken;

}

module.exports = { 

    SaveAuthentication
}