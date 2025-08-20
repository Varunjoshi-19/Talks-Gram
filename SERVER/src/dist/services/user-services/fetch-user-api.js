"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProfileDoc_1 = __importDefault(require("../../models/ProfileDoc"));
class UserApiServices {
    async fetchSingleUserProfile(id) {
        if (!id) {
            return { success: false, status: 404, message: " id is required" };
        }
        try {
            const userProfile = await ProfileDoc_1.default.findById(id).select("_id username fullname post bio followers following").lean();
            if (!userProfile) {
                return { success: false, status: 404, message: "No user profile found" };
            }
            return { success: true, status: 202, data: userProfile };
        }
        catch (error) {
            return { success: false, status: 505, message: error.message };
        }
    }
    async handleGetIdAndUsername(id) {
        const userProfile = await ProfileDoc_1.default.findById(id).select("_id username").lean();
        if (!userProfile)
            throw new Error("Profile not found");
        return userProfile;
    }
    async getAllAccounts(excludeEmail) {
        if (!excludeEmail)
            throw new Error("Email is required");
        const allAccounts = await ProfileDoc_1.default.find({ email: { $ne: excludeEmail } }).select("_id username fullname").limit(4).lean();
        return allAccounts;
    }
}
exports.default = UserApiServices;
