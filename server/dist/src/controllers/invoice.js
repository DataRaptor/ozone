"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.InvoiceController = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const typedi_1 = require("typedi");
let InvoiceController = class InvoiceController {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    createInvoice(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, user, company } = request;
            const payload = {
                title: body.title,
                notes: body.notes,
                status: body.status,
                clientId: body.clientId,
                paymentTokenId: body.paymentTokenId,
                dueAt: body.dueAt,
                number: body.number,
                issuedAt: body.issuedAt,
                paymentAddressId: body.paymentAddressId,
                items: body.items,
            };
            const data = yield this.invoiceService.createInvoice(payload, { user, company });
            return utils_1.response.success(reply, { message: "Invoice created successfuly", data });
        });
    }
    getInvoices(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query, user, company } = request;
            const payload = { status: query.status, clientId: query.clientId };
            const data = yield this.invoiceService.getInvoices(payload, { user, company });
            return utils_1.response.success(reply, { message: "Invoices fetched successfuly", data });
        });
    }
    getNextInvoiceNumber(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, company } = request;
            const data = yield this.invoiceService.getNextInvoiceNumber({ user, company });
            return utils_1.response.success(reply, { message: "Invoice number fetched successfuly", data });
        });
    }
    getInvoice(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params, user, company } = request;
            const payload = {
                id: params.id,
            };
            const data = yield this.invoiceService.getInvoice(payload);
            return utils_1.response.success(reply, { message: "Invoice fetched successfuly", data });
        });
    }
    updateInvoice(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params, body, user, company } = request;
            const payload = {
                id: params.id,
                invoice: {
                    title: body.title,
                    notes: body.notes,
                    status: body.status,
                    clientId: body.clientId,
                    paymentTokenId: body.paymentTokenId,
                    dueAt: body.dueAt,
                    number: body.number,
                    issuedAt: body.issuedAt,
                    paymentAddressId: body.paymentAddressId,
                    items: body.items,
                },
            };
            const data = yield this.invoiceService.updateInvoice(payload, { user, company });
            return utils_1.response.success(reply, { message: "Invoice created successfuly", data });
        });
    }
    updateInvoiceStatus(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params, body } = request;
            const payload = {
                id: params.id,
                data: {
                    status: body.status,
                    token: body.token,
                },
            };
            const data = yield this.invoiceService.updateInvoiceStatus(payload);
            return utils_1.response.success(reply, { message: "Invoice status updated successfuly", data });
        });
    }
    completeInvoicePayment(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params, body } = request;
            const payload = {
                id: params.id,
                data: {
                    transactionId: body.transactionId,
                    token: body.token,
                },
            };
            const data = yield this.invoiceService.completeInvoicePayment(payload);
            return utils_1.response.success(reply, { message: "Invoice payment completed successfuly", data });
        });
    }
    getInvoiceShareToken(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params } = request;
            const payload = { id: params.id };
            const data = yield this.invoiceService.getInvoiceShareToken(payload);
            return utils_1.response.success(reply, { message: "Invoice share token fetched successfuly", data });
        });
    }
    sendInvoiceReminder(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params, user, company } = request;
            const payload = { id: params.id };
            const data = yield this.invoiceService.sendInvoiceReminder(payload, { user, company });
            return utils_1.response.success(reply, { message: "Invoice status updated successfuly", data });
        });
    }
};
InvoiceController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [services_1.InvoiceService])
], InvoiceController);
exports.InvoiceController = InvoiceController;
