"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importStar(require("multer"));
const posts_controllers_1 = __importDefault(require("../../controllers/posts-controllers"));
const postApiController_1 = __importDefault(require("../../controllers/posts-controllers/postApiController"));
const render_1 = __importDefault(require("../../controllers/others/render"));
const tsyringe_1 = require("tsyringe");
let PostRouter = class PostRouter {
    constructor(postController, postApiController, renderController) {
        this.postController = postController;
        this.postApiController = postApiController;
        this.renderController = renderController;
        this.router = (0, express_1.Router)();
        this.upload = (0, multer_1.default)({ storage: (0, multer_1.memoryStorage)(), limits: { fieldSize: 100 * 1024 * 1024 } });
    }
    getRoutes() {
        this.router.post("/allPosts/:id", this.postApiController.fetchAllPosts.bind(this.postApiController));
        this.router.post("/fetchPosts", this.postApiController.fetchPosts.bind(this.postApiController));
        this.router.post("/newPost", this.upload.single('postImage'), this.postController.handleNewPostUpload.bind(this.postController));
        this.router.post("/fetchLikePost", this.postApiController.fetchLikedPost.bind(this.postApiController));
        this.router.post("/add-likePost", this.postController.handleAddLikePost.bind(this.postController));
        this.router.post("/remove-likePost", this.postController.handleRemoveLikePost.bind(this.postController));
        this.router.post("/add-comment", this.postController.handlePostComment.bind(this.postController));
        this.router.post("/fetch-comments/:id", this.postApiController.fetchAllComments.bind(this.postApiController));
        this.router.post("/share-post/:id", this.postController.handleSharePost.bind(this.postController));
        this.router.post("/share-story", this.upload.single("file"), this.postController.handleUploadNewStory.bind(this.postController));
        this.router.post("/new-note", this.upload.none(), this.postController.handleAddNewNote.bind(this.postController));
        this.router.get("/fetch-single-post/:id", this.postApiController.fetchSinglePost.bind(this.postApiController));
        this.router.get("/fetch-all-stories", this.postApiController.fetchAllStories.bind(this.postApiController));
        this.router.get("/fetch-story/:id", this.postApiController.handleGetUploadedStory.bind(this.postApiController));
        this.router.get("/fetch-note/:id", this.postApiController.handleGetNote.bind(this.postApiController));
        this.router.delete("/remove-story/:id", this.postApiController.handleRemoveStory.bind(this.postApiController));
        this.router.get("/postImage/:id", this.renderController.renderPostImage.bind(this.renderController));
        this.router.get("/render-story/:id", this.renderController.RenderStory.bind(this.renderController));
        // router.post("/deletePost", );  // TODO LATER
        return this.router;
    }
};
PostRouter = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [posts_controllers_1.default,
        postApiController_1.default,
        render_1.default])
], PostRouter);
exports.default = PostRouter;
