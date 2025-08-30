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
const api_1 = __importDefault(require("../../services/Chat/api"));
let ChatApiController = class ChatApiController {
    constructor(chatService) {
        this.chatService = chatService;
        this.fetchAllChats = async (req, res) => {
            const chatId = req.params.id;
            const chatSkip = Number(req.query.chatSkip) || 0;
            const result = await this.chatService.fetchAllPersonalChats(chatId, chatSkip);
            res.status(result.status).json(result.success ? result.data : { error: result.message });
            return;
        };
        this.fetchChattedUsers = async (req, res) => {
            const userId = req.params.id;
            const result = await this.chatService.fetchChattedUsers(userId);
            res.status(result.status).json(result.success ? result.data : { error: result.message });
            return;
        };
    }
};
ChatApiController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [api_1.default])
], ChatApiController);
exports.default = ChatApiController;
