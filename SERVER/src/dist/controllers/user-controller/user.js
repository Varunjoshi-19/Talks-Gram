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
const UserServices_1 = __importDefault(require("../../services/user-services/UserServices"));
const user_1 = __importDefault(require("../../utils/others/user"));
let UserController = class UserController {
    constructor(userService, userHelper) {
        this.userService = userService;
        this.userHelper = userHelper;
        this.login = async (req, res) => {
            try {
                const result = await this.userService.login(req.body);
                res.status(result.status).json(result.success ? { data: result.data } : { error: result.message });
                return;
            }
            catch (err) {
                res.status(500).json({ error: err.message });
                return;
            }
        };
        this.signup = async (req, res) => {
            try {
                const result = await this.userService.signup(req.body);
                res.status(result.status).json(result.success ? result.data : { error: result.message });
                return;
            }
            catch (err) {
                res.status(500).json({ error: err.message });
                return;
            }
        };
        this.newProfileHandler = async (req, res) => {
            try {
                const { id } = req.body;
                const updatedProfile = await this.userService.updateProfile(id, req.body, req.file);
                res.status(200).json({ message: "Profile Updated Successfully", updatedProfile });
                return;
            }
            catch (error) {
                res.status(400).json({ error: error.message });
                return;
            }
        };
    }
};
UserController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [UserServices_1.default, user_1.default])
], UserController);
exports.default = UserController;
