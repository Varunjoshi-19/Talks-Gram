const express = require("express");
const { GenerateChatId , fetchSingleUserProfile , FetchAllPersonalChats , SavePersonalChats ,
    fetchAllRequests , HandleRemoveRequested ,  fetchChattedUser  , HandleFollowRequest, 
    checkAlreadyRequested  , checkExistsInFollower , HandleAcceptedRequest , HandleRemoveFollower 
,handlePutAdditionalData , handlePutAudioDataInfo , renderMessageItems} = require("../controllers/PersonalChat.js");

const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage()})


router.get("/generate-chatId/:id" , GenerateChatId);

router.get("/fetchUser/:id" , fetchSingleUserProfile);

router.post("/fetch-all-personal-chats/:id", FetchAllPersonalChats);

router.post("/save-personal-chats", SavePersonalChats);

router.post("/fetch-chatted-users/:id" , fetchChattedUser);

router.post("/SendFollowRequest" , HandleFollowRequest);

router.post("/checkRequested" , checkAlreadyRequested);

router.post("/checkFollowed" , checkExistsInFollower);

router.post("/removeFromRequested" , HandleRemoveRequested);

router.post("/AcceptedRequest" , HandleAcceptedRequest);

router.post("/removeFollower" , HandleRemoveFollower);

router.post("/fetchRequests/:id" , fetchAllRequests);

router.post("/additionalInfo-message" ,  upload.array("files" , 10),  handlePutAdditionalData);

router.post("/audioDataInfo-message"  , upload.single("audioFile") , handlePutAudioDataInfo)

router.get("/render-message-items/:id1/:id2" , renderMessageItems);



module.exports = router;