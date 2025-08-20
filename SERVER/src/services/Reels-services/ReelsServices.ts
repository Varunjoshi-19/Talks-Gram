import { autoInjectable } from "tsyringe";
import ReelDoc from "../../models/ReelDoc";
import ProfileDoc from "../../models/ProfileDoc";
import { reelsUploadPath } from "../..";
import fs from "fs";
import allHelpServices from "../../utils";
import LikedPostDoc from "../../models/LikedPost";

interface ReelUploadPayload {
    reelVideo: {
        data: Buffer,
        contentType: string
    },
    author: {
        userId: string,
        userAccId: string
    },
    reelDescription?: string
}


@autoInjectable()
class ReelsServices {

    constructor(private allHelper: allHelpServices) {
        this.allHelper = allHelper;
    }


    async handleNewPostUpload(profile: string, caption: string, postReel: Express.Multer.File) {
        if (!postReel || !profile) {
            return { status: 400, error: "Missing file or profile data" };
        }

        let parsedProfile;
        try {
            parsedProfile = JSON.parse(profile);
        } catch {
            return { status: 400, error: "Invalid profile data" };
        }

        const newPostInfo: ReelUploadPayload = {
            reelVideo: {
                data: postReel.buffer,
                contentType: postReel.mimetype,
            },
            author: {
                userId: parsedProfile._id,
                userAccId: parsedProfile.userAccId,
            },
        };

        if (caption !== "") newPostInfo.reelDescription = caption;

        try {
            const newPost = await ReelDoc.create(newPostInfo);
            if (!newPost) return { status: 500, error: "Failed to upload post" };

            await ProfileDoc.findOneAndUpdate(
                { _id: parsedProfile._id },
                { $inc: { post: 1 } },
                { new: true }
            );

            const filePath = `${reelsUploadPath}/${Date.now()}-${postReel.originalname}`;
            fs.writeFileSync(filePath, postReel.buffer);

            return { status: 200, message: "Successfully uploaded" };
        } catch (error: any) {
            return { status: 500, error: error.message };
        }
    }

    async handleFetchReels(skip: string) {
        try {
            const allReels = await ReelDoc.find({}).skip(parseInt(skip));

            if (allReels.length === 0) {
                return { status: 204, statusText: "No Content", message: "No posts available" };
            }

            const shuffledReels = this.allHelper.shufflePosts(allReels);
            return { status: 200, shuffledReels };
        } catch (error: any) {
            return { status: 500, error: error.message };
        }
    }

     async handleAddLike(postId: string, userId: string) {
        if (!postId || !userId) {
            return { status: 400, message: "IDs required" };
        }

        const query = { postId, userId };

        try {
            const newLikePost = await LikedPostDoc.create(query);
            if (!newLikePost) {
                return { status: 500, message: "Failed to like post" };
            }

            await ReelDoc.findOneAndUpdate(
                { _id: postId },
                { $inc: { reelLike: 1 } },
                { new: true }
            );

            return { status: 200, statusText: "Liked", liked: true };
        } catch (error: any) {
            return { status: 500, error: error.message };
        }
    }

    async handleRemoveLike(postId: string, userId: string) {
        if (!postId || !userId) {
            return { status: 400, message: "IDs required" };
        }

        const query = { postId, userId };

        try {
            const removedLikePost = await LikedPostDoc.findOneAndDelete(query);
            if (!removedLikePost) {
                return { status: 404, message: "Failed to remove like post" };
            }

            await ReelDoc.findOneAndUpdate(
                { _id: postId },
                { $inc: { reelLike: -1 } },
                { new: true }
            );

            return { status: 200, statusText: "Unliked", liked: false };
        } catch (error: any) {
            return { status: 500, error: error.message };
        }
    }





}

export default ReelsServices