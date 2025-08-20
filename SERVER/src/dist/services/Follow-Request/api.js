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
const FollowRequest_1 = __importDefault(require("../../models/FollowRequest"));
let FollowApiServices = class FollowApiServices {
    constructor() { }
    async fetchAllRequests(userId) {
        try {
            const requests = await FollowRequest_1.default.find({ userId });
            if (!requests || requests.length === 0) {
                return { success: false, status: 404, message: "No requests" };
            }
            return { success: true, status: 202, data: requests };
        }
        catch (error) {
            return { success: false, status: 404, error: error.message };
        }
    }
    async fetchAllFollowers(userId) {
        // Implement
        return [];
    }
    async fetchAllFollowings(userId) {
        // Implement
        return [];
    }
};
FollowApiServices = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [])
], FollowApiServices);
exports.default = FollowApiServices;
