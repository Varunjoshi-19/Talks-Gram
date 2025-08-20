import { autoInjectable } from "tsyringe";
import PostDoc from "../../models/PostDoc";
import LikedPostDoc from "../../models/LikedPost";
import ProfileDoc from "../../models/ProfileDoc";
import CommentDoc from "../../models/Comments";
import PersonalChatDoc from "../../models/PersonalChatDoc";
import StoryDoc from "../../models/StoryDoc";
import NoteDoc from "../../models/NoteDoc";

@autoInjectable()
class PostServices {

    async handleNewPostUpload(profile: string, caption: string, postImage: Express.Multer.File) {
        if (!postImage || !profile) {
            return { status: 404, success: false, message: "Failed to post" };
        }

        const parsedProfile = JSON.parse(profile);

        const newPostInfo: any = {
            postImage: {
                data: postImage.buffer,
                contentType: postImage.mimetype
            },
            author: {
                userId: parsedProfile._id,
            }
        };

        if (caption !== "") newPostInfo.postDescription = caption;

        try {
            const newPost = await PostDoc.create(newPostInfo);
            if (!newPost) return { status: 404, success: false, message: "Failed to upload post" };

            await ProfileDoc.findOneAndUpdate(
                { _id: parsedProfile._id },
                { $inc: { post: 1 } },
                { new: true }
            );

            return { status: 200, success: true, message: "Successfully uploaded" };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async handleAddLikePost(postId: string, userId: string) {
        if (!postId || !userId) return { status: 404, success: false, message: "IDs required" };

        const query = { postId, userId };

        try {
            const newLikePost = await LikedPostDoc.create(query);
            if (!newLikePost) return { status: 404, success: false, message: "Failed to like post" };

            await PostDoc.findOneAndUpdate({ _id: postId }, { $inc: { postLike: 1 } }, { new: true });

            return { status: 200, success: true };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async handleRemoveLikePost(postId: string, userId: string) {
        if (!postId || !userId) return { status: 404, success: false, message: "IDs required" };

        const query = { postId, userId };

        try {
            const removedLikePost = await LikedPostDoc.findOneAndDelete(query);
            if (!removedLikePost) return { status: 404, success: false, message: "Failed to remove like" };

            await PostDoc.findOneAndUpdate({ _id: postId }, { $inc: { postLike: -1 } }, { new: true });

            return { status: 200, success: true };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async handlePostComment(postId: string, userId: string, commentText: string) {
        const query = {
            postId,
            userId,
            comment: commentText,
            initiateTime: Date.now()
        };

        try {
            const comment = await CommentDoc.create(query);
            if (!comment) return { status: 404, success: false, message: "Failed to post comment" };

            await PostDoc.findByIdAndUpdate(postId, { $inc: { postComment: 1 } }, { new: true });

            return { status: 202, success: true, message: "Comment posted", data: comment };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async SharedPost(data: any, refId: string) {

        try {
            const { userId,
                senderUsername,
                receiverUsername,
                initateTime,
                otherUserId,
                chatId,
                sharedContent } = data;

            if (!refId) {
                return { message: "post refId required to share", status: 404 };
            }

            if (!userId || !otherUserId || !chatId) {
                return { message: "some id's are missing ", status: 404 };
            }
            if (!sharedContent) {
                return { message: "share content is required! no data avaliable", status: 404 }
            }

            const storeMessage = {
                chatId,
                userId,
                otherUserId,
                senderUsername,
                receiverUsername,
                initateTime,
                sharedContent
            }

            const id = sharedContent.refId;
            const sharedPost = await PersonalChatDoc.create(storeMessage);

            if (!sharedPost) {
                return { message: "failed to share this post", status: 404 };
            }

            await PostDoc.findByIdAndUpdate(id, { $inc: { postShare: 1 } });
            return { message: "successfully shared this post", status: 200 };
        }
        catch (error) {
            return { message: error, status: 505 };
        }
    }

    async UploadNewStory(data: any, storyFile: Express.Multer.File) {
        try {
            const { userId, username, storyDuration, createdTime, expiredAt } = data;
            if (!username || !userId || !createdTime || !expiredAt || !storyFile) {
                return { status: 404, success: false };
            }

            // check already posted 
            const alreadyStory = await StoryDoc.findOne({ userId: userId });
            if (alreadyStory) {
                return { status: 404, success: false, message: "story already there" }
            }

            const story = new StoryDoc({
                userId: userId,
                username: username || "Unknown",
                storyData: {
                    data: storyFile.buffer,
                    duration: Number(storyDuration),
                    contentType: storyFile.mimetype
                },
                createdTime: createdTime,
                expiredAt: expiredAt
            });

            await story.save();

            return { status: 200, success: true };

        } catch (error: any) {
            return { status: 505, success: false };
        }

    }

    async UploadNewNote(data: any) {
        try {
            const { userId, note, expiredAt } = data;
            if (!userId || !note || !expiredAt) {
                return { status: 404, success: false, message: "required all details" }
            }
            const noteData: any = {
                userId,
                noteMessage: note,
                expiredAt
            }
            const existingNote = await NoteDoc.findOne({ userId: userId }).lean();
            if (existingNote) {
                await NoteDoc.findOneAndUpdate({ userId: userId }, noteData);
                return { status: 200, success: true, message: "new note added!" }
            }

            const newNote = new NoteDoc(noteData);
            await newNote.save();

            return { status: 200, success: true, message: "new note added!" }
        } catch (error) {
            return { status: 505, success: false, message: "internal error failed to add!" }
        }

    }




}

export default PostServices;
