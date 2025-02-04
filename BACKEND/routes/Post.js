const express = require("express");
const { multerStorage } = require("../controllers/user.js");
const router = express.Router();

const { HandleDeletePost , HandleNewPostUpload ,
    fetchAllPosts , renderPostImage,
    fetchPosts , fetchLikedPost , handleAddLikePost,
    handleRemoveLikePost  , handlePostComment , fetchAllComments
} = require("../controllers/Post.js");

const upload  = multerStorage();


router.post("/allPosts/:id" , fetchAllPosts);

router.post("/fetchPosts" , fetchPosts);

router.post("/newPost" , upload.single('postImage') , HandleNewPostUpload);

router.post("/deletePost" , HandleDeletePost);

router.get("/postImage/:id" , renderPostImage);

router.post("/fetchLikePost" , fetchLikedPost);

router.post("/add-likePost" , handleAddLikePost);

router.post("/remove-likePost" , handleRemoveLikePost);

router.post("/add-comment" , handlePostComment);

router.post("/fetch-comments/:id" , fetchAllComments);



module.exports = router;