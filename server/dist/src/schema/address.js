"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.addressSchema = joi_1.default.object({
    address: joi_1.default.string().required().trim(),
    label: joi_1.default.string().required().trim(),
});
