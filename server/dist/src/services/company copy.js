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
exports.CompanyService = void 0;
const typedi_1 = require("typedi");
const prisma_1 = require("../database/prisma");
const errors_1 = require("../errors");
const schema_1 = require("../schema");
const utils_1 = require("../utils");
let CompanyService = class CompanyService {
    getCompanies(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const companies = yield prisma_1.prisma.company.findMany({ where: { owner: { id: user.id } } });
            return companies;
        });
    }
    getCompany(payload, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPayload = utils_1.utils.clean(payload);
            const company = yield prisma_1.prisma.company.findUnique({ where: { id: cleanPayload.id } });
            if (!company) {
                throw new errors_1.ApiError("Company does not exist", 404);
            }
            if (company.ownerId !== user.id) {
                throw new errors_1.ApiError("You do not have permission to view this resoure", 403);
            }
            return company;
        });
    }
    updateCompany(payload, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPayload = utils_1.utils.clean(payload);
            const company = yield prisma_1.prisma.company.findUnique({ where: { id: cleanPayload.id } });
            if (!company) {
                throw new errors_1.ApiError("Company does not exist", 404);
            }
            if (company.ownerId !== user.id) {
                throw new errors_1.ApiError("You do not have permission to perform this action", 403);
            }
            const data = yield schema_1.companySchema.validateAsync(cleanPayload.company);
            if (data.email && data.email !== company.email) {
                const company = yield prisma_1.prisma.company.findFirst({ where: { email: data.email } });
                if (company) {
                    throw new errors_1.ApiError("Company email address already exists", 409);
                }
            }
            if (data.phone && data.phone !== company.phone) {
                const company = yield prisma_1.prisma.company.findFirst({ where: { phone: data.phone } });
                if (company) {
                    throw new errors_1.ApiError("Company phone number already exists", 409);
                }
            }
            return yield prisma_1.prisma.company.update({ where: { id: cleanPayload.id }, data: Object.assign(Object.assign({}, cleanPayload.company), data) });
        });
    }
};
CompanyService = __decorate([
    (0, typedi_1.Service)()
], CompanyService);
exports.CompanyService = CompanyService;
