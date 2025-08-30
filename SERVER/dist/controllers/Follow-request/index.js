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
const index_1 = __importDefault(require("../../services/Follow-Request/index"));
let FollowController = class FollowController {
    constructor(followService) {
        this.followService = followService;
        this.handleFollowRequest = async (req, res) => {
            const { userId, userIdOf, usernameOf } = req.body;
            const result = await this.followService.handleFollowRequest(userId, userIdOf, usernameOf);
            res.status(result.status).json({ status: result.message });
            return;
        };
        this.checkExistsInFollower = async (req, res) => {
            const { userId, userIdOf } = req.body;
            if (!userId || !userIdOf) {
                res.status(404).json({ error: "id's required" });
                return;
            }
            const result = await this.followService.checkExistsInFollower(userId, userIdOf);
            if (result.error) {
                res.status(404).json({ error: result.error });
                return;
            }
            res.status(result.status).json({ status: result.statusText });
            return;
        };
        this.checkAlreadyRequested = async (req, res) => {
            const { userId, userIdOf } = req.body;
            if (!userId || !userIdOf) {
                res.status(404).json({ error: "id required" });
                return;
            }
            const result = await this.followService.checkAlreadyRequested(userId, userIdOf);
            if (result.error) {
                res.status(404).json({ error: result.error });
                return;
            }
            res.status(result.status).json({ status: result.statusText });
            return;
        };
        this.handleRemoveRequested = async (req, res) => {
            const { userId, userIdOf } = req.body;
            const result = await this.followService.handleRemoveRequested(userId, userIdOf);
            if (result.error) {
                res.status(505).json({ error: result.error });
                return;
            }
            res.status(result.status).json({ message: result.message, status: result.statusText });
            return;
        };
        this.handleAcceptedRequest = async (req, res) => {
            const { userId, userIdOf, usernameOf } = req.body;
            const result = await this.followService.handleAcceptedRequest(userId, userIdOf, usernameOf);
            if (result.success) {
                res.status(result.status).json({ message: result.message });
                return;
            }
            res.status(result.status).json({ error: result.message || result.error });
            return;
        };
        this.handleRemoveFollower = async (req, res) => {
            const { userId, userIdOf } = req.body;
            const result = await this.followService.handleRemoveFollower(userId, userIdOf);
            if (result.success) {
                res.status(result.status).json({ status: result.statusText });
                return;
            }
            res.status(result.status).json({ error: result.error || result.statusText });
            return;
        };
    }
};
FollowController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [index_1.default])
], FollowController);
exports.default = FollowController;
