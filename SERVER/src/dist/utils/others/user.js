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
const userDoc_1 = __importDefault(require("../../models/userDoc"));
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const tsyringe_1 = require("tsyringe");
const userAuth_1 = __importDefault(require("../../authentication/userAuth"));
const ProfileDoc_1 = __importDefault(require("../../models/ProfileDoc"));
const __1 = require("../..");
let UserHelper = class UserHelper {
    constructor(userAuthService) {
        this.userAuthService = userAuthService;
    }
    async checkDuplicacy(username, email) {
        const userWithSameUsername = await userDoc_1.default.findOne({ username });
        if (userWithSameUsername)
            return "username";
        const userWithSameEmail = await userDoc_1.default.findOne({ email });
        if (userWithSameEmail)
            return "email";
        return false;
    }
    async findAccount(key, value) {
        if (key === "username")
            return await userDoc_1.default.findOne({ username: value });
        return await userDoc_1.default.findOne({ email: value });
    }
    verifyAndGenerateToken(password, user) {
        const newHashPassword = crypto_1.default
            .createHmac("sha256", user.salting)
            .update(password)
            .digest("hex");
        if (newHashPassword !== user.password)
            return null;
        const UserData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };
        return this.userAuthService.SaveAuthentication(UserData);
    }
    async searchUsers(username) {
        if (!username || username === "")
            return [];
        const searchedAccounts = await ProfileDoc_1.default.find({
            username: { $regex: new RegExp(username, "i") },
        });
        return searchedAccounts;
    }
    HashedPasswordAndSalting(password) {
        const salt = crypto_1.default.randomBytes(20).toString("hex");
        const hashpassword = crypto_1.default.createHmac("sha256", salt).update(password).digest("hex");
        return { salt, hashpassword };
    }
    getDefaultImage() {
        const imagePath = path_1.default.resolve(__1.defaultImagePath);
        const imageBuffer = fs_1.default.readFileSync(imagePath);
        return {
            data: imageBuffer,
            contentType: "image/jpeg"
        };
    }
};
UserHelper = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [userAuth_1.default])
], UserHelper);
exports.default = UserHelper;
