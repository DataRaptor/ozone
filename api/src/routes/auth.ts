import { FastifyInstance } from "fastify"
import Container from "typedi"
import { AuthController } from "../controllers"

export async function auth(app: FastifyInstance) {
  const controller = Container.get(AuthController)

  app.post("/signin", controller.signinUser.bind(controller))
  app.post("/signup", controller.signupUser.bind(controller))
}
