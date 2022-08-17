"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeTransactionSchema = exports.transactionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.transactionSchema = joi_1.default.object({
    source: joi_1.default.string().required(),
    amount: joi_1.default.number().required(),
    tokenId: joi_1.default.string().required(),
    companyId: joi_1.default.string().required(),
    addressId: joi_1.default.string().required(),
    clientId: joi_1.default.string().optional().default(null),
    invoiceId: joi_1.default.string().optional().default(null),
});
exports.completeTransactionSchema = joi_1.default.object({
    transactionId: joi_1.default.string().required(),
});
