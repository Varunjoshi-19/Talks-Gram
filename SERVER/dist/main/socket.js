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
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const tsyringe_1 = require("tsyringe");
const OtherServices_1 = require("../services/Others/OtherServices");
const index_1 = require("../index");
let SocketConnection = class SocketConnection {
    constructor(cacheService) {
        this.cacheService = cacheService;
        this.cacheService = cacheService;
        this.httpModel = null;
        this.socketModel = null;
        this.socketToUserId = new Map();
        this.userIdToSocketId = new Map();
    }
    establishConnection(http) {
        this.httpModel = http;
        this.socketModel = new socket_io_1.Server(this.httpModel, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true,
            },
            maxHttpBufferSize: 1e8,
        });
        this.socketModel.on("connection", (socket) => {
            this.socketModel?.to(socket.id).emit("connDetailsReq");
            this.initSocketHandler(socket);
        });
    }
    initSocketHandler(socket) {
        socket.on("connectionDetails", (data) => {
            this.sendConnectionDetails(socket, data);
        });
        socket.on("seen-chat", (chatId) => {
            socket.join(chatId);
        });
        socket.on("new-chat", (message) => {
            const info = {
                senderUsername: message.senderUsername,
                receiverUsername: message.receiverUsername,
                chatId: message.chatId,
            };
            if (message.chat)
                info.chat = message.chat;
            if (message.AdditionalInfoData) {
                info.AdditionalInfoData = message.AdditionalInfoData;
            }
            if (message.audioData) {
                info.audioData = message.audioData;
            }
            if (message.sharedContent) {
                info.sharedContent = message.sharedContent;
                info.userId = message.userId;
                info.otherUserId = message.otherUserId;
                info.initateTime = message.initateTime;
                info.senderUsername = message.senderUsername;
                info.receiverUsername = message.receiverUsername;
            }
            this.socketModel?.to(message.chatId).emit("chat-receive", info);
        });
        socket.on("new-message", (message) => {
            const { receiverId } = message;
            const socket1 = this.userIdToSocketId?.get(receiverId);
            this.socketModel?.to(socket1?.socketId).emit("new-message", message);
        });
        socket.on("follow-request", (userData) => {
            this.handleSendRequest(userData, socket);
        });
        socket.on("offline", (userId) => {
            if (index_1.onlineUsers.has(userId)) {
                index_1.onlineUsers.delete(userId);
                socket.broadcast.emit("offline", userId);
            }
        });
        socket.on("online", (data) => {
            const { userId, username } = data;
            index_1.onlineUsers.set(userId, username);
            socket.broadcast.emit("user-online", userId);
        });
        socket.on("disconnect", () => {
            this.handleWhenUserDisconnects(socket, socket.id);
        });
    }
    handleSendRequest(userData, socket) {
        const { receiverUserID } = userData;
        const valid = this.cacheService.handleAlreadyNotified(userData);
        if (valid)
            return;
        const socketId = this.userIdToSocketId?.get(receiverUserID)?.socketId;
        this.socketModel?.to(socketId).emit("user-follow-request", userData);
        this.cacheService.handleAddNotification(userData);
    }
    sendConnectionDetails(socket, data) {
        const { socketId, userId, username } = data;
        index_1.onlineUsers.set(userId, username);
        this.userIdToSocketId?.set(userId, { socketId, username });
        this.socketToUserId?.set(socketId, { userId, username });
        socket.broadcast.emit("online", userId);
    }
    handleWhenUserDisconnects(socket, socketId) {
        const userId = this.socketToUserId?.get(socketId)?.userId;
        this.userIdToSocketId?.get(userId);
        //   removal 
        this.socketToUserId?.delete(socketId);
        index_1.onlineUsers.delete(userId);
        this.userIdToSocketId?.delete(userId);
        socket.broadcast.emit("offline", userId);
    }
    CheckUserOnlineStatus(userId) {
        const online = index_1.onlineUsers.has(userId);
        return { status: 200, onlineStatus: online };
    }
};
SocketConnection = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [OtherServices_1.CacheService])
], SocketConnection);
exports.default = SocketConnection;
