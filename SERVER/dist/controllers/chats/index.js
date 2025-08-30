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
const index_1 = __importDefault(require("../../services/Chat/index"));
let ChatMessageController = class ChatMessageController {
    constructor(chatService) {
        this.chatService = chatService;
        this.saveChat = async (req, res) => {
            const result = await this.chatService.savePersonalChat(req.body);
            res.status(result.status).json(result.success ? { ...result } : { error: result.message });
            return;
        };
        this.saveAdditionalData = async (req, res) => {
            const { allData } = req.body;
            const result = await this.chatService.saveAdditionalData(allData, req.files);
            res.status(result.status).json(result.success ? { message: result.message } : { error: result.message });
            return;
        };
        this.saveAudioMessage = async (req, res) => {
            const { audioData } = req.body;
            const result = await this.chatService.saveAudioMessage(audioData, req.file);
            res.status(result.status).json(result.success ? { message: result.message } : { error: result.message });
            return;
        };
        this.handleSeenChats = async (req, res) => {
            const { id1, id2 } = req.params;
            const result = await this.chatService.toogleAllSeenChats(id1, id2);
            res.status(result.status).json(result.success ? { message: result.message } : { error: result.error });
        };
        this.generateChatId = (req, res) => {
            const chatId = this.chatService.generateChatId(req.params.id);
            res.status(202).json({ chatId });
            return;
        };
    }
};
ChatMessageController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [index_1.default])
], ChatMessageController);
exports.default = ChatMessageController;
