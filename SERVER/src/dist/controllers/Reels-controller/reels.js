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
const ReelsServices_1 = __importDefault(require("../../services/Reels-services/ReelsServices"));
let ReelsController = class ReelsController {
    constructor(reelsService) {
        this.reelsService = reelsService;
        this.handleNewPostUpload = async (req, res) => {
            const { profile, caption } = req.body;
            const postReel = req.file;
            const result = await this.reelsService.handleNewPostUpload(profile, caption, postReel);
            res.status(result.status).json(result);
            return;
        };
        this.handleFetchReels = async (req, res) => {
            const skip = req.query.skip;
            const result = await this.reelsService.handleFetchReels(skip);
            res.status(result.status).json(result);
            return;
        };
        this.handleAddLikePost = async (req, res) => {
            const { postId, userId } = req.body;
            const result = await this.reelsService.handleAddLike(postId, userId);
            res.status(result.status).json(result);
            return;
        };
        this.handleRemoveLikePost = async (req, res) => {
            const { postId, userId } = req.body;
            const result = await this.reelsService.handleRemoveLike(postId, userId);
            res.status(result.status).json(result);
            return;
        };
        this.reelsService = reelsService;
    }
};
ReelsController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [ReelsServices_1.default])
], ReelsController);
exports.default = ReelsController;
