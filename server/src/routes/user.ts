import Container from "typedi";
import { UserController } from "../controllers";
import { AppInstance } from "../interfaces";

export async function user(app: AppInstance) {
  const controller = Container.get(UserController);

  const onRequest = [app.authUser()];

  app.get("/me", { onRequest }, controller.getCurrentUser.bind(controller));

  app.put("/me", { onRequest }, controller.updateUser.bind(controller));
  app.put("/me/password", { onRequest }, controller.updateUserPassword.bind(controller));
}
