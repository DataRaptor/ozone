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
exports.ClientController = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const typedi_1 = require("typedi");
let ClientController = class ClientController {
    constructor(clientService) {
        this.clientService = clientService;
    }
    addClient(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, user, company } = request;
            const payload = {
                email: body.email,
                name: body.name,
                phone: body.phone,
                taxNumber: body.taxNumber,
                city: body.city,
                line1: body.line1,
                state: body.state,
                country: body.country,
                postalCode: body.postalCode,
            };
            const data = yield this.clientService.addClient(payload, { user, company });
            return utils_1.response.success(reply, { message: "Client added successfuly", data });
        });
    }
    getClients(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, company } = request;
            const data = yield this.clientService.getClients({ user, company });
            return utils_1.response.success(reply, { message: "Clients fetched successfuly", data });
        });
    }
    getClient(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params, user, company } = request;
            const payload = {
                id: params.id,
            };
            const data = yield this.clientService.getClient(payload, { user, company });
            return utils_1.response.success(reply, { message: "Client fetched successfuly", data });
        });
    }
    updateClient(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, params, user, company } = request;
            const payload = {
                id: params.id,
                client: {
                    email: body.email,
                    name: body.name,
                    phone: body.phone,
                    taxNumber: body.taxNumber,
                    city: body.city,
                    line1: body.line1,
                    state: body.state,
                    country: body.country,
                    postalCode: body.postalCode,
                },
            };
            const data = yield this.clientService.updateClient(payload, { user, company });
            return utils_1.response.success(reply, { message: "Client updated successfuly", data });
        });
    }
    deleteClient(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params, user, company } = request;
            const payload = {
                id: params.id,
            };
            const data = yield this.clientService.deleteClient(payload, { user, company });
            return utils_1.response.success(reply, { message: "Client deleted successfuly", data });
        });
    }
};
ClientController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [services_1.ClientService])
], ClientController);
exports.ClientController = ClientController;
