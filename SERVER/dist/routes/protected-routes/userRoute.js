"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const multer_1 = __importStar(require("multer"));
const user_1 = __importDefault(require("../../controllers/user-controller/user"));
const user_api_1 = __importDefault(require("../../controllers/user-controller/user_api"));
const validation_1 = __importDefault(require("../../controllers/validation-controller/validation"));
const communication_1 = __importDefault(require("../../controllers/others/communication"));
const other_1 = __importDefault(require("../../controllers/user-controller/other"));
const render_1 = __importDefault(require("../../controllers/others/render"));
let UserRoutes = class UserRoutes {
    constructor(userController, userapiController, userValidation, commController, userHelperController, renderController) {
        this.userController = userController;
        this.userapiController = userapiController;
        this.userValidation = userValidation;
        this.commController = commController;
        this.userHelperController = userHelperController;
        this.renderController = renderController;
    }
    getRoutes() {
        const router = (0, express_1.Router)();
        const upload = (0, multer_1.default)({ storage: (0, multer_1.memoryStorage)() });
        router.post("/update-profile", upload.single("profileImage"), this.userController.newProfileHandler.bind(this.userController));
        router.post("/login", this.userController.login.bind(this.userController));
        router.post("/signup", this.userController.signup.bind(this.userController));
        router.get("/fetch-profile-details/:id", this.userapiController.fetchSingleUserProfile.bind(this.userapiController));
        router.get("/getIdAndUsername/:id", this.userapiController.getIdAndUsername.bind(this.userapiController));
        router.get("/allAccounts", this.userapiController.fetchAllAccounts.bind(this.userapiController));
        router.post("/sendOtp", this.userValidation.generateOTP.bind(this.userValidation));
        router.post("/verifyOtp", this.userValidation.verifyOTP.bind(this.userValidation));
        router.post("/resetPassword", this.userValidation.resetPassword.bind(this.userValidation));
        router.post("/valid-password-reset/:id1/:id2", this.userValidation.checkValidParams.bind(this.userValidation));
        router.post("/searchUser", this.userHelperController.searchUsers.bind(this.userHelperController));
        router.get("/fetch/:id", this.commController.fetchCommunicationId.bind(this.commController));
        router.post("/add/:id", this.commController.addCommId.bind(this.commController));
        router.get("/user-online-status/:id", this.userapiController.fetchOnlineStatus.bind(this.userapiController));
        router.get("/profileImage/:id", this.renderController.renderImage.bind(this.renderController));
        return router;
    }
};
UserRoutes = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [user_1.default,
        user_api_1.default,
        validation_1.default,
        communication_1.default,
        other_1.default,
        render_1.default])
], UserRoutes);
exports.default = UserRoutes;
