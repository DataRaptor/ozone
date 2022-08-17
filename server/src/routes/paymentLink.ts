import Container from "typedi";
import { PaymentLinkController } from "../controllers";
import { AppInstance } from "../interfaces";

export async function paymentLink(app: AppInstance) {
  const controller = Container.get(PaymentLinkController);

  const onRequest = [app.authUser(), app.authCompany()];
  const onRequestOptional = [app.authUser({ optional: true }), app.authCompany({ optional: true })];

  app.post("/", { onRequest }, controller.createPaymentLink.bind(controller));
  app.get("/", { onRequest }, controller.getPaymentLinks.bind(controller));
  app.get("/:id", { onRequest: onRequestOptional }, controller.getPaymentLink.bind(controller));
  app.get("/:id/share", { onRequest: onRequestOptional }, controller.getPaymentLinkShareToken.bind(controller));
  // app.put("/:id/complete", controller.completePaymentLink.bind(controller));
}
