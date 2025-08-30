"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    chatId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
    },
    otherUserId: {
        type: String,
        required: true
    },
    senderUsername: {
        type: String,
        required: true,
    },
    receiverUsername: {
        type: String,
        required: true
    },
    initateTime: {
        type: String,
        required: true
    },
    chat: {
        type: String,
    },
    seenStatus: {
        type: Boolean,
        default: false,
    },
    AdditionalData: [{
            data: Buffer,
            contentType: String
        }],
    sharedContent: {
        type: {
            type: String,
            enum: ["post", "reel"]
        },
        postOwnerId: {
            type: mongoose_1.default.Schema.Types.ObjectId,
        },
        postOwnerName: String,
        refId: {
            type: mongoose_1.default.Schema.Types.ObjectId,
        },
        previewText: String,
        previewImage: String
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Messages", MessageSchema);
