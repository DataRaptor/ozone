import Container from "typedi";
import { AuthController } from "../controllers";
import { AppInstance } from "../interfaces";

export async function auth(app: AppInstance) {
  const controller = Container.get(AuthController);

  app.post("/signin", controller.signinUser.bind(controller));
  app.post("/signup", controller.signupUser.bind(controller));
}
