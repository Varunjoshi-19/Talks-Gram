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
const posts_api_1 = __importDefault(require("../../services/posts-services/posts_api"));
let PostsApiController = class PostsApiController {
    constructor(postsApiServices) {
        this.postsApiServices = postsApiServices;
        this.fetchAllComments = async (req, res) => {
            const result = await this.postsApiServices.fetchAllComments(req.params.id);
            if (!result.success) {
                res.status(result.status).json({ message: result.message });
                return;
            }
            res.status(result.status).json({ comments: result.data });
        };
        this.fetchPosts = async (req, res) => {
            const skip = parseInt(req.query.skip) || 0;
            const result = await this.postsApiServices.fetchPosts(skip);
            if (!result.success) {
                res.status(result.status).json({ message: result.message });
                return;
            }
            res.status(result.status).json({ shuffledPosts: result.data });
        };
        this.fetchLikedPost = async (req, res) => {
            const { postId, userId } = req.body;
            const result = await this.postsApiServices.fetchLikedPost(postId, userId);
            if (!result.success) {
                res.status(result.status).json({ message: result.message });
                return;
            }
            res.status(result.status).json({ likeStatus: result.likeStatus });
        };
        this.fetchAllPosts = async (req, res) => {
            const result = await this.postsApiServices.fetchAllPosts(req.params.id);
            if (!result.success) {
                res.status(result.status).json({ message: result.message });
                return;
            }
            res.status(result.status).json({ allPosts: result.data });
        };
        this.fetchSinglePost = async (req, res) => {
            const id = req.params.id;
            const result = await this.postsApiServices.handlefetchUserPost(id);
            res.status(result.status).json({ post: result.post });
            return;
        };
        this.fetchAllStories = async (req, res) => {
            const result = await this.postsApiServices.handleFetchAllStories();
            res.status(result.status).json(result.success ? result.data : result.message);
        };
        this.handleGetUploadedStory = async (req, res) => {
            const id = req.params.id;
            const result = await this.postsApiServices.fetchStory(id);
            res.status(result?.status).json(result.success ? result.data : result?.message);
            return;
        };
        this.handleGetNote = async (req, res) => {
            const id = req.params.id;
            const result = await this.postsApiServices.fetchSingleNote(id);
            res.status(result.status).json(result.success ? result.data : result.message);
            return;
        };
        this.handleRemoveStory = async (req, res) => {
            const id = req.params.id;
            const result = await this.postsApiServices.removeStory(id);
            res.status(result.status).json(result.message);
            return;
        };
    }
};
PostsApiController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [posts_api_1.default])
], PostsApiController);
exports.default = PostsApiController;
