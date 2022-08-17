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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const argon2_1 = __importDefault(require("argon2"));
const typedi_1 = require("typedi");
const app_1 = require("../app");
const config_1 = require("../config");
const prisma_1 = require("../database/prisma");
const errors_1 = require("../errors");
const schema_1 = require("../schema");
const utils_1 = require("../utils");
let AuthService = class AuthService {
    signUpUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPayload = utils_1.utils.clean(payload);
            switch (cleanPayload.mode) {
                case "wallet":
                    return yield this.walletSignUp(cleanPayload);
                case "email":
                    return this.emailSignUp(cleanPayload);
                default:
                    throw new errors_1.ApiError("Authentication mode is not supported", 400);
            }
        });
    }
    signInUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPayload = utils_1.utils.clean(payload);
            switch (cleanPayload.mode) {
                case "wallet":
                    return yield this.walletSignIn(cleanPayload);
                case "email":
                    return this.emailSignIn(cleanPayload);
                default:
                    throw new errors_1.ApiError("Authentication mode is not supported", 400);
            }
        });
    }
    walletSignUp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield schema_1.walletSignatureSchema.validateAsync(payload, { allowUnknown: true });
            const message = `${config_1.walletAuthMessage} ${data.messageId}`;
            const isValidSignature = utils_1.nacl.verifyMessage(message, data.signature, data.address);
            if (!isValidSignature) {
                throw new errors_1.ApiError("Invalid signature", 409);
            }
            const user = yield prisma_1.prisma.user.findUnique({ where: { address: data.address } });
            if (user) {
                throw new errors_1.ApiError("User already exists", 409);
            }
            const newUser = yield prisma_1.prisma.user.create({
                data: {
                    address: data.address,
                    companies: {
                        create: {
                            name: data.address,
                            addresses: {
                                create: {
                                    label: "Main",
                                    address: data.address,
                                },
                            },
                        },
                    },
                },
            });
            return { token: app_1.app.jwt.sign({ id: newUser.id, address: newUser.address }) };
        });
    }
    emailSignUp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield schema_1.emailSignUpSchema.validateAsync(payload, { allowUnknown: true });
            const user = yield prisma_1.prisma.user.findUnique({ where: { email: data.email } });
            if (user) {
                throw new errors_1.ApiError("User already exists", 409);
            }
            const password = yield argon2_1.default.hash(data.password);
            const newUser = yield prisma_1.prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password,
                    companies: {
                        create: { name: data.name },
                    },
                },
            });
            return { token: app_1.app.jwt.sign({ id: newUser.id, email: newUser.email }) };
        });
    }
    walletSignIn(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield schema_1.walletSignatureSchema.validateAsync(payload, { allowUnknown: true });
            const message = `${config_1.walletAuthMessage} ${data.messageId}`;
            const isValidSignature = utils_1.nacl.verifyMessage(message, data.signature, data.address);
            if (!isValidSignature) {
                throw new errors_1.ApiError("Invalid signature", 400);
            }
            const user = yield prisma_1.prisma.user.findUnique({ where: { address: data.address } });
            if (!user) {
                throw new errors_1.ApiError("User does not exist", 404);
            }
            return { token: app_1.app.jwt.sign({ id: user.id, address: user.address }) };
        });
    }
    emailSignIn(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield schema_1.emailSignInSchema.validateAsync(payload, { allowUnknown: true });
            const user = yield prisma_1.prisma.user.findUnique({ where: { email: data.email } });
            if (!user) {
                throw new errors_1.ApiError("User does not exist", 404);
            }
            const isValidPassword = yield argon2_1.default.verify(user.password, data.password);
            if (!isValidPassword) {
                throw new errors_1.ApiError("The password provided is invalid", 400);
            }
            return { token: app_1.app.jwt.sign({ id: user.id, email: user.email }) };
        });
    }
};
AuthService = __decorate([
    (0, typedi_1.Service)()
], AuthService);
exports.AuthService = AuthService;
