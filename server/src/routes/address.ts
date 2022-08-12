import { FastifyInstance } from "fastify"
import Container from "typedi"
import { AddressController } from "../controllers"
import { AppInstance } from "../interfaces"

export async function address(app: AppInstance) {
  const controller = Container.get(AddressController)

  const onRequest = [app.authenticate]

  app.post("/", { onRequest }, controller.addAddress.bind(controller))
  app.get("/", { onRequest }, controller.getAddresss.bind(controller))
  app.get("/:id", { onRequest }, controller.getAddress.bind(controller))
  app.put("/:id", { onRequest }, controller.updateAddress.bind(controller))
  app.delete("/:id", { onRequest }, controller.deleteAddress.bind(controller))
}
