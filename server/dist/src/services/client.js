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
exports.ClientService = void 0;
const typedi_1 = require("typedi");
const prisma_1 = require("../database/prisma");
const errors_1 = require("../errors");
const schema_1 = require("../schema");
const utils_1 = require("../utils");
let ClientService = class ClientService {
    addClient(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const data = yield schema_1.clientSchema.validateAsync(cleanPayload);
            if (data.email) {
                const client = yield prisma_1.prisma.client.findFirst({ where: { email: data.email } });
                if (client) {
                    throw new errors_1.ApiError("Client email address already exists", 409);
                }
            }
            if (data.phone) {
                const client = yield prisma_1.prisma.client.findFirst({ where: { phone: data.phone } });
                if (client) {
                    throw new errors_1.ApiError("Client phone number already exists", 409);
                }
            }
            const client = yield prisma_1.prisma.client.create({
                data: {
                    company: { connect: { id: company.id } },
                    email: data.email,
                    name: data.name,
                    phone: data.phone,
                    taxNumber: data.taxNumber,
                    line1: data.line1,
                    city: data.city,
                    state: data.state,
                    postalCode: data.postalCode,
                    country: data.country,
                },
            });
            return client;
        });
    }
    getClients(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const clients = yield prisma_1.prisma.client.findMany({ where: { company: { id: { equals: company.id } } } });
            return clients;
        });
    }
    getClient(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const client = yield prisma_1.prisma.client.findUnique({ where: { id: cleanPayload.id }, include: { company: true } });
            if (!client) {
                throw new errors_1.ApiError("Client does not exist", 404);
            }
            if (client.company.id !== company.id) {
                throw new errors_1.ApiError("You do not have permission to view this resoure", 403);
            }
            return client;
        });
    }
    updateClient(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const client = yield prisma_1.prisma.client.findUnique({
                where: { id: cleanPayload.id },
                include: { company: true },
            });
            if (!client) {
                throw new errors_1.ApiError("Client does not exist", 404);
            }
            if (client.company.id !== company.id) {
                throw new errors_1.ApiError("You do not have permission to perform this action", 403);
            }
            const data = yield schema_1.clientSchema.validateAsync(cleanPayload.client);
            if (data.email && data.email !== client.email) {
                const client = yield prisma_1.prisma.client.findFirst({
                    where: { email: data.email, company: { id: { equals: company.id } } },
                });
                if (client) {
                    throw new errors_1.ApiError("Client email address already exists", 409);
                }
            }
            if (data.phone && data.phone !== client.phone) {
                const client = yield prisma_1.prisma.client.findFirst({
                    where: { phone: data.phone, company: { id: { equals: company.id } } },
                });
                if (client) {
                    throw new errors_1.ApiError("Client phone number already exists", 409);
                }
            }
            return yield prisma_1.prisma.client.update({ where: { id: cleanPayload.id }, data: Object.assign(Object.assign({}, cleanPayload.client), data) });
        });
    }
    deleteClient(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const client = yield prisma_1.prisma.client.findUnique({ where: { id: cleanPayload.id }, include: { company: true } });
            if (!client) {
                throw new errors_1.ApiError("Client does not exist", 404);
            }
            if (client.company.id !== company.id) {
                throw new errors_1.ApiError("You do not have permission to perform this action", 403);
            }
            yield prisma_1.prisma.client.delete({ where: { id: cleanPayload.id } });
        });
    }
};
ClientService = __decorate([
    (0, typedi_1.Service)()
], ClientService);
exports.ClientService = ClientService;
