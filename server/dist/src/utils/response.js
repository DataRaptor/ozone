"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
class Response {
    success(reply, { status, message, data }) {
        return reply
            .code(status || 200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({ success: true, message, data });
    }
    error(reply, { status, message }) {
        return reply
            .code(status || 500)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({ success: false, message });
    }
}
exports.response = new Response();
