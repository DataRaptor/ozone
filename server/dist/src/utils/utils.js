"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
exports.utils = {
    clean(data) {
        if (!data)
            return;
        if (typeof data === "string") {
            if (data.trim() == "")
                return;
            return (0, sanitize_html_1.default)(data);
        }
        else if (typeof data === "number") {
            return Number((0, sanitize_html_1.default)(String(data)));
        }
        else if (typeof data === "boolean") {
            return JSON.parse((0, sanitize_html_1.default)(String(data)));
        }
        else if (Array.isArray(data)) {
            const arr = [];
            for (let i = 0; i < data.length; i++) {
                arr.push(exports.utils.clean(data[i]));
            }
            return arr;
        }
        else if (typeof data === "object") {
            const obj = {};
            for (const k in data) {
                obj[k] = exports.utils.clean(data[k]);
            }
            return obj;
        }
        return data;
    },
};
