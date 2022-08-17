"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSignInSchema = exports.walletSignatureSchema = exports.emailSignUpSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.emailSignUpSchema = joi_1.default.object({
    name: joi_1.default.string().required().trim(),
    password: joi_1.default.string().required().trim(),
    email: joi_1.default.string().email().required().trim(),
});
exports.walletSignatureSchema = joi_1.default.object({
    address: joi_1.default.string().required().trim(),
    signature: joi_1.default.string().required().trim(),
    messageId: joi_1.default.string().required().trim(),
});
exports.emailSignInSchema = joi_1.default.object({
    password: joi_1.default.string().required().trim(),
    email: joi_1.default.string().email().required().trim(),
});
