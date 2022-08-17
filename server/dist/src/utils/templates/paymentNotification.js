"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.content = exports.subject = void 0;
exports.subject = "Invoice notification";
function content(data) {
    return `
    <p>Hello${data.client ? " " + data.client : ""}</p>
    <p>${data.company} just sent you an invoice through Ozone Finance.</p>
    <p>To view the invoice, please click the link: <a href="${data.link}">View invoice</a></p>
    `;
}
exports.content = content;
