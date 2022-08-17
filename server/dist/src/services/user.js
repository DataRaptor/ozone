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
exports.UserService = void 0;
const argon2_1 = __importDefault(require("argon2"));
const typedi_1 = require("typedi");
const prisma_1 = require("../database/prisma");
const errors_1 = require("../errors");
const schema_1 = require("../schema");
const utils_1 = require("../utils");
let UserService = class UserService {
    updateUser(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const data = yield schema_1.userSchema.validateAsync(cleanPayload);
            if (data.email && data.email !== user.email) {
                const user = yield prisma_1.prisma.user.findFirst({ where: { email: data.email } });
                if (user) {
                    throw new errors_1.ApiError("User email address already exists", 409);
                }
            }
            const update = yield prisma_1.prisma.user.update({ where: { id: user.id }, data: Object.assign(Object.assign({}, cleanPayload), data) });
            return {
                name: update.name,
                email: update.email,
                address: update.address,
                hasPassword: !!update.password ? true : false,
            };
        });
    }
    updateUserPassword(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            let data;
            if (user.password) {
                data = yield schema_1.userExistingPasswordUpdateSchema.validateAsync(cleanPayload);
                if (yield argon2_1.default.verify(user.password, data.newPassword)) {
                    throw new errors_1.ApiError("New password cannot be the same as new password", 400);
                }
                if (!(yield argon2_1.default.verify(user.password, data.oldPassword))) {
                    throw new errors_1.ApiError("Old password is not correct", 400);
                }
            }
            else {
                data = yield schema_1.userNewPasswordUpdateSchema.validateAsync(cleanPayload);
                if (data.newPassword !== data.repeatPassword) {
                    throw new errors_1.ApiError("Repeated Password does not match the new password", 400);
                }
            }
            const hash = yield argon2_1.default.hash(data.newPassword);
            const update = yield prisma_1.prisma.user.update({ where: { id: user.id }, data: { password: hash } });
            return { name: update.name, email: update.email, address: update.address, hasPassword: true };
        });
    }
};
UserService = __decorate([
    (0, typedi_1.Service)()
], UserService);
exports.UserService = UserService;
