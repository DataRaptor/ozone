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
exports.company = void 0;
const typedi_1 = __importDefault(require("typedi"));
const controllers_1 = require("../controllers");
function company(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = typedi_1.default.get(controllers_1.CompanyController);
        const onRequest = [app.authUser()];
        app.post("/", { onRequest }, controller.addCompany.bind(controller));
        app.get("/", { onRequest }, controller.getCompanies.bind(controller));
        app.get("/:id", { onRequest: [...onRequest, app.authCompany()] }, controller.getCompany.bind(controller));
        app.put("/:id", { onRequest: [...onRequest, app.authCompany()] }, controller.updateCompany.bind(controller));
    });
}
exports.company = company;
