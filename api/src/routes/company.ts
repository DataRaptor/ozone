import Container from "typedi"
import { CompanyController } from "../controllers"
import { AppInstance } from "../interfaces"

export async function company(app: AppInstance) {
  const controller = Container.get(CompanyController)

  const onRequest = [app.authenticate]

  app.get("/", { onRequest }, controller.getCompanies.bind(controller))
  app.get("/:id", { onRequest }, controller.getCompany.bind(controller))
  app.put("/:id", { onRequest }, controller.updateCompany.bind(controller))
}
