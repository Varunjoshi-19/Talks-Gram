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
const ProfileDoc_1 = __importDefault(require("../../models/ProfileDoc"));
const PersonalChatDoc_1 = __importDefault(require("../../models/PersonalChatDoc"));
const PostDoc_1 = __importDefault(require("../../models/PostDoc"));
const ReelDoc_1 = __importDefault(require("../../models/ReelDoc"));
const StoryDoc_1 = __importDefault(require("../../models/StoryDoc"));
let RenderService = class RenderService {
    async getProfileImage(id) {
        try {
            const profile = await ProfileDoc_1.default.findById(id);
            if (!profile || !profile.profileImage || !profile.profileImage.data) {
                return {
                    status: 404,
                    success: false,
                    message: "Image not found",
                };
            }
            return {
                status: 200,
                success: true,
                contentType: profile.profileImage.contentType,
                data: profile.profileImage.data,
            };
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: "Error fetching image",
                error: error.message,
            };
        }
    }
    async fetchMessageItem(id1, id2) {
        if (!id1 || !id2) {
            return {
                status: 400,
                success: false,
                message: "Invalid ID provided",
            };
        }
        const query = {
            _id: id1,
            "AdditionalData._id": id2,
        };
        const projection = {
            "AdditionalData.$": 1,
        };
        try {
            const post = await PersonalChatDoc_1.default.findOne(query, projection);
            if (!post || !post.AdditionalData || post.AdditionalData.length === 0) {
                return {
                    status: 404,
                    success: false,
                    message: "Data not found",
                };
            }
            const { data, contentType } = post.AdditionalData[0];
            return {
                status: 200,
                success: true,
                contentType,
                data,
            };
        }
        catch (error) {
            console.error("Error fetching render data:", error);
            return {
                status: 500,
                success: false,
                message: "Server error while fetching",
            };
        }
    }
    async renderPostImage(id) {
        if (!id || id.trim() === "") {
            return {
                status: 404,
                success: false,
                message: "Failed to render image",
            };
        }
        try {
            const post = await PostDoc_1.default.findOne({ _id: id });
            if (!post || !post.postImage || !post.postImage.data) {
                return {
                    status: 404,
                    success: false,
                    message: "Image not found",
                };
            }
            return {
                status: 200,
                success: true,
                contentType: post.postImage.contentType,
                data: post.postImage.data,
            };
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: "Error fetching image",
            };
        }
    }
    async handleRenderReel(id) {
        if (!id) {
            return { status: 400, error: "Invalid ID provided" };
        }
        try {
            const post = await ReelDoc_1.default.findOne({ _id: id });
            if (!post?.reelVideo?.data) {
                return { status: 404, error: "Video not found" };
            }
            return {
                status: 200,
                contentType: post.reelVideo.contentType,
                data: post.reelVideo.data,
            };
        }
        catch (error) {
            return { status: 500, error: "Server error while fetching video" };
        }
    }
    async handleRenderStory(id) {
        if (!id) {
            return { status: 400, error: "Invalid ID provided" };
        }
        try {
            const post = await StoryDoc_1.default.findOne({ _id: id });
            if (!post?.storyData?.data) {
                return { status: 404, error: "Video not found" };
            }
            return {
                status: 200,
                contentType: post.storyData.contentType,
                data: post.storyData.data,
            };
        }
        catch (error) {
            return { status: 500, error: "Server error while fetching video" };
        }
    }
};
RenderService = __decorate([
    (0, tsyringe_1.injectable)()
], RenderService);
exports.default = RenderService;
