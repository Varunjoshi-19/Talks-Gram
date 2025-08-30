"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const FollowRequest_1 = __importDefault(require("../../models/FollowRequest"));
const FollowersDoc_1 = __importDefault(require("../../models/FollowersDoc"));
const FollowingDoc_1 = __importDefault(require("../../models/FollowingDoc"));
const ProfileDoc_1 = __importDefault(require("../../models/ProfileDoc"));
let FollowService = class FollowService {
    async handleFollowRequest(userId, userIdOf, usernameOf) {
        try {
            const existing = await FollowRequest_1.default.findOne({ userId, userIdOf });
            if (existing) {
                return { status: 204, success: false, message: "Already requested" };
            }
            const saved = await FollowRequest_1.default.create({ userId, userIdOf, usernameOf });
            if (!saved)
                return { status: 204, success: false, message: "Follow" };
            return { status: 202, success: true, message: "Requested" };
        }
        catch (error) {
            return { status: 505, success: false, message: error.message };
        }
    }
    async checkExistsInFollower(userId, userIdOf) {
        const query = {
            $and: [{ userId }, { FollowedById: userIdOf }],
        };
        try {
            const user = await FollowersDoc_1.default.find(query);
            if (!user || user.length === 0)
                return { status: 204, statusText: "Follow" };
            return { status: 202, statusText: "Following" };
        }
        catch (error) {
            return { status: 404, error: error.message };
        }
    }
    async checkAlreadyRequested(userId, userIdOf) {
        const query = {
            $and: [{ userId }, { userIdOf }],
        };
        try {
            const entry = await FollowRequest_1.default.findOne(query);
            if (!entry)
                return { status: 204, statusText: "no entry found" };
            return { status: 202, statusText: "Requested" };
        }
        catch (error) {
            return { status: 404, error: error.message };
        }
    }
    async handleRemoveRequested(userId, userIdOf) {
        const query = {
            $and: [{ userId }, { userIdOf }],
        };
        try {
            const deletedRequest = await FollowRequest_1.default.findOneAndDelete(query);
            if (!deletedRequest) {
                return { status: 204, message: "failed to remove", statusText: "Requested" };
            }
            return { status: 202, message: "Rejected", statusText: "Follow" };
        }
        catch (error) {
            return { status: 505, error: error.message };
        }
    }
    async handleAcceptedRequest(userId, userIdOf, usernameOf) {
        try {
            const query = { $and: [{ userId }, { userIdOf }] };
            const acceptedRequest = await FollowRequest_1.default.findOneAndDelete(query);
            if (!acceptedRequest)
                return { status: 404, success: false, message: "failed!" };
            await FollowersDoc_1.default.create({ userId, FollowedById: userIdOf, FollowedByUsername: usernameOf });
            await ProfileDoc_1.default.findByIdAndUpdate(userId, { $inc: { followers: 1 } }, { new: true });
            const user = await ProfileDoc_1.default.findById(userId);
            if (!user)
                return { status: 404, success: false, message: "user not found" };
            await FollowingDoc_1.default.create({
                userId: userIdOf,
                FollowingWhomId: userId,
                FollowingWhomUsername: user.username,
            });
            await ProfileDoc_1.default.findByIdAndUpdate(userIdOf, { $inc: { following: 1 } }, { new: true });
            return { status: 200, success: true, message: "Accepted" };
        }
        catch (error) {
            return { status: 500, success: false, error: error.message };
        }
    }
    async handleRemoveFollower(userId, userIdOf) {
        const followerQuery = { $and: [{ userId }, { FollowedById: userIdOf }] };
        const followingQuery = { $and: [{ userId: userIdOf }, { FollowingWhomId: userId }] };
        try {
            const removedFollower = await FollowersDoc_1.default.findOneAndDelete(followerQuery);
            const removedFollowing = await FollowingDoc_1.default.findOneAndDelete(followingQuery);
            if (!removedFollower || !removedFollowing) {
                return { status: 404, success: false, statusText: "Following" };
            }
            await ProfileDoc_1.default.findByIdAndUpdate(userId, { $inc: { followers: -1 } }, { new: true });
            await ProfileDoc_1.default.findByIdAndUpdate(userIdOf, { $inc: { following: -1 } }, { new: true });
            return { status: 202, success: true, statusText: "Follow" };
        }
        catch (error) {
            return { status: 505, success: false, error: error.message };
        }
    }
};
FollowService = __decorate([
    (0, tsyringe_1.injectable)()
], FollowService);
exports.default = FollowService;
