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
const Comments_1 = __importDefault(require("../../models/Comments"));
const PostDoc_1 = __importDefault(require("../../models/PostDoc"));
const LikedPost_1 = __importDefault(require("../../models/LikedPost"));
const index_1 = __importDefault(require("../../utils/index"));
const StoryDoc_1 = __importDefault(require("../../models/StoryDoc"));
const NoteDoc_1 = __importDefault(require("../../models/NoteDoc"));
let PostsApiServices = class PostsApiServices {
    constructor(allHelp) {
        this.allHelp = allHelp;
    }
    async fetchAllComments(postId) {
        try {
            const comments = await Comments_1.default.find({ postId }).sort({ createdAt: -1 });
            if (!comments || comments.length === 0) {
                return { status: 404, success: false, message: "No comment yet" };
            }
            return { status: 202, success: true, data: comments };
        }
        catch (error) {
            return { status: 505, success: false, message: error.message };
        }
    }
    async fetchPosts(skip) {
        try {
            const posts = await PostDoc_1.default.find({}).sort({ createdAt: 1 }).skip(skip).limit(5);
            if (!posts || posts.length === 0) {
                return { status: 201, success: false, message: "Empty" };
            }
            const shuffledPosts = this.allHelp.shufflePosts(posts);
            return { status: 202, success: true, data: shuffledPosts };
        }
        catch (error) {
            return { status: 505, success: false, message: error.message };
        }
    }
    async fetchLikedPost(postId, userId) {
        try {
            const likedPost = await LikedPost_1.default.find({
                $and: [{ postId }, { userId }]
            });
            return {
                status: 200,
                success: true,
                likeStatus: likedPost && likedPost.length > 0
            };
        }
        catch (error) {
            return { status: 505, success: false, message: error.message };
        }
    }
    async fetchAllPosts(userId) {
        try {
            const allPosts = await PostDoc_1.default.find({ "author.userId": userId });
            return { status: 202, success: true, data: allPosts };
        }
        catch (error) {
            return { status: 505, success: false, message: error.message };
        }
    }
    async handlefetchUserPost(id) {
        try {
            if (!id) {
                return { status: 404, message: "post id missing!" };
            }
            const post = await PostDoc_1.default.findOne({ _id: id }, { "author.userId": 1, "author.userAccId": 1, postLike: 1, createdAt: 1 });
            if (!post) {
                return { status: 404, message: "post not available" };
            }
            return { status: 200, post: post };
        }
        catch (error) {
            return { status: 505, message: error };
        }
    }
    async handleFetchAllStories() {
        try {
            const stories = await StoryDoc_1.default.find({}).select("_id userId username storyData.contentType storyData.duration").lean();
            if (!stories) {
                return { status: 404, success: false, message: "no stories available" };
            }
            return { status: 200, success: true, data: stories };
        }
        catch (error) {
            return { status: 505, success: false, message: error.message };
        }
    }
    async fetchStory(id) {
        try {
            const story = await StoryDoc_1.default.findOne({ userId: id }).select("_id userId storyData.contentType storyData.duration username expiredAt").lean();
            if (!story) {
                return { status: 404, success: false, message: "no story" };
            }
            return { status: 200, success: true, data: story };
        }
        catch (error) {
            return { status: 505, success: false, message: error.message };
        }
    }
    async fetchSingleNote(id) {
        try {
            if (!id) {
                return { status: 404, success: false, message: "id required!" };
            }
            const note = await NoteDoc_1.default.findOne({ userId: id }).select("_id userId noteMessage").lean();
            if (!note) {
                return { status: 404, success: false, message: "no note there!" };
            }
            return { status: 200, success: true, data: note };
        }
        catch (error) {
            return { status: 505, success: false, message: error.message };
        }
    }
    async removeStory(id) {
        if (!id) {
            return { status: 404, success: false, message: "id required" };
        }
        const deleteStory = await StoryDoc_1.default.findByIdAndDelete(id);
        if (!deleteStory) {
            return { status: 404, success: true, message: "failed to delete" };
        }
        return { status: 200, success: true, message: "story removed!" };
    }
};
PostsApiServices = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [index_1.default])
], PostsApiServices);
exports.default = PostsApiServices;
