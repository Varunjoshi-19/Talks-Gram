"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
let MiddleWares = class MiddleWares {
    checkTheOriginOfRequest(originUrl, req, res, next) {
        const referer = req.headers["referer"];
        const isFromFrontend = (referer && referer == `${originUrl}/`);
        if (!isFromFrontend) {
            res.status(403).send({ error: "Forbidden - Invalid request of origin try from main!" });
            return;
        }
        next();
    }
};
MiddleWares = __decorate([
    (0, tsyringe_1.injectable)()
], MiddleWares);
exports.default = MiddleWares;
