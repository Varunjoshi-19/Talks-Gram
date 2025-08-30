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
const render_1 = __importDefault(require("../../utils/others/render"));
let RenderController = class RenderController {
    constructor(renderService) {
        this.renderService = renderService;
        this.renderImage = async (req, res) => {
            const { id } = req.params;
            const result = await this.renderService.getProfileImage(id);
            if (!result.success) {
                res.status(result.status).json({ error: result.message });
                return;
            }
            res.contentType(result.contentType);
            res.status(200).send(result.data);
        };
        this.renderMessageItem = async (req, res) => {
            const { id1, id2 } = req.params;
            const result = await this.renderService.fetchMessageItem(id1, id2);
            if (!result.success) {
                res.status(result.status).json({ error: result.message });
                return;
            }
            res.contentType(result.contentType);
            res.status(result.status).send(result.data);
        };
        this.renderPostImage = async (req, res) => {
            const { id } = req.params;
            const result = await this.renderService.renderPostImage(id);
            if (!result.success) {
                res.status(result.status).json({ error: result.message });
                return;
            }
            res.contentType(result.contentType);
            res.send(result.data);
            return;
        };
        this.handleRenderReel = async (req, res) => {
            const id = req.params.id?.trim();
            const result = await this.renderService.handleRenderReel(id);
            if (result.error) {
                res.status(result.status).json({ error: result.error });
                return;
            }
            res.contentType(result.contentType);
            res.send(result.data);
            return;
        };
        this.RenderStory = async (req, res) => {
            const id = req.params.id?.trim();
            const result = await this.renderService.handleRenderStory(id);
            if (result.error) {
                res.status(result.status).json({ error: result.error });
                return;
            }
            res.contentType(result.contentType);
            res.send(result.data);
            return;
        };
    }
};
RenderController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [render_1.default])
], RenderController);
exports.default = RenderController;
