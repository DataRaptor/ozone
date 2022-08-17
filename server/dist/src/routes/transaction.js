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
exports.transaction = void 0;
const typedi_1 = __importDefault(require("typedi"));
const controllers_1 = require("../controllers");
function transaction(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = typedi_1.default.get(controllers_1.TransactionController);
        const onRequest = [app.authUser(), app.authCompany()];
        app.post("/", controller.initiateTransaction.bind(controller));
        app.put("/:id/complete", controller.completeTransaction.bind(controller));
    });
}
exports.transaction = transaction;
