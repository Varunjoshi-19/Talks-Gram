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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const crypto_1 = __importDefault(require("crypto"));
const userDoc_1 = __importDefault(require("../../models/userDoc"));
const user_1 = __importDefault(require("./user"));
const otps = {};
let OtpService = class OtpService {
    constructor(userHelper) {
        this.userHelper = userHelper;
        this.userHelper = userHelper;
    }
    async generateOTP(email) {
        if (!email)
            throw new Error("Email is required");
        const user = await userDoc_1.default.findOne({ email });
        if (!user)
            throw new Error("Invalid email");
        const OTP = Math.floor(Math.random() * 90000) + 10000;
        const userId = user._id.toString();
        otps[userId] = {
            OTP,
            expires: Date.now() + 20 * 1000,
        };
        return { userId, OTP };
    }
    async verifyOTP(userId, enteredOTP) {
        const data = otps[userId];
        if (!data)
            throw new Error("Invalid OTP, request a new one.");
        if (Date.now() > data.expires)
            throw new Error("OTP expired, try again later.");
        if (data.OTP != enteredOTP)
            throw new Error("Wrong OTP");
        delete otps[userId];
        const keyId = crypto_1.default
            .createHmac("sha256", process.env.OTP_KEY)
            .update(userId)
            .digest("base64");
        return keyId;
    }
    async resetPassword(keyId, userId, newPassword) {
        const newkeyId = crypto_1.default
            .createHmac("sha256", process.env.OTP_KEY)
            .update(userId)
            .digest("base64");
        if (keyId !== newkeyId)
            throw new Error("Invalid keyId or userId");
        const { salt, hashpassword } = this.userHelper.HashedPasswordAndSalting(newPassword);
        await userDoc_1.default.findByIdAndUpdate(userId, {
            password: hashpassword,
            salting: salt,
        });
        return "Password updated successfully";
    }
    checkValidParams(id1, id2) {
        const newkeyId = crypto_1.default
            .createHmac("sha256", process.env.OTP_KEY)
            .update(id1)
            .digest("base64");
        if (newkeyId !== id2)
            throw new Error("Invalid keys");
        return "Valid keys";
    }
};
OtpService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [user_1.default])
], OtpService);
exports.default = OtpService;
