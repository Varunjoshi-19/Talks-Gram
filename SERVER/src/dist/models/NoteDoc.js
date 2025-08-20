"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NoteSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    noteMessage: {
        type: String,
        required: true
    },
    expiredAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    }
});
exports.default = mongoose_1.default.model("Note", NoteSchema);
