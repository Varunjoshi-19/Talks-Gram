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
const PersonalChatDoc_1 = __importDefault(require("../../models/PersonalChatDoc"));
let ChatApiServices = class ChatApiServices {
    async fetchAllPersonalChats(chatId, chatSkip) {
        try {
            const limit = 10;
            let chats = await PersonalChatDoc_1.default.find({ chatId })
                .sort({ initateTime: -1 })
                .skip(chatSkip)
                .limit(limit)
                .select("chatId userId otherUserId senderUsername receiverUsername initateTime chat seenStatus sharedContent AdditionalData._id AdditionalData.contentType")
                .lean();
            chats = chats.reverse();
            if (!chats || chats.length === 0) {
                return {
                    status: 202,
                    success: false,
                    message: "No messages available",
                };
            }
            return {
                status: 200,
                success: true,
                data: chats,
            };
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: "Error fetching chats",
                error: error.message,
            };
        }
    }
    async fetchChattedUsers(userId) {
        try {
            const users = await PersonalChatDoc_1.default.find({
                $or: [
                    { userId: userId },
                    { otherUserId: userId }
                ]
            })
                .select("chatId userId otherUserId senderUsername receiverUsername initateTime seenStatus chat")
                .sort({ initateTime: -1 });
            const uniqueUser = new Map();
            users.forEach((each) => {
                const id = userId === each.userId ? each.otherUserId : each.userId;
                const name = userId === each.userId ? each.receiverUsername : each.senderUsername;
                if (!uniqueUser.has(id)) {
                    const entry = {
                        chatId: each.chatId,
                        userId: id,
                        yourMessage: userId === each.userId,
                        checkName: each.senderUsername,
                        username: name ?? "Unknown",
                        initateTime: each.initateTime,
                        seenStatus: each.seenStatus,
                        unseenCount: 0,
                        recentChat: each.chat ?? "",
                    };
                    uniqueUser.set(id, entry);
                }
                if (each.otherUserId === userId && !each.seenStatus) {
                    const otherUid = each.userId;
                    const user = uniqueUser.get(otherUid);
                    if (user)
                        user.unseenCount++;
                }
            });
            return {
                status: 200,
                success: true,
                data: Array.from(uniqueUser.entries())
            };
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: "Error fetching users",
                error: error.message,
            };
        }
    }
};
ChatApiServices = __decorate([
    (0, tsyringe_1.injectable)()
], ChatApiServices);
exports.default = ChatApiServices;
