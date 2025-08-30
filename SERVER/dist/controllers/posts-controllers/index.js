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
const PostServices_1 = __importDefault(require("../../services/posts-services/PostServices"));
let PostController = class PostController {
    constructor(postServices) {
        this.postServices = postServices;
        this.handleNewPostUpload = async (req, res) => {
            const { profile, caption } = req.body;
            const postImage = req.file;
            const result = await this.postServices.handleNewPostUpload(profile, caption, postImage);
            res.status(result.status).json(result);
            return;
        };
        this.handleAddLikePost = async (req, res) => {
            const { postId, userId } = req.body;
            const result = await this.postServices.handleAddLikePost(postId, userId);
            res.status(result.status).json(result);
            return;
        };
        this.handleRemoveLikePost = async (req, res) => {
            const { postId, userId } = req.body;
            const result = await this.postServices.handleRemoveLikePost(postId, userId);
            res.status(result.status).json(result);
            return;
        };
        this.handlePostComment = async (req, res) => {
            const { postId, userId, comment } = req.body;
            const result = await this.postServices.handlePostComment(postId, userId, comment);
            res.status(result.status).json(result);
            return;
        };
        this.handleSharePost = async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const result = await this.postServices.SharedPost(data, id);
            res.status(result?.status).json(result);
            return;
        };
        this.handleUploadNewStory = async (req, res) => {
            const data = req.body;
            const storyFile = req.file;
            const result = await this.postServices.UploadNewStory(data, storyFile);
            res.status(result.status).json({ message: result.success ? "uploaded" : "failed to add story!" });
            return;
        };
        this.handleAddNewNote = async (req, res) => {
            const data = req.body;
            const result = await this.postServices.UploadNewNote(data);
            res.status(result.status).json(result.message);
            return;
        };
    }
};
PostController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [PostServices_1.default])
], PostController);
exports.default = PostController;
