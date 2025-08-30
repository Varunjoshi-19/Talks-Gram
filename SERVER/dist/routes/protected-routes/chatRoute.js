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
exports.ChatRoutes = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const api_controller_1 = __importDefault(require("../../controllers/Follow-request/api_controller"));
const index_1 = __importDefault(require("../../controllers/Follow-request/index"));
const apiController_1 = __importDefault(require("../../controllers/chats/apiController"));
const index_2 = __importDefault(require("../../controllers/chats/index"));
const user_api_1 = __importDefault(require("../../controllers/user-controller/user_api"));
const multer_1 = __importStar(require("multer"));
const render_1 = __importDefault(require("../../controllers/others/render"));
let ChatRoutes = class ChatRoutes {
    constructor(userApiController, chatController, chatApiController, followapiController, followController, renderController) {
        this.userApiController = userApiController;
        this.chatController = chatController;
        this.chatApiController = chatApiController;
        this.followapiController = followapiController;
        this.followController = followController;
        this.renderController = renderController;
        this.router = (0, express_1.Router)();
        this.upload = (0, multer_1.default)({ storage: (0, multer_1.memoryStorage)() });
    }
    getRoutes() {
        this.router.get("/generate-chatId/:id", this.chatController.generateChatId.bind(this.chatController));
        this.router.post("/fetch-all-personal-chats/:id", this.chatApiController.fetchAllChats.bind(this.chatApiController));
        this.router.get("/generate-chatId/:id", this.chatController.generateChatId.bind(this.chatController));
        this.router.get("/fetchUser/:id", this.userApiController.fetchSingleUserProfile.bind(this.userApiController));
        this.router.post("/save-personal-chats", this.chatController.saveChat.bind(this.chatController));
        this.router.post("/fetch-chatted-users/:id", this.chatApiController.fetchChattedUsers.bind(this.chatApiController));
        this.router.post("/SendFollowRequest", this.followController.handleFollowRequest.bind(this.followController));
        this.router.post("/checkRequested", this.followController.checkAlreadyRequested.bind(this.followController));
        this.router.post("/checkFollowed", this.followController.checkExistsInFollower.bind(this.followController));
        this.router.post("/removeFromRequested", this.followController.handleRemoveRequested.bind(this.followController));
        this.router.post("/AcceptedRequest", this.followController.handleAcceptedRequest.bind(this.followController));
        this.router.post("/removeFollower", this.followController.handleRemoveFollower.bind(this.followController));
        this.router.post("/fetchRequests/:id", this.followapiController.fetchAllRequests.bind(this.followapiController));
        this.router.post("/additionalInfo-message", this.upload.array("files", 10), this.chatController.saveAdditionalData.bind(this.chatController));
        this.router.post("/audioDataInfo-message", this.upload.single("audioFile"), this.chatController.saveAudioMessage.bind(this.chatController));
        this.router.get("/render-message-items/:id1/:id2", this.renderController.renderMessageItem.bind(this.renderController));
        this.router.post("/seen-chats/:id1/:id2", this.chatController.handleSeenChats.bind(this.chatController));
        return this.router;
    }
};
exports.ChatRoutes = ChatRoutes;
exports.ChatRoutes = ChatRoutes = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [user_api_1.default,
        index_2.default,
        apiController_1.default,
        api_controller_1.default,
        index_1.default,
        render_1.default])
], ChatRoutes);
