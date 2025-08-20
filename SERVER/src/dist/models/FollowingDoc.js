"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FollowingSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    FollowingWhomId: {
        type: String,
        required: true
    },
    FollowingWhomUsername: {
        type: String,
        required: true
    }
});
exports.default = mongoose_1.default.model("Followings", FollowingSchema);
