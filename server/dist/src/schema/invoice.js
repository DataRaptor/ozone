"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeInvoicePaymentSchema = exports.updateInvoiceStatusSchema = exports.invoiceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.invoiceSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    dueAt: joi_1.default.number().required(),
    number: joi_1.default.string().required(),
    issuedAt: joi_1.default.number().required(),
    clientId: joi_1.default.string().required(),
    paymentTokenId: joi_1.default.string().required(),
    paymentAddressId: joi_1.default.string().required(),
    notes: joi_1.default.string().optional().default(null),
    status: joi_1.default.string().required(),
    items: joi_1.default.array()
        .items({
        id: joi_1.default.string().optional(),
        mode: joi_1.default.string().required(),
        price: joi_1.default.number().required(),
        quantity: joi_1.default.number().required(),
        companyId: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        tax: joi_1.default.number().optional().default(null),
        discount: joi_1.default.number().optional().default(null),
    })
        .optional()
        .empty(joi_1.default.array().length(0))
        .default([]),
});
exports.updateInvoiceStatusSchema = joi_1.default.object({
    status: joi_1.default.string().required().valid("APPROVED", "REJECTED").trim(),
    token: joi_1.default.string().required().trim(),
});
exports.completeInvoicePaymentSchema = joi_1.default.object({
    transactionId: joi_1.default.string().required().trim(),
    token: joi_1.default.string().required().trim(),
});
