"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const PostDoc_1 = __importDefault(require("../../models/PostDoc"));
const LikedPost_1 = __importDefault(require("../../models/LikedPost"));
const ProfileDoc_1 = __importDefault(require("../../models/ProfileDoc"));
const Comments_1 = __importDefault(require("../../models/Comments"));
const PersonalChatDoc_1 = __importDefault(require("../../models/PersonalChatDoc"));
const StoryDoc_1 = __importDefault(require("../../models/StoryDoc"));
const NoteDoc_1 = __importDefault(require("../../models/NoteDoc"));
let PostServices = class PostServices {
    async handleNewPostUpload(profile, caption, postImage) {
        if (!postImage || !profile) {
            return { status: 404, success: false, message: "Failed to post" };
        }
        const parsedProfile = JSON.parse(profile);
        const newPostInfo = {
            postImage: {
                data: postImage.buffer,
                contentType: postImage.mimetype
            },
            author: {
                userId: parsedProfile._id,
            }
        };
        if (caption !== "")
            newPostInfo.postDescription = caption;
        try {
            const newPost = await PostDoc_1.default.create(newPostInfo);
            if (!newPost)
                return { status: 404, success: false, message: "Failed to upload post" };
            await ProfileDoc_1.default.findOneAndUpdate({ _id: parsedProfile._id }, { $inc: { post: 1 } }, { new: true });
            return { status: 200, success: true, message: "Successfully uploaded" };
        }
        catch (error) {
            return { status: 505, success: false, message: error.message };
        }
    }
    async handleAddLikePost(postId, userId) {
        if (!postId || !userId)
            return { status: 404, success: false, message: "IDs required" };
        const query = { postId, userId };
        try {
            const newLikePost = await LikedPost_1.default.create(query);
            if (!newLikePost)
                return { status: 404, success: false, message: "Failed to like post" };
            await PostDoc_1.default.findOneAndUpdate({ _id: postId }, { $inc: { postLike: 1 } }, { new: true });
            return { status: 200, success: true };
        }
        catch (error) {
            return { status: 505, success: false, message: error.message };
        }
    }
    async handleRemoveLikePost(postId, userId) {
        if (!postId || !userId)
            return { status: 404, success: false, message: "IDs required" };
        const query = { postId, userId };
        try {
            const removedLikePost = await LikedPost_1.default.findOneAndDelete(query);
            if (!removedLikePost)
                return { status: 404, success: false, message: "Failed to remove like" };
            await PostDoc_1.default.findOneAndUpdate({ _id: postId }, { $inc: { postLike: -1 } }, { new: true });
            return { status: 200, success: true };
        }
        catch (error) {
            return { status: 505, success: false, message: error.message };
        }
    }
    async handlePostComment(postId, userId, commentText) {
        const query = {
            postId,
            userId,
            comment: commentText,
            initiateTime: Date.now()
        };
        try {
            const comment = await Comments_1.default.create(query);
            if (!comment)
                return { status: 404, success: false, message: "Failed to post comment" };
            await PostDoc_1.default.findByIdAndUpdate(postId, { $inc: { postComment: 1 } }, { new: true });
            return { status: 202, success: true, message: "Comment posted", data: comment };
        }
        catch (error) {
            return { status: 505, success: false, message: error.message };
        }
    }
    async SharedPost(data, refId) {
        try {
            const { userId, senderUsername, receiverUsername, initateTime, otherUserId, chatId, sharedContent } = data;
            if (!refId) {
                return { message: "post refId required to share", status: 404 };
            }
            if (!userId || !otherUserId || !chatId) {
                return { message: "some id's are missing ", status: 404 };
            }
            if (!sharedContent) {
                return { message: "share content is required! no data avaliable", status: 404 };
            }
            const storeMessage = {
                chatId,
                userId,
                otherUserId,
                senderUsername,
                receiverUsername,
                initateTime,
                sharedContent
            };
            const id = sharedContent.refId;
            const sharedPost = await PersonalChatDoc_1.default.create(storeMessage);
            if (!sharedPost) {
                return { message: "failed to share this post", status: 404 };
            }
            await PostDoc_1.default.findByIdAndUpdate(id, { $inc: { postShare: 1 } });
            return { message: "successfully shared this post", status: 200 };
        }
        catch (error) {
            return { message: error, status: 505 };
        }
    }
    async UploadNewStory(data, storyFile) {
        try {
            const { userId, username, storyDuration, createdTime, expiredAt } = data;
            if (!username || !userId || !createdTime || !expiredAt || !storyFile) {
                return { status: 404, success: false };
            }
            // check already posted 
            const alreadyStory = await StoryDoc_1.default.findOne({ userId: userId });
            if (alreadyStory) {
                return { status: 404, success: false, message: "story already there" };
            }
            const story = new StoryDoc_1.default({
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
        }
        catch (error) {
            return { status: 505, success: false };
        }
    }
    async UploadNewNote(data) {
        try {
            const { userId, note, expiredAt } = data;
            if (!userId || !note || !expiredAt) {
                return { status: 404, success: false, message: "required all details" };
            }
            const noteData = {
                userId,
                noteMessage: note,
                expiredAt
            };
            const existingNote = await NoteDoc_1.default.findOne({ userId: userId }).lean();
            if (existingNote) {
                await NoteDoc_1.default.findOneAndUpdate({ userId: userId }, noteData);
                return { status: 200, success: true, message: "new note added!" };
            }
            const newNote = new NoteDoc_1.default(noteData);
            await newNote.save();
            return { status: 200, success: true, message: "new note added!" };
        }
        catch (error) {
            return { status: 505, success: false, message: "internal error failed to add!" };
        }
    }
};
PostServices = __decorate([
    (0, tsyringe_1.autoInjectable)()
], PostServices);
exports.default = PostServices;
