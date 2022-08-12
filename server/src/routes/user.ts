import Container from "typedi"
import { UserController } from "../controllers"
import { AppInstance } from "../interfaces"

export async function user(app: AppInstance) {
  const controller = Container.get(UserController)

  const onRequest = [app.authenticate]

  app.get("/me", { onRequest }, controller.getCurrentUser.bind(controller))
}
