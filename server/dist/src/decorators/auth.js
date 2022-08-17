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
exports.auth = void 0;
const prisma_1 = require("../database/prisma");
const errors_1 = require("../errors");
const response_1 = require("../utils/response");
exports.auth = {
    user(options = {}) {
        return (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield request.jwtVerify({});
                const user = yield prisma_1.prisma.user.findUnique({ where: { id: data.id } });
                if (!user) {
                    throw new errors_1.ApiError("Authorization token is invalid", 401);
                }
                request.user = user;
            }
            catch (err) {
                if (!options.optional) {
                    response_1.response.error(reply, { message: err.message, status: 401 });
                }
            }
        });
    },
    company(options = {}) {
        return (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!request.user) {
                    throw new errors_1.ApiError("User authentication is required", 401);
                }
                const companyId = yield request.headers["x-company-id"];
                if (!companyId) {
                    throw new errors_1.ApiError("Company ID is missing in request header", 403);
                }
                const company = yield prisma_1.prisma.company.findUnique({ where: { id: companyId } });
                if (!company) {
                    throw new errors_1.ApiError("Company does not exist", 404);
                }
                if (company.ownerId !== request.user.id) {
                    throw new errors_1.ApiError("User does not have access to this company", 403);
                }
                request.company = company;
            }
            catch (err) {
                if (!options.optional) {
                    response_1.response.error(reply, { message: err.message, status: err.status });
                }
            }
        });
    },
};
