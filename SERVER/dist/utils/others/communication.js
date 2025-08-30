"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommunicationId_1 = __importDefault(require("../../models/CommunicationId"));
const crypto_1 = __importDefault(require("crypto"));
class CommunicationServices {
    async fetchCommunicationId(userId) {
        if (!userId || userId === "")
            throw new Error("ID REQUIRED");
        const commId = await CommunicationId_1.default.findOne({ userId });
        if (!commId)
            throw new Error("No communication ID found");
        return commId;
    }
    async addCommId(userId) {
        const commId = this.generateCommunicationId(userId);
        const newComm = await CommunicationId_1.default.create({
            userId,
            commId,
        });
        return newComm;
    }
    generateCommunicationId(userId) {
        const commId = crypto_1.default.createHmac("sha256", process.env.COMMUICATION_KEY).update(userId).digest("hex");
        return commId;
    }
}
exports.default = CommunicationServices;
