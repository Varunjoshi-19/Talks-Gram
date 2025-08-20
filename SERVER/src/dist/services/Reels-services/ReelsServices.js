"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const ReelDoc_1 = __importDefault(require("../../models/ReelDoc"));
const ProfileDoc_1 = __importDefault(require("../../models/ProfileDoc"));
const __1 = require("../..");
const fs_1 = __importDefault(require("fs"));
const utils_1 = __importDefault(require("../../utils"));
const LikedPost_1 = __importDefault(require("../../models/LikedPost"));
let ReelsServices = class ReelsServices {
    constructor(allHelper) {
        this.allHelper = allHelper;
        this.allHelper = allHelper;
    }
    async handleNewPostUpload(profile, caption, postReel) {
        if (!postReel || !profile) {
            return { status: 400, error: "Missing file or profile data" };
        }
        let parsedProfile;
        try {
            parsedProfile = JSON.parse(profile);
        }
        catch {
            return { status: 400, error: "Invalid profile data" };
        }
        const newPostInfo = {
            reelVideo: {
                data: postReel.buffer,
                contentType: postReel.mimetype,
            },
            author: {
                userId: parsedProfile._id,
                userAccId: parsedProfile.userAccId,
            },
        };
        if (caption !== "")
            newPostInfo.reelDescription = caption;
        try {
            const newPost = await ReelDoc_1.default.create(newPostInfo);
            if (!newPost)
                return { status: 500, error: "Failed to upload post" };
            await ProfileDoc_1.default.findOneAndUpdate({ _id: parsedProfile._id }, { $inc: { post: 1 } }, { new: true });
            const filePath = `${__1.reelsUploadPath}/${Date.now()}-${postReel.originalname}`;
            fs_1.default.writeFileSync(filePath, postReel.buffer);
            return { status: 200, message: "Successfully uploaded" };
        }
        catch (error) {
            return { status: 500, error: error.message };
        }
    }
    async handleFetchReels(skip) {
        try {
            const allReels = await ReelDoc_1.default.find({}).skip(parseInt(skip));
            if (allReels.length === 0) {
                return { status: 204, statusText: "No Content", message: "No posts available" };
            }
            const shuffledReels = this.allHelper.shufflePosts(allReels);
            return { status: 200, shuffledReels };
        }
        catch (error) {
            return { status: 500, error: error.message };
        }
    }
    async handleAddLike(postId, userId) {
        if (!postId || !userId) {
            return { status: 400, message: "IDs required" };
        }
        const query = { postId, userId };
        try {
            const newLikePost = await LikedPost_1.default.create(query);
            if (!newLikePost) {
                return { status: 500, message: "Failed to like post" };
            }
            await ReelDoc_1.default.findOneAndUpdate({ _id: postId }, { $inc: { reelLike: 1 } }, { new: true });
            return { status: 200, statusText: "Liked", liked: true };
        }
        catch (error) {
            return { status: 500, error: error.message };
        }
    }
    async handleRemoveLike(postId, userId) {
        if (!postId || !userId) {
            return { status: 400, message: "IDs required" };
        }
        const query = { postId, userId };
        try {
            const removedLikePost = await LikedPost_1.default.findOneAndDelete(query);
            if (!removedLikePost) {
                return { status: 404, message: "Failed to remove like post" };
            }
            await ReelDoc_1.default.findOneAndUpdate({ _id: postId }, { $inc: { reelLike: -1 } }, { new: true });
            return { status: 200, statusText: "Unliked", liked: false };
        }
        catch (error) {
            return { status: 500, error: error.message };
        }
    }
};
ReelsServices = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [utils_1.default])
], ReelsServices);
exports.default = ReelsServices;
