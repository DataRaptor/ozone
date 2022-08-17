"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const routes_1 = require("../src/routes");
const environment_1 = require("../src/config/environment");
const auth_1 = require("./decorators/auth");
const utils_1 = require("./utils");
exports.app = (0, fastify_1.default)({ logger: true });
exports.app.register(cors_1.default, {});
exports.app.register(jwt_1.default, { secret: environment_1.environment.jwtSecret });
exports.app.decorate("authUser", auth_1.auth.user);
exports.app.decorate("authCompany", auth_1.auth.company);
exports.app.register(routes_1.routes);
exports.app.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    if (error.status === 500) {
        error.message = "An error occured, please try again later";
    }
    utils_1.response.error(reply, { status: error.status, message: error.message });
});
