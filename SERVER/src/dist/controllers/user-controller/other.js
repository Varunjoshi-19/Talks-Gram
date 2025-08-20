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
const user_1 = __importDefault(require("../../utils/others/user"));
let UserHelperController = class UserHelperController {
    constructor(userHelper) {
        this.userHelper = userHelper;
        this.checkDuplicacy = async (req, res) => {
            try {
                const { username, email } = req.body;
                if (!username || !email) {
                    return res.status(400).json({ error: "Username and email are required" });
                }
                const result = await this.userHelper.checkDuplicacy(username, email);
                if (result) {
                    return res.status(409).json({ error: `${result} already exists` });
                }
                return res.status(200).json({ message: "No duplicacy found" });
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        };
        this.findAccount = async (req, res) => {
            try {
                const { username, email } = req.query;
                if (!username && !email) {
                    return res.status(400).json({ error: "Username or email required" });
                }
                const key = username ? "username" : "email";
                const value = String(username || email);
                const user = await this.userHelper.findAccount(key, value);
                if (!user)
                    return res.status(404).json({ error: "User not found" });
                return res.status(200).json({ user });
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        };
        this.searchUsers = async (req, res) => {
            try {
                const { username } = req.query;
                const searchedAccounts = await this.userHelper.searchUsers(String(username));
                if (!searchedAccounts || searchedAccounts.length === 0) {
                    res.status(404).json({ message: "No users found" });
                    return;
                }
                res.status(200).json({ searchedAccounts });
                return;
            }
            catch (error) {
                res.status(500).json({ error: error.message });
                return;
            }
        };
        this.getDefaultImage = async (_req, res) => {
            try {
                const image = this.userHelper.getDefaultImage();
                res.contentType(image.contentType);
                res.status(200).send(image.data);
            }
            catch (error) {
                res.status(500).json({ error: "Image not found or failed to load" });
            }
        };
    }
};
UserHelperController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [user_1.default])
], UserHelperController);
exports.default = UserHelperController;
