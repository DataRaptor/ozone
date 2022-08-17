import Container from "typedi";
import { CompanyController } from "../controllers";
import { AppInstance } from "../interfaces";

export async function company(app: AppInstance) {
  const controller = Container.get(CompanyController);

  const onRequest = [app.authUser()];

  app.post("/", { onRequest }, controller.addCompany.bind(controller));

  app.get("/", { onRequest }, controller.getCompanies.bind(controller));
  app.get("/:id", { onRequest: [...onRequest, app.authCompany()] }, controller.getCompany.bind(controller));

  app.put("/:id", { onRequest: [...onRequest, app.authCompany()] }, controller.updateCompany.bind(controller));
}
