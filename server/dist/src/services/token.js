"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const typedi_1 = require("typedi");
const prisma_1 = require("../database/prisma");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
let TokenService = class TokenService {
    getTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield prisma_1.prisma.token.findMany();
            return tokens;
        });
    }
    getToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPayload = utils_1.utils.clean(payload);
            const token = yield prisma_1.prisma.token.findUnique({ where: { id: cleanPayload.id } });
            if (!token) {
                throw new errors_1.ApiError("Token does not exist", 404);
            }
            return token;
        });
    }
};
TokenService = __decorate([
    (0, typedi_1.Service)()
], TokenService);
exports.TokenService = TokenService;
