"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.companySchema = joi_1.default.object({
    name: joi_1.default.string().required().trim(),
    email: joi_1.default.string().email().optional().default(null).trim(),
    phone: joi_1.default.string().optional().default(null).trim(),
    taxNumber: joi_1.default.string().optional().default(null).trim(),
    line1: joi_1.default.string().optional().default(null).trim(),
    city: joi_1.default.string().optional().default(null).trim(),
    state: joi_1.default.string().optional().default(null).trim(),
    postalCode: joi_1.default.string().optional().default(null),
    country: joi_1.default.string().optional().default(null).trim(),
});
