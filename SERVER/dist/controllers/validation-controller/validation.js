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
const validation_1 = __importDefault(require("../../utils/others/validation"));
let OtpController = class OtpController {
    constructor(otpService) {
        this.otpService = otpService;
        this.generateOTP = async (req, res) => {
            try {
                const { email } = req.body;
                const result = await this.otpService.generateOTP(email);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.verifyOTP = async (req, res) => {
            try {
                const { userId, enteredOTP } = req.body;
                const keyId = await this.otpService.verifyOTP(userId, enteredOTP);
                res.status(202).json({ message: "OTP verified", keyId });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.resetPassword = async (req, res) => {
            try {
                const { keyId, userId, newPassword } = req.body;
                const message = await this.otpService.resetPassword(keyId, userId, newPassword);
                res.status(200).json({ message });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.checkValidParams = async (req, res) => {
            try {
                const { id1, id2 } = req.params;
                const message = this.otpService.checkValidParams(id1, id2);
                res.status(202).json({ message });
            }
            catch (error) {
                res.status(404).json({ error: error.message });
            }
        };
    }
};
OtpController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [validation_1.default])
], OtpController);
exports.default = OtpController;
