import Container from "typedi";
import { PaymentController } from "../controllers";
import { AppInstance } from "../interfaces";

export async function payment(app: AppInstance) {
  const controller = Container.get(PaymentController);

  const onRequest = [app.authUser(), app.authCompany()];

  app.post("/", controller.initiatePayment.bind(controller));
  app.get("/", { onRequest }, controller.getPayments.bind(controller));

  app.put("/:id/complete", controller.completePayment.bind(controller));
}
