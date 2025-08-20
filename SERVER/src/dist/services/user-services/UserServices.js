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
const ProfileDoc_1 = __importDefault(require("../../models/ProfileDoc"));
const crypto_1 = __importDefault(require("crypto"));
const userDoc_1 = __importDefault(require("../../models/userDoc"));
const user_1 = __importDefault(require("../../utils/others/user"));
let UserService = class UserService {
    constructor(userHelper) {
        this.userHelper = userHelper;
    }
    async login(body) {
        const { username, email, password } = body;
        if (!password)
            return { status: 400, success: false, message: "Password is required" };
        if (!username && !email)
            return { status: 400, success: false, message: "Username or email is required" };
        const key = username ? "username" : "email";
        const value = username || email;
        const user = await this.userHelper.findAccount(key, value);
        if (!user)
            return { status: 404, success: false, message: "Invalid username or email" };
        const id = user?._id;
        const profile = await ProfileDoc_1.default.findOne({ userAccId: id }).select("_id username email fullname post bio followers following").lean();
        const token = this.userHelper.verifyAndGenerateToken(password, user);
        if (!token)
            return { status: 400, success: false, message: "Incorrect password" };
        return {
            status: 200,
            success: true,
            data: {
                message: "Login successful",
                accessToken: token,
                profile: profile
            },
        };
    }
    async signup(body) {
        const { username, fullname, email, password } = body;
        if (!username || !fullname || !email || !password) {
            return { status: 400, success: false, message: "All fields are required" };
        }
        try {
            const duplicate = await this.userHelper.checkDuplicacy(username, email);
            if (duplicate)
                return { status: 400, success: false, message: `${duplicate} already exists` };
            const salt = crypto_1.default.randomBytes(16).toString("hex");
            const hashpassword = crypto_1.default.createHmac("sha256", salt).update(password).digest("hex");
            const userData = {
                username,
                fullname,
                email,
                password: hashpassword,
                salting: salt,
            };
            const newAccount = await userDoc_1.default.create(userData);
            const defaultImage = this.userHelper.getDefaultImage();
            const profileData = {
                userAccId: newAccount._id,
                username,
                fullname,
                email,
                profileImage: defaultImage,
            };
            const userProfile = await ProfileDoc_1.default.create(profileData);
            return {
                status: 201,
                success: true,
                data: {
                    message: "Signup successful",
                    user: newAccount,
                },
            };
        }
        catch (error) {
            return {
                status: 505,
                success: false,
                data: {
                    message: "Internal Error",
                }
            };
        }
    }
    async updateProfile(id, data, file) {
        const NewProfileData = {};
        if (data.fullname) {
            if (data.fullname === "")
                throw new Error("Full name cannot be empty");
            NewProfileData.fullname = data.fullname;
        }
        if (data.username) {
            if (data.username === "")
                throw new Error("Username cannot be empty");
            NewProfileData.username = data.username;
            const existingUser = await this.userHelper.findAccount("username", data.username);
            if (existingUser)
                throw new Error(`Username ${data.username} already exists`);
        }
        if (data.bio) {
            NewProfileData.bio = data.bio;
        }
        if (file) {
            NewProfileData.profileImage = {
                data: file.buffer,
                contentType: file.mimetype,
            };
        }
        const existingDetails = await ProfileDoc_1.default.findById(id);
        if (!existingDetails)
            throw new Error("Profile not found");
        const existingUsername = existingDetails.username;
        await userDoc_1.default.findOneAndUpdate({ username: existingUsername }, {
            username: NewProfileData.username,
            fullname: NewProfileData.fullname,
        }, { new: true });
        const updatedProfile = await ProfileDoc_1.default.findByIdAndUpdate(id, NewProfileData, {
            new: true,
        });
        return updatedProfile;
    }
};
UserService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [user_1.default])
], UserService);
exports.default = UserService;
