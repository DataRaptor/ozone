import { FastifyInstance } from "fastify"
import Container from "typedi"
import { CompanyController } from "../controllers"

export async function company(app: FastifyInstance) {
  const controller = Container.get(CompanyController)

  // @ts-ignore
  const onRequest = [app.authenticate]

  app.get("/", { onRequest }, controller.getCompanies.bind(controller))
  app.get("/:id", { onRequest }, controller.getCompany.bind(controller))
  app.put("/:id", { onRequest }, controller.updateCompany.bind(controller))
}
