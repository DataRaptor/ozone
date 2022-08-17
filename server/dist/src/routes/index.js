"use strict";
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
exports.routes = void 0;
const auth_1 = require("./auth");
const user_1 = require("./user");
const token_1 = require("./token");
const client_1 = require("./client");
const address_1 = require("./address");
const company_1 = require("./company");
const invoice_1 = require("./invoice");
const payment_1 = require("./payment");
const paymentLink_1 = require("./paymentLink");
function routes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.register(auth_1.auth, { prefix: "auth" });
        app.register(user_1.user, { prefix: "users" });
        app.register(client_1.client, { prefix: "clients" });
        app.register(address_1.address, { prefix: "addresses" });
        app.register(token_1.token, { prefix: "tokens" });
        app.register(invoice_1.invoice, { prefix: "invoices" });
        app.register(company_1.company, { prefix: "companies" });
        app.register(payment_1.payment, { prefix: "payments" });
        app.register(paymentLink_1.paymentLink, { prefix: "paymentLinks" });
    });
}
exports.routes = routes;
