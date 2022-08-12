import Container from "typedi"
import { TokenController } from "../controllers"
import { AppInstance } from "../interfaces"

export async function token(app: AppInstance) {
  const controller = Container.get(TokenController)

  const onRequest = [app.authenticate]

  app.get("/", { onRequest }, controller.getTokens.bind(controller))
  app.get("/:id", { onRequest }, controller.getToken.bind(controller))
}
