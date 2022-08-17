"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nacl = void 0;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const bs58_1 = __importDefault(require("bs58"));
exports.nacl = {
    verifyMessage(message, signature, publicKey) {
        return tweetnacl_1.default.sign.detached.verify(new Uint8Array(Buffer.from(message, "utf8")), bs58_1.default.decode(signature), bs58_1.default.decode(publicKey));
    },
};
