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
const communication_1 = __importDefault(require("../../utils/others/communication"));
const user_1 = __importDefault(require("../../utils/others/user"));
let CommunicationController = class CommunicationController {
    constructor(commService, userHelper) {
        this.commService = commService;
        this.userHelper = userHelper;
        this.fetchCommunicationId = async (req, res) => {
            try {
                const id = req.params.id;
                const commId = await this.commService.fetchCommunicationId(id);
                res.status(202).json({ commId });
            }
            catch (error) {
                res.status(404).json({ error: error.message });
            }
        };
        this.addCommId = async (req, res) => {
            try {
                const id = req.params.id;
                const newComm = await this.commService.addCommId(id);
                res.status(202).json({ newComm });
            }
            catch (error) {
                res.status(505).json({ error: error.message });
            }
        };
    }
};
CommunicationController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [communication_1.default, user_1.default])
], CommunicationController);
exports.default = CommunicationController;
