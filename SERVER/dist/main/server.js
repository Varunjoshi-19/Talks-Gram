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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
// server.ts
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const connections_1 = __importDefault(require("../database/connections"));
const middlewares_1 = __importDefault(require("../middlewares"));
const router_1 = __importDefault(require("../routes/router"));
const socket_1 = __importDefault(require("./socket"));
const __1 = require("..");
let Server = class Server {
    constructor(config, router, middleware, socketConnection, dbConnection) {
        this.config = config;
        this.router = router;
        this.middleware = middleware;
        this.socketConnection = socketConnection;
        this.dbConnection = dbConnection;
        this.config = config;
        this.router = router;
        this.middleware = middleware;
        this.dbConnection = dbConnection;
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.start();
    }
    async start() {
        this.setupMiddlewares();
        await this.connectToDatabase();
        this.setupRoutes();
        this.server.listen(this.config.port, () => {
            console.log(`Server running on port ${this.config.port}`);
        });
    }
    setupMiddlewares() {
        this.app.use((0, cookie_parser_1.default)());
        this.app.use((0, helmet_1.default)({
            crossOriginResourcePolicy: { policy: "cross-origin" },
            contentSecurityPolicy: false
        }));
        this.app.use((0, cors_1.default)({
            origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
            credentials: true,
            methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        this.app.use(express_1.default.json());
        this.app.use(body_parser_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.static(__1.publicFolderPath));
        // CORS middleware....
        this.socketConnection.establishConnection(this.server);
        // ORIGIN VALIDATE middleware....
        // this.app.use((req, res, next) =>
        //     this.middleware.checkTheOriginOfRequest(
        //         this.config.frontendURL,
        //         req,
        //         res,
        //         next
        //     )
        // );
    }
    async connectToDatabase() {
        await this.dbConnection.mongodbDatabaseConnection();
    }
    setupRoutes() {
        const mainRoutes = this.router.getRoutes();
        this.app.use("/", mainRoutes);
    }
};
exports.Server = Server;
exports.Server = Server = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __param(0, (0, tsyringe_1.inject)("Config")),
    __metadata("design:paramtypes", [Object, router_1.default,
        middlewares_1.default,
        socket_1.default,
        connections_1.default])
], Server);
