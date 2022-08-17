"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const environment_1 = require("./src/config/environment");
const app_1 = require("./src/app");
app_1.app
    .listen({ port: environment_1.environment.port, host: environment_1.environment.host })
    .then(() => app_1.app.log.info(`Server running 🚀`))
    .catch((e) => {
    app_1.app.log.error(e, e.message);
    process.exit();
});
