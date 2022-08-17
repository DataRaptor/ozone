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
exports.InvoiceService = void 0;
const typedi_1 = require("typedi");
const app_1 = require("../app");
const config_1 = require("../config");
const prisma_1 = require("../database/prisma");
const errors_1 = require("../errors");
const schema_1 = require("../schema");
const utils_1 = require("../utils");
let InvoiceService = class InvoiceService {
    createInvoice(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const data = yield schema_1.invoiceSchema.validateAsync(cleanPayload);
            const token = yield prisma_1.prisma.token.findUnique({ where: { id: data.paymentTokenId } });
            if (!token) {
                throw new errors_1.ApiError("Token is not supported", 404);
            }
            const client = yield prisma_1.prisma.client.findUnique({ where: { id: data.clientId } });
            if (!client) {
                throw new errors_1.ApiError("Client does not exist", 404);
            }
            const address = yield prisma_1.prisma.address.findUnique({ where: { id: data.paymentAddressId } });
            if (!address) {
                throw new errors_1.ApiError("Address does not exist", 404);
            }
            const sumItems = [], createItems = [];
            for (let i = 0; i < data.items.length; i++) {
                const item = data.items[i];
                if (item.mode === "create") {
                    createItems.push({
                        description: item.description,
                        quantity: item.quantity,
                        price: item.price * Math.pow(10, token.decimals),
                        discount: item.discount,
                        tax: item.tax,
                        companyId: item.companyId,
                    });
                    sumItems.push(Object.assign(Object.assign({}, item), utils_1.tally.getItemAmounts(item)));
                }
            }
            const amounts = utils_1.tally.sumTotalAmounts(sumItems);
            const invoice = yield prisma_1.prisma.invoice.create({
                data: {
                    notes: data.notes,
                    title: data.title,
                    number: data.number,
                    dueAt: new Date(data.dueAt),
                    items: { create: createItems },
                    issuedAt: new Date(data.issuedAt),
                    client: { connect: { id: data.clientId } },
                    company: { connect: { id: company.id } },
                    status: data.status,
                    paymentToken: { connect: { id: data.paymentTokenId } },
                    paymentAddress: { connect: { id: data.paymentAddressId } },
                    netAmount: amounts.netAmount * Math.pow(10, token.decimals),
                },
            });
            if (data.status === "PENDING") {
                const link = new URL(`/invoices/${invoice.id}`, config_1.environment.appUrl);
                link.searchParams.set("bar", "0");
                link.searchParams.set("token", Buffer.from(app_1.app.jwt.sign({ invoiceId: invoice.id })).toString("hex"));
                const mailData = {
                    template: "sendInvoice",
                    to: client.email,
                    payload: {
                        client: client.name,
                        company: company.name,
                        link: link.toString(),
                    },
                };
                yield utils_1.mail.send(mailData);
            }
            return invoice;
        });
    }
    getInvoices(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const include = { client: true, paymentToken: true };
            let invoices;
            if (!payload.status) {
                invoices = yield prisma_1.prisma.invoice.findMany({
                    where: {
                        company: { id: { equals: company.id } },
                        status: { not: { equals: "DRAFT" } },
                    },
                    include,
                });
            }
            else if (payload.clientId) {
                invoices = yield prisma_1.prisma.invoice.findMany({
                    where: {
                        company: { id: { equals: company.id } },
                        client: { id: { equals: payload.clientId } },
                    },
                    include,
                });
            }
            else {
                invoices = yield prisma_1.prisma.invoice.findMany({
                    where: {
                        status: payload.status,
                        company: { id: { equals: company.id } },
                    },
                    include,
                });
            }
            return invoices;
        });
    }
    getInvoice(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPayload = utils_1.utils.clean(payload);
            const invoice = yield prisma_1.prisma.invoice.findUnique({
                where: { id: cleanPayload.id },
                include: {
                    items: true,
                    client: true,
                    company: true,
                    paymentToken: true,
                    paymentAddress: true,
                },
            });
            if (!invoice) {
                throw new errors_1.ApiError("Invoice does not exist", 404);
            }
            return invoice;
        });
    }
    getNextInvoiceNumber(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const count = yield prisma_1.prisma.invoice.count({ where: { company: { id: company.id } } });
            const str = "00000" + (count + 1);
            return { number: `INV-${str.substring(str.length - 5)}` };
        });
    }
    updateInvoice(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const data = yield schema_1.invoiceSchema.validateAsync(cleanPayload.invoice);
            const invoice = yield prisma_1.prisma.invoice.findFirst({
                where: { id: cleanPayload.id },
                select: { id: true, status: true },
            });
            if (!invoice) {
                throw new errors_1.ApiError("Invoice not found", 404);
            }
            if (invoice.status !== "DRAFT" && data.status === "DRAFT") {
                throw new errors_1.ApiError(`A sent incoice cannot be made draft`, 400);
            }
            if (invoice.status === "APPROVED" || invoice.status === "REJECTED" || invoice.status === "PAID") {
                throw new errors_1.ApiError(`You cannot update an already ${invoice.status.toLowerCase()} incoice`, 400);
            }
            const token = yield prisma_1.prisma.token.findUnique({ where: { id: data.paymentTokenId } });
            if (!token) {
                throw new errors_1.ApiError("Token is not supported", 404);
            }
            const client = yield prisma_1.prisma.client.findUnique({ where: { id: data.clientId } });
            if (!client) {
                throw new errors_1.ApiError("Client does not exist", 404);
            }
            const address = yield prisma_1.prisma.address.findUnique({ where: { id: data.paymentAddressId } });
            if (!address) {
                throw new errors_1.ApiError("Address does not exist", 404);
            }
            const sumItems = [], createItems = [], deleteItems = [], updateItems = [];
            for (let i = 0; i < data.items.length; i++) {
                const item = data.items[i];
                if (item.mode === "create") {
                    createItems.push({
                        tax: item.tax,
                        price: item.price * Math.pow(10, token.decimals),
                        quantity: item.quantity,
                        discount: item.discount,
                        companyId: item.companyId,
                        description: item.description,
                    });
                    sumItems.push(Object.assign(Object.assign({}, item), utils_1.tally.getItemAmounts(item)));
                }
                else if (item.mode === "update") {
                    updateItems.push({
                        where: { id: item.id },
                        data: {
                            tax: item.tax,
                            price: item.price * Math.pow(10, token.decimals),
                            quantity: item.quantity,
                            discount: item.discount,
                            companyId: item.companyId,
                            description: item.description,
                        },
                    });
                    sumItems.push(Object.assign(Object.assign({}, item), utils_1.tally.getItemAmounts(item)));
                }
                else {
                    deleteItems.push({ id: item.id });
                }
            }
            const amounts = utils_1.tally.sumTotalAmounts(sumItems);
            const updateData = {
                notes: data.notes,
                title: data.title,
                number: data.number,
                dueAt: new Date(data.dueAt),
                issuedAt: new Date(data.issuedAt),
                client: { connect: { id: data.clientId } },
                company: { connect: { id: company.id } },
                status: data.status == null ? undefined : data.status,
                paymentToken: { connect: { id: data.paymentTokenId } },
                paymentAddress: { connect: { id: data.paymentAddressId } },
                netAmount: amounts.netAmount * Math.pow(10, token.decimals),
                items: { create: createItems, update: updateItems, delete: deleteItems },
            };
            const update = yield prisma_1.prisma.invoice.update({
                where: { id: invoice.id },
                data: updateData,
                include: { items: true, client: true, company: true, paymentToken: true, paymentAddress: true },
            });
            if (invoice.status === "DRAFT" && data.status === "PENDING") {
                const link = new URL(`/invoices/${invoice.id}`, config_1.environment.appUrl);
                link.searchParams.set("bar", "0");
                link.searchParams.set("token", Buffer.from(app_1.app.jwt.sign({ invoiceId: invoice.id })).toString("hex"));
                const mailData = {
                    template: "sendInvoice",
                    to: client.email,
                    payload: {
                        client: client.name,
                        company: company.name,
                        link: link.toString(),
                    },
                };
                yield utils_1.mail.send(mailData);
            }
            return update;
        });
    }
    updateInvoiceStatus(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPayload = utils_1.utils.clean(payload);
            const data = yield schema_1.updateInvoiceStatusSchema.validateAsync(cleanPayload.data);
            const token = app_1.app.jwt.verify(Buffer.from(data.token, "hex").toString());
            if (token && token.invoiceId !== payload.id) {
                throw new errors_1.ApiError("Invalid Token", 404);
            }
            const invoice = yield prisma_1.prisma.invoice.findFirst({
                where: { id: cleanPayload.id },
                select: { id: true, status: true },
            });
            if (!invoice) {
                throw new errors_1.ApiError("Invoice not found", 404);
            }
            if (invoice.status === "DRAFT") {
                throw new errors_1.ApiError("Invoice is still is draft", 409);
            }
            if (invoice.status === "APPROVED") {
                throw new errors_1.ApiError("Invoice has already been approved", 409);
            }
            if (invoice.status === "REJECTED") {
                throw new errors_1.ApiError("Invoice has already been rejected", 409);
            }
            if (invoice.status === "PAID") {
                throw new errors_1.ApiError("Invoice has already been paid", 409);
            }
            return yield prisma_1.prisma.invoice.update({
                where: { id: invoice.id },
                data: { status: data.status },
                include: { items: true, client: true, company: true, paymentToken: true, paymentAddress: true },
            });
        });
    }
    completeInvoicePayment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPayload = utils_1.utils.clean(payload);
            const data = yield schema_1.completeInvoicePaymentSchema.validateAsync(cleanPayload.data);
            const token = app_1.app.jwt.verify(Buffer.from(data.token, "hex").toString());
            if (token && token.invoiceId !== payload.id) {
                throw new errors_1.ApiError("Invalid Token", 404);
            }
            const invoice = yield prisma_1.prisma.invoice.findFirst({
                where: { id: cleanPayload.id },
                select: { id: true, status: true },
            });
            if (!invoice) {
                throw new errors_1.ApiError("Invoice not found", 404);
            }
            if (invoice.status === "DRAFT") {
                throw new errors_1.ApiError("Invoice is still is draft", 409);
            }
            if (invoice.status === "PENDING") {
                throw new errors_1.ApiError("Invoice has not yet been approved", 409);
            }
            if (invoice.status === "REJECTED") {
                throw new errors_1.ApiError("Invoice has already been rejected", 409);
            }
            if (invoice.status === "PAID") {
                throw new errors_1.ApiError("Invoice has already been paid", 409);
            }
            return yield prisma_1.prisma.invoice.update({
                where: { id: invoice.id },
                data: {
                    status: "PAID",
                    payment: {
                        update: {
                            transactionId: data.transactionId,
                            status: "COMPLETED",
                        },
                    },
                },
                include: {
                    items: true,
                    client: true,
                    company: true,
                    paymentToken: true,
                    paymentAddress: true,
                },
            });
        });
    }
    getInvoiceShareToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPayload = utils_1.utils.clean(payload);
            const invoice = yield prisma_1.prisma.invoice.findFirst({ where: { id: cleanPayload.id }, select: { id: true } });
            if (!invoice) {
                throw new errors_1.ApiError("Invoice not found", 404);
            }
            return {
                token: Buffer.from(app_1.app.jwt.sign({ invoiceId: invoice.id })).toString("hex"),
            };
        });
    }
    sendInvoiceReminder(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const invoice = yield prisma_1.prisma.invoice.findUnique({
                where: { id: cleanPayload.id },
                include: { client: true },
            });
            if (!invoice) {
                throw new errors_1.ApiError("Invoice not found", 404);
            }
            if (invoice.companyId !== company.id) {
                throw new errors_1.ApiError("You do not have permission to access this resource", 404);
            }
            const link = new URL(`/invoices/${invoice.id}`, config_1.environment.appUrl);
            link.searchParams.set("bar", "0");
            link.searchParams.set("token", Buffer.from(app_1.app.jwt.sign({ invoiceId: invoice.id })).toString("hex"));
            const mailData = {
                template: "invoiceReminder",
                to: invoice.client.email,
                payload: {
                    client: invoice.client.name,
                    company: company.name,
                    link: link.toString(),
                },
            };
            yield utils_1.mail.send(mailData);
        });
    }
};
InvoiceService = __decorate([
    (0, typedi_1.Service)()
], InvoiceService);
exports.InvoiceService = InvoiceService;
