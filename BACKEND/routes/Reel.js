const express = require("express");
const router = express.Router();
const { multerStorage } = require("../controllers/user");
const upload = multerStorage();
const {
    UploadReel,
    FetchReel,
    RenderReelPost,
    handleAddLikePost,
    handleRemoveLikePost } = require("../controllers/Reels");



router.post("/newReel", upload.single("postReel"), UploadReel);
router.post("/fetch-reels", FetchReel);
router.post("/remove-likePost", handleRemoveLikePost);
router.post("/add-likePost", handleAddLikePost);
router.get("/render-reel/:id", RenderReelPost);


module.exports = router;
