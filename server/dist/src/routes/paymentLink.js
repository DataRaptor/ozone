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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentLink = void 0;
const typedi_1 = __importDefault(require("typedi"));
const controllers_1 = require("../controllers");
function paymentLink(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = typedi_1.default.get(controllers_1.PaymentLinkController);
        const onRequest = [app.authUser(), app.authCompany()];
        const onRequestOptional = [app.authUser({ optional: true }), app.authCompany({ optional: true })];
        app.post("/", { onRequest }, controller.createPaymentLink.bind(controller));
        app.get("/", { onRequest }, controller.getPaymentLinks.bind(controller));
        app.get("/:id", { onRequest: onRequestOptional }, controller.getPaymentLink.bind(controller));
        app.get("/:id/share", { onRequest: onRequestOptional }, controller.getPaymentLinkShareToken.bind(controller));
        // app.put("/:id/complete", controller.completePaymentLink.bind(controller));
        app.put("/:id", { onRequest }, controller.updatePaymentLink.bind(controller));
    });
}
exports.paymentLink = paymentLink;
