"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const server_1 = require("./server");
dotenv_1.default.config();
const config = {
    port: process.env.PORT || 4000,
    mongoUrl: process.env.MONGODB_URI,
};
tsyringe_1.container.register("Config", { useValue: config });
tsyringe_1.container.resolve(server_1.Server);
