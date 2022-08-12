import Container from "typedi"
import { ClientController } from "../controllers"
import { AppInstance } from "../interfaces"

export async function client(app: AppInstance) {
  const controller = Container.get(ClientController)

  const onRequest = [app.authenticate]

  app.post("/", { onRequest }, controller.addClient.bind(controller))
  app.get("/", { onRequest }, controller.getClients.bind(controller))
  app.get("/:id", { onRequest }, controller.getClient.bind(controller))
  app.put("/:id", { onRequest }, controller.updateClient.bind(controller))
  app.delete("/:id", { onRequest }, controller.deleteClient.bind(controller))
}
