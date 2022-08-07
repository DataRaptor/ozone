import { FastifyInstance } from "fastify"
import Container from "typedi"
import { UserController } from "../controllers"

export async function user(app: FastifyInstance) {
  const controller = Container.get(UserController)

  // @ts-ignore
  const onRequest = [app.authenticate]

  app.get("/me", { onRequest }, controller.getCurrentUser.bind(controller))
}
