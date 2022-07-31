import { FastifyInstance } from "fastify"
import Container from "typedi"
import { AddressController } from "../controllers"

export async function address(app: FastifyInstance) {
  const controller = Container.get(AddressController)

  // @ts-ignore
  const onRequest = [app.authenticate]

  app.post("/", { onRequest }, controller.addAddress.bind(controller))
  app.get("/", { onRequest }, controller.getAddresss.bind(controller))
  app.get("/:id", { onRequest }, controller.getAddress.bind(controller))
  app.put("/:id", { onRequest }, controller.updateAddress.bind(controller))
  app.delete("/:id", { onRequest }, controller.deleteAddress.bind(controller))
}
