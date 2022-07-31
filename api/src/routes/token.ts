import { FastifyInstance } from "fastify"
import Container from "typedi"
import { TokenController } from "../controllers"

export async function token(app: FastifyInstance) {
  const controller = Container.get(TokenController)

  // @ts-ignore
  const onRequest = [app.authenticate]

  app.get("/", { onRequest }, controller.getTokens.bind(controller))
  app.get("/:id", { onRequest }, controller.getToken.bind(controller))
}
