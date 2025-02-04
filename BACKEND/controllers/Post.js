const PostDoc = require("../models/PostDoc.js");
const LikedPostDoc = require("../models/LikedPost.js");
const CommentDoc = require("../models/Comments.js");
const ProfileDoc = require("../models/ProfileDoc.js");

async function HandleNewPostUpload(req, res) {

    const { profile, caption } = req.body;
    const postImage = req.file;

    if (!postImage || !profile) return res.status(404).json({ error: "failed to post" });

    const parsedProfile = JSON.parse(profile);


    const newPostInfo = {

        postImage: {
            data: postImage.buffer,
            contentType: postImage.mimetype
        },

        author: {
            userId: parsedProfile._id,
            userAccId: parsedProfile.userAccId
        }
    }

    if (caption != "") {
        newPostInfo.postDescription = caption;
    }

    try {

        const newPost = await PostDoc.create(newPostInfo);
        if (!newPost) return res.status(404).json({ error: "failed to upload post" })



            await ProfileDoc.findOneAndUpdate(
                { _id: parsedProfile._id },
                { $inc: { post: 1 } },
                { new: true }
    
            );

        res.status(200).json({ message: "successfully uploaded" });

    }

    catch (error) {

        res.status(505).json({ error: error.message });
    }


}


async function fetchAllPosts(req, res) {

    const id = req.params.id;
    try {

        const allPosts = await PostDoc.find({ "author.userId": id });
        res.status(202).json({ allPosts });
    }
    catch (error) {
        res.status(505).json({ error: error.message });
    }
}

async function HandleDeletePost(req, res) {

// implementation


}

async function fetchPosts(req, res) {

const skip = req.query.skip;

    try {

        const allPosts = await PostDoc.find({}).sort({createdAt : 1}).skip(skip).limit(5);
         
        if(allPosts == "") return res.status(201).json({ status : "empty" });
        
        if (!allPosts ) return res.status(404).json({ error: "no post avaliable" });


        const shuffledPosts = shufflePosts(allPosts);

        res.status(202).json({ shuffledPosts });
    }
    catch (error) {
        res.status(505).json({ error: error.message })
    }

}

async function fetchLikedPost(req, res) {

    const { postId, userId } = req.body;
    console.log(postId, userId);
    const query = {
        $and: [
            { postId: postId },
            { userId: userId },
        ],
    };


    try {

        const likedPost = await LikedPostDoc.find(query);
        console.log(likedPost);

        if (!likedPost || likedPost == "") return res.status(202).json({ likeStatus: false })

        res.status(200).json({ likeStatus: true });

    }
    catch (error) {
        res.status(505).json({ error: error.message })
    }


}

async function renderPostImage(req, res) {
    const id = req.params.id;
    if (!id || id == "") return res.status(404).json({ error: "failed to render image" });

    try {

        const post = await PostDoc.findOne({ _id: id });

        if (!post || !post.postImage || !post.postImage.data) {
            return res.status(404).json({ error: "Image not found" });
        }
        res.contentType(post.postImage.contentType);
        res.send(post.postImage.data);
    }
    catch (error) {
        res.status(404).json({ error: "error fetching image" })
    }



}

async function handleAddLikePost(req, res) {

    const { postId, userId } = req.body;

    if (!postId, !userId) return res.status(404).json({ message: "id's required" });

    const query = {
        postId: postId,
        userId: userId
    }

    try {

        const newLikePost = await LikedPostDoc.create(query);
        if (!newLikePost || newLikePost == "") res.status(404).json({ message: "failed to like post" });

        // update the post likes 

        await PostDoc.findOneAndUpdate(
            { _id: postId },
            { $inc: { postLike: 1 } },
            { new: true }
        )

        res.status(200).json({ status: true });

    }
    catch (error) {

        res.status(505).json({ error: error.message })
    }

}

async function handleRemoveLikePost(req, res) {

    const { postId, userId } = req.body;

    if (!postId, !userId) return res.status(404).json({ message: "id's required" });

    const query = {
        postId: postId,
        userId: userId
    }

    try {

        const removedLikePost = await LikedPostDoc.findOneAndDelete(query);
        if (!removedLikePost || removedLikePost == "") res.status(404).json({ message: "failed to remove like post" });

        // update the post likes 

        await PostDoc.findOneAndUpdate(
            { _id: postId },
            { $inc: { postLike: -1 } },
            { new: true }
        )

        res.status(200).json({ status: false });

    }
    catch (error) {

        res.status(505).json({ error: error.message })
    }

}

async function handlePostComment(req, res) {

    const { postId, userId, comment } = req.body;


    const query = {
        postId: postId,
        userId: userId,
        comment: comment,
        initiateTime : Date.now()
    }

    try {


        const comment = await CommentDoc.create(query);
        if (!comment || comment == "") return res.status(404).json({ message: "failed to post comment" });


        await PostDoc.findByIdAndUpdate(
        postId,
         {$inc : { postComment : 1 }},
         {new : true}

        )

        res.status(202).json({ message: "comment posted" , comment });

    }
    catch (error) {
        res.status(505).json({ error: error.message });
    }


}

async function fetchAllComments(req ,res) {
    
    const id = req.params.id;
    console.log(id);

try { 

    const comments = await CommentDoc.find({ postId : id }).sort({ createdAt : -1 });
    if(!comments || comments == "") return res.status(404).json({ message : "no comment yet" });


    res.status(202).json({ comments });
}
catch(error) {
     res.status(505).json({ error : error.message })
}

}



// other functions 
function shufflePosts(allPosts) {

    for (let i = allPosts.length - 1; i > 0; i--) {

        const randomIndex = Math.floor(Math.random() * (i + 1));


        [allPosts[i], allPosts[randomIndex]] = [allPosts[randomIndex], allPosts[i]];

    }

    return allPosts;
}

module.exports = {

    HandleNewPostUpload,
    fetchAllPosts,
    fetchPosts,
    fetchLikedPost,
    handleAddLikePost,
    handleRemoveLikePost,
    handlePostComment,
    fetchAllComments,
    renderPostImage,
    HandleDeletePost

}