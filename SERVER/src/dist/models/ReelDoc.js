"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReelSchema = new mongoose_1.default.Schema({
    reelVideo: {
        data: Buffer,
        contentType: String
    },
    reelLike: {
        type: Number,
        default: 0,
    },
    reelComment: {
        type: Number,
        default: 0,
    },
    reelDescription: {
        type: String,
        default: "",
    },
    author: {
        userId: {
            type: String,
            required: true
        },
        userAccId: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Reels", ReelSchema);
