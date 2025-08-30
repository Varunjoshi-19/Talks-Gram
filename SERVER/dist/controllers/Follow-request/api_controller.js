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
const api_1 = __importDefault(require("../../services/Follow-Request/api"));
const tsyringe_1 = require("tsyringe");
let FollowApiController = class FollowApiController {
    constructor(followService) {
        this.followService = followService;
        this.fetchAllRequests = async (req, res) => {
            const userId = req.params.id;
            const result = await this.followService.fetchAllRequests(userId);
            if (result.success) {
                res.status(result.status).json({ requests: result.data });
                return;
            }
            res.status(result.status).json({ error: result.message || result.error });
            return;
        };
        this.fetchAllFollowers = async (req, res) => {
            const userId = req.params.id;
            const followers = await this.followService.fetchAllFollowers(userId);
            res.status(200).json({ followers });
        };
        this.fetchAllFollowings = async (req, res) => {
            const userId = req.params.id;
            const followings = await this.followService.fetchAllFollowings(userId);
            res.status(200).json({ followings });
        };
    }
};
FollowApiController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [api_1.default])
], FollowApiController);
exports.default = FollowApiController;
