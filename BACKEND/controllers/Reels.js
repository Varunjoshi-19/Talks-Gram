const ReelDoc = require("../models/ReelDoc");
const ProfileDoc = require("../models/ProfileDoc");
const LikedPostDoc = require("../models/LikedPost");
const fs = require("node:fs");
const path = require("path");

const actualPath = "/home/varun/Personal-data/FULL STACK DEVLOPMENT/GIT-HUB/TalksGram/BACKEND/public/posts";
const uploadpath = path.resolve(actualPath);

async function UploadReel(req, res) {

    const { profile, caption } = req.body;
    const postReel = req.file;

    if (!postReel || !profile) return res.status(404).json({ error: "failed to post" });

    const parsedProfile = JSON.parse(profile);


    const newPostInfo = {

        reelVideo: {
            data: postReel.buffer,
            contentType: postReel.mimetype
        },

        author: {
            userId: parsedProfile._id,
            userAccId: parsedProfile.userAccId
        }
    }

    if (caption != "") {
        newPostInfo.reelDescription = caption;
    }

    try {

        const newPost = await ReelDoc.create(newPostInfo);
        if (!newPost) return res.status(404).json({ error: "failed to upload post" })



        await ProfileDoc.findOneAndUpdate(
            { _id: parsedProfile._id },
            { $inc: { post: 1 } },
            { new: true }

        );

        const filePath = `${uploadpath}/${Date.now()}-${postReel.originalname}`;
        fs.writeFileSync(filePath, postReel.buffer);
        res.status(200).json({ message: "successfully uploaded" });

    }

    catch (error) {
        res.status(505).json({ error: error.message });
    }


}

async function FetchReel(req, res) {

    const skip = req.query.skip;
    console.log(skip);
    try {

        const allReels = await ReelDoc.find({}).skip(skip);

        if (allReels == "") return res.status(201).json({ status: "empty" });

        if (!allReels) return res.status(404).json({ error: "no post avaliable" });


        const shuffledReels = shufflePosts(allReels);

        res.status(202).json({ shuffledReels });
    }
    catch (error) {
        res.status(505).json({ error: error.message })
    }


}

async function RenderReelPost(req, res) {
    const id = req.params.id?.trim();

    if (!id) {
        return res.status(400).json({ error: "Invalid ID provided" });
    }

    try {
        const post = await ReelDoc.findOne({ _id: id });

        if (!post?.reelVideo?.data) {
            return res.status(404).json({ error: "Video not found" });
        }

        res.contentType(post.reelVideo.contentType);
        res.send(post.reelVideo.data);
    } catch (error) {
        console.error("Error fetching video:", error);
        res.status(500).json({ error: "Server error while fetching video" });
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
        if (!newLikePost || newLikePost == "") return  res.status(404).json({ message: "failed to like post" });

        // update the post likes 

        await ReelDoc.findOneAndUpdate(
            { _id: postId },
            { $inc: { reelLike: 1 } },
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
        if (!removedLikePost || removedLikePost == "") return res.status(404).json({ message: "failed to remove like post" });

        // update the post likes 
        await ReelDoc.findOneAndUpdate(
            { _id: postId },
            { $inc: { reelLike: -1 } },
            { new: true }
        )

        res.status(200).json({ status: false });

    }
    catch (error) {

        res.status(505).json({ error: error.message })
    }

}


// other function


function shufflePosts(allPosts) {

    for (let i = allPosts.length - 1; i > 0; i--) {

        const randomIndex = Math.floor(Math.random() * (i + 1));

        [allPosts[i], allPosts[randomIndex]] = [allPosts[randomIndex], allPosts[i]];

    }

    return allPosts;
}



module.exports = {

    UploadReel,
    FetchReel,
    RenderReelPost,
    handleAddLikePost,
    handleRemoveLikePost

}