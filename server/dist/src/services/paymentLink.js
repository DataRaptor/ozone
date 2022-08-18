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
exports.PaymentLinkService = void 0;
const typedi_1 = require("typedi");
const app_1 = require("../app");
const prisma_1 = require("../database/prisma");
const errors_1 = require("../errors");
const schema_1 = require("../schema");
const utils_1 = require("../utils");
let PaymentLinkService = class PaymentLinkService {
    createPaymentLink(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const data = yield schema_1.createPaymentLinkSchema.validateAsync(cleanPayload);
            const token = yield prisma_1.prisma.token.findUnique({ where: { id: data.tokenId } });
            if (!token) {
                throw new errors_1.ApiError("Token is not supported", 404);
            }
            const address = yield prisma_1.prisma.address.findUnique({ where: { id: data.addressId } });
            if (!address) {
                throw new errors_1.ApiError("Address not found", 404);
            }
            const payment = yield prisma_1.prisma.paymentLink.create({
                data: {
                    title: data.title,
                    description: data.description,
                    redirectUrl: data.redirectUrl,
                    token: { connect: { id: token.id } },
                    address: { connect: { id: address.id } },
                    company: { connect: { id: company.id } },
                    amount: data.amount ? data.amount * Math.pow(10, token.decimals) : 0,
                },
                include: { token: true, company: true, address: true },
            });
            return payment;
        });
    }
    getPaymentLink(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPayload = utils_1.utils.clean(payload);
            if (cleanPayload.token) {
                const token = app_1.app.jwt.verify(Buffer.from(cleanPayload.token, "hex").toString());
                if (token && token.invoiceId !== cleanPayload.id) {
                    throw new errors_1.ApiError("Invalid Token", 400);
                }
            }
            const paymentLink = yield prisma_1.prisma.paymentLink.findUnique({
                where: { id: cleanPayload.id },
                include: { token: true, company: true, address: true },
            });
            if (!paymentLink) {
                throw new errors_1.ApiError("Payment link not found", 404);
            }
            return paymentLink;
        });
    }
    getPaymentLinks(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const paymentLinks = yield prisma_1.prisma.paymentLink.findMany({
                where: { company: { id: company.id } },
                include: { token: true, company: true, address: true },
            });
            return paymentLinks;
        });
    }
    getPaymentLinkShareToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPayload = utils_1.utils.clean(payload);
            const paymentLink = yield prisma_1.prisma.paymentLink.findFirst({ where: { id: cleanPayload.id }, select: { id: true } });
            if (!paymentLink) {
                throw new errors_1.ApiError("Payment link not found", 404);
            }
            return {
                token: Buffer.from(app_1.app.jwt.sign({ paymentId: paymentLink.id })).toString("hex"),
            };
        });
    }
    updatePaymentLink(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const data = yield schema_1.createPaymentLinkSchema.validateAsync(cleanPayload.data);
            const paymentLink = yield prisma_1.prisma.paymentLink.findFirst({
                where: { id: cleanPayload.id, company: { id: company.id } },
            });
            if (!paymentLink) {
                throw new errors_1.ApiError("Payment link not found", 404);
            }
            const token = yield prisma_1.prisma.token.findUnique({ where: { id: data.tokenId } });
            if (!token) {
                throw new errors_1.ApiError("Token is not supported", 404);
            }
            const address = yield prisma_1.prisma.address.findUnique({ where: { id: data.addressId } });
            if (!address) {
                throw new errors_1.ApiError("Address not found", 404);
            }
            const payment = yield prisma_1.prisma.paymentLink.update({
                where: { id: paymentLink.id },
                data: {
                    title: data.title,
                    description: data.description,
                    redirectUrl: data.redirectUrl,
                    token: { connect: { id: token.id } },
                    address: { connect: { id: address.id } },
                    amount: data.amount ? data.amount * Math.pow(10, token.decimals) : 0,
                },
                include: { token: true, company: true, address: true },
            });
            return payment;
        });
    }
};
PaymentLinkService = __decorate([
    (0, typedi_1.Service)()
], PaymentLinkService);
exports.PaymentLinkService = PaymentLinkService;
