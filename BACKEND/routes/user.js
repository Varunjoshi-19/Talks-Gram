const express = require("express");

const { LoginHandler,
    SignupHandler,
    NewProfileHandler,
    fetchProfileDetails,
    fetchAllAccounts,
    SearchUsers,
    fetchOtherProfile,
    GenerateOTP,
    resetPassword ,
    checkValidParams,
    fetchCommunicationId,
    renderImage ,
multerStorage,
addCommIds,
VerifyOTP} = require("../controllers/user.js");

const router = express.Router();

const upload = multerStorage();


router.post("/login", LoginHandler);

router.post("/signup", SignupHandler);

router.post("/sendOtp",  GenerateOTP);

router.post("/verifyOtp" ,VerifyOTP);

router.post("/resetPassword",resetPassword);

router.post("/valid-password-reset/:id1/:id2" , checkValidParams);

router.get("/profileImage/:id" , renderImage);

router.post("/newProfile" , upload.single("profileImage") ,   NewProfileHandler);

router.post("/fetchProfileDetails/:id" , fetchProfileDetails);

router.post("/fetchOtherUser/:id" , fetchOtherProfile);

router.post("/allAccounts" , fetchAllAccounts);

router.post("/searchUser", SearchUsers);

router.post("/add-commid/:id" , addCommIds );

router.post("/communication-id/:id" , fetchCommunicationId);



module.exports = router;