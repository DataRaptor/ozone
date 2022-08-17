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
exports.AddressService = void 0;
const typedi_1 = require("typedi");
const prisma_1 = require("../database/prisma");
const errors_1 = require("../errors");
const schema_1 = require("../schema");
const Solana_1 = require("../Solana");
const utils_1 = require("../utils");
let AddressService = class AddressService {
    addAddress(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const data = yield schema_1.addressSchema.validateAsync(cleanPayload);
            const address = yield prisma_1.prisma.address.findFirst({
                where: {
                    address: data.address,
                    company: { id: { equals: company.id } },
                },
            });
            if (address) {
                throw new errors_1.ApiError("Address already exists", 409);
            }
            const newAddress = yield prisma_1.prisma.address.create({
                data: {
                    company: { connect: { id: company.id } },
                    address: data.address,
                    label: data.label,
                },
            });
            return newAddress;
        });
    }
    getAddresses(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const addresses = yield prisma_1.prisma.address.findMany({
                where: {
                    company: { id: { equals: company.id } },
                },
            });
            return addresses;
        });
    }
    updateAddress(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const address = yield prisma_1.prisma.address.findUnique({ where: { id: cleanPayload.id }, include: { company: true } });
            if (!address) {
                throw new errors_1.ApiError("Address does not exist", 404);
            }
            if (address.company.id !== company.id) {
                throw new errors_1.ApiError("You do not have permission to perform this action", 403);
            }
            const data = yield schema_1.addressSchema.validateAsync(cleanPayload.address);
            return yield prisma_1.prisma.address.update({ where: { id: cleanPayload.id }, data });
        });
    }
    deleteAddress(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const address = yield prisma_1.prisma.address.findUnique({ where: { id: cleanPayload.id }, include: { company: true } });
            if (!address) {
                throw new errors_1.ApiError("Address does not exist", 404);
            }
            if (address.company.id !== company.id) {
                throw new errors_1.ApiError("You do not have permission to perform this action", 403);
            }
            yield prisma_1.prisma.address.delete({ where: { id: cleanPayload.id } });
        });
    }
    getAddress(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = context;
            const cleanPayload = utils_1.utils.clean(payload);
            const address = yield prisma_1.prisma.address.findUnique({ where: { id: cleanPayload.id }, include: { company: true } });
            if (!address) {
                throw new errors_1.ApiError("Address does not exist", 404);
            }
            if (address.company.id !== company.id) {
                throw new errors_1.ApiError("You do not have permission to view this resoure", 403);
            }
            const balances = yield Solana_1.solana.getBalances(address.address);
            const tokens = yield prisma_1.prisma.token.findMany();
            const data = [];
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                const balance = balances.find((b) => b.mint == token.address);
                if (balance) {
                    const amount = balance.amount / Math.pow(10, token.decimals);
                    data.push(Object.assign(Object.assign({}, token), { amount, isNative: balance.isNative === 0 ? false : true }));
                }
            }
            return Object.assign(Object.assign({}, address), { tokens: data });
        });
    }
};
AddressService = __decorate([
    (0, typedi_1.Service)()
], AddressService);
exports.AddressService = AddressService;
