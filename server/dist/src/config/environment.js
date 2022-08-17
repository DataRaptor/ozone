"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
exports.environment = {
    host: process.env.HOST || "0.0.0.0",
    port: Number(process.env.PORT) || 9009,
    appUrl: process.env.APP_URL || "http://localhost:5173/",
    jwtSecret: process.env.JWT_SECRET || "285aab3566db443891e4f9eec8f681a3",
    solana: {
        url: process.env.SOLANA_NETWORK_URL || "https://api.devnet.solana.com",
    },
    mail: {
        mailgun: {
            apiKey: process.env.MAIL_GUN_API_KEY || "",
            domain: process.env.MAIL_GUN_DOMAIN || "email.ozonefinance.co",
            from: process.env.MAIL_GUN_FROM || "notification@email.ozonefinance.co",
        },
    },
};
