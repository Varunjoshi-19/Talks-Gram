"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlineUsers = exports.reelsUploadPath = exports.defaultImagePath = exports.publicFolderPath = void 0;
const path_1 = __importDefault(require("path"));
exports.publicFolderPath = path_1.default.resolve(path_1.default.join(__dirname, "public"));
exports.defaultImagePath = path_1.default.join(exports.publicFolderPath, "default.jpg");
exports.reelsUploadPath = path_1.default.join(exports.publicFolderPath, "posts");
exports.onlineUsers = new Map();
