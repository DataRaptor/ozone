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
exports.PaymentController = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const typedi_1 = require("typedi");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    initiatePayment(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = request;
            const payload = {
                amount: body.amount,
                source: body.source,
                tokenId: body.tokenId,
                clientId: body.clientId,
                addressId: body.addressId,
                invoiceId: body.invoiceId,
                paymentLinkId: body.paymentLinkId,
                companyId: body.companyId,
            };
            const data = yield this.paymentService.initiatePayment(payload);
            return utils_1.response.success(reply, { message: "Payment initiated successfuly", data });
        });
    }
    completePayment(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params, body } = request;
            const payload = {
                id: params.id,
                data: {
                    transactionId: body.transactionId,
                },
            };
            const data = yield this.paymentService.completePayment(payload);
            return utils_1.response.success(reply, { message: "Payment completed successfuly", data });
        });
    }
    getPayments(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query, user, company } = request;
            const payload = {
                addressId: query.addressId,
                clientId: query.clientId,
            };
            const data = yield this.paymentService.getPayments(payload, { user, company });
            return utils_1.response.success(reply, { message: "Payment completed successfuly", data });
        });
    }
};
PaymentController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [services_1.PaymentService])
], PaymentController);
exports.PaymentController = PaymentController;
