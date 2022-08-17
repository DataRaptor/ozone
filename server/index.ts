import "reflect-metadata";

import { environment } from "./src/config/environment";
import { app } from "./src/app";

app
  .listen({ port: environment.port, host: environment.host })
  .then(() => app.log.info(`Server running 🚀`))
  .catch((e) => {
    app.log.error(e, e.message);
    process.exit();
  });
