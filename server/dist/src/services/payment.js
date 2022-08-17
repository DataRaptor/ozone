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
exports.PaymentService = void 0;
const web3_js_1 = require("@solana/web3.js");
const typedi_1 = require("typedi");
const prisma_1 = require("../database/prisma");
const errors_1 = require("../errors");
const schema_1 = require("../schema");
const utils_1 = require("../utils");
let PaymentService = class PaymentService {
    initiatePayment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPayload = utils_1.utils.clean(payload);
            const data = yield schema_1.paymentSchema.validateAsync(cleanPayload);
            const token = yield prisma_1.prisma.token.findUnique({ where: { id: data.tokenId } });
            if (!token) {
                throw new errors_1.ApiError("Token is not supported", 404);
            }
            const address = yield prisma_1.prisma.address.findUnique({ where: { id: data.addressId } });
            if (!address) {
                throw new errors_1.ApiError("Address not found", 404);
            }
            const company = yield prisma_1.prisma.company.findUnique({ where: { id: data.companyId } });
            if (!company) {
                throw new errors_1.ApiError("Company not found", 404);
            }
            let client;
            if (data.clientId) {
                client = yield prisma_1.prisma.client.findUnique({ where: { id: data.clientId } });
                if (!client) {
                    throw new errors_1.ApiError("Client does not exist", 404);
                }
            }
            let paymentLink;
            if (data.paymentLinkId) {
                paymentLink = yield prisma_1.prisma.paymentLink.findUnique({ where: { id: data.paymentLinkId } });
                if (!paymentLink) {
                    throw new errors_1.ApiError("Payment link does not exist", 404);
                }
            }
            let invoice;
            if (data.invoiceId) {
                invoice = yield prisma_1.prisma.invoice.findUnique({ where: { id: data.invoiceId } });
                if (!invoice) {
                    throw new errors_1.ApiError("Invoice not found", 404);
                }
            }
            const payment = yield prisma_1.prisma.payment.create({
                data: {
                    source: data.source,
                    token: { connect: { id: token.id } },
                    company: { connect: { id: company.id } },
                    address: { connect: { id: address.id } },
                    reference: new web3_js_1.Keypair().publicKey.toBase58(),
                    amount: data.amount * Math.pow(10, token.decimals),
                    client: client ? { connect: { id: client.id } } : undefined,
                    paymentLink: paymentLink ? { connect: { id: paymentLink.id } } : undefined,
                    invoice: invoice ? { connect: { id: invoice.id } } : undefined,
                },
                include: { token: true, company: true, address: true, client: true, invoice: true },
            });
            return payment;
        });
    }
    completePayment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPayload = utils_1.utils.clean(payload);
            const data = yield schema_1.completePaymentSchema.validateAsync(cleanPayload.data);
            const payment = yield prisma_1.prisma.payment.findUnique({ where: { id: payload.id } });
            if (!payment) {
                throw new errors_1.ApiError("Payment not found", 404);
            }
            yield prisma_1.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    transactionId: data.transactionId,
                    status: "COMPLETED",
                },
                include: { token: true, company: true, address: true, client: true, invoice: true },
            });
            return payment;
        });
    }
    getPayments(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const payments = yield prisma_1.prisma.payment.findMany({
                where: {
                    address: cleanPayload.addressId ? { id: cleanPayload.addressId } : undefined,
                    client: cleanPayload.clientId ? { id: cleanPayload.clientId } : undefined,
                    company: { id: company.id },
                },
                include: { token: true, company: true, address: true, client: true, invoice: true },
            });
            return payments;
        });
    }
};
PaymentService = __decorate([
    (0, typedi_1.Service)()
], PaymentService);
exports.PaymentService = PaymentService;
