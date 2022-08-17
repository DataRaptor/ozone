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
exports.novu = void 0;
const node_1 = require("@novu/node");
const config_1 = require("../config");
const novuInstance = new node_1.Novu(config_1.environment.novu.apiKey);
exports.novu = {
    sendInvoice(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            novuInstance.trigger("send-invoice", {
                to: userId,
                payload: {},
            });
        });
    },
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield novuInstance.subscribers.identify("cl6pyf4wu0017dm9gmoljqrcr", {
        email: "abdulrahmanyusuf125@gmail.com",
    });
    yield exports.novu.sendInvoice("cl6pyf4wu0017dm9gmoljqrcr");
    console.log("donee");
}))();
