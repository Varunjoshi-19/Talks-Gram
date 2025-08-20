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
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const userRoute_1 = __importDefault(require("../routes/protected-routes/userRoute"));
const postRoute_1 = __importDefault(require("./protected-routes/postRoute"));
const chatRoute_1 = require("./protected-routes/chatRoute");
const reelRoute_1 = __importDefault(require("./protected-routes/reelRoute"));
let Routers = class Routers {
    constructor(userRoutes, postRoutes, chatRoutes, reelRoutes) {
        this.userRoutes = userRoutes;
        this.postRoutes = postRoutes;
        this.chatRoutes = chatRoutes;
        this.reelRoutes = reelRoutes;
        this.router = (0, express_1.Router)();
    }
    getRoutes() {
        this.router.get("/api", (req, res) => {
            console.log("api route");
            res.send({ message: "api router" });
        });
        this.router.use("/accounts", this.userRoutes.getRoutes());
        this.router.use("/uploadPost", this.postRoutes.getRoutes());
        this.router.use("/Personal-chat", this.chatRoutes.getRoutes());
        this.router.use("/uploadReel", this.reelRoutes.getRoutes());
        return this.router;
    }
};
Routers = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [userRoute_1.default,
        postRoute_1.default,
        chatRoute_1.ChatRoutes,
        reelRoute_1.default])
], Routers);
exports.default = Routers;
