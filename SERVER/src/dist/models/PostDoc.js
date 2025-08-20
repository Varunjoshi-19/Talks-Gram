"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    postImage: {
        data: Buffer,
        contentType: String
    },
    postLike: {
        type: Number,
        default: 0
    },
    postComment: {
        type: Number,
        default: 0
    },
    postShare: {
        type: Number,
        default: 0
    },
    postDescription: {
        type: String,
        default: ""
    },
    author: {
        userId: {
            type: mongoose_1.default.Schema.ObjectId,
            required: true,
        }
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Posts", PostSchema);
