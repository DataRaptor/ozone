"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userNewPasswordUpdateSchema = exports.userExistingPasswordUpdateSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    name: joi_1.default.string().required().trim(),
    email: joi_1.default.string().email().required().trim(),
});
exports.userExistingPasswordUpdateSchema = joi_1.default.object({
    oldPassword: joi_1.default.string().required().trim(),
    newPassword: joi_1.default.string().required().trim(),
});
exports.userNewPasswordUpdateSchema = joi_1.default.object({
    repeatPassword: joi_1.default.string().required().trim(),
    newPassword: joi_1.default.string().required().trim(),
});
