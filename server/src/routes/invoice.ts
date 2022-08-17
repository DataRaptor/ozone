import Container from "typedi";
import { InvoiceController } from "../controllers";
import { AppInstance } from "../interfaces";

export async function invoice(app: AppInstance) {
  const controller = Container.get(InvoiceController);

  const onRequest = [app.authUser(), app.authCompany()];
  const onRequestOptional = [app.authUser({ optional: true }), app.authCompany({ optional: true })];

  app.post("/", { onRequest }, controller.createInvoice.bind(controller));
  app.post("/:id/reminder", { onRequest }, controller.sendInvoiceReminder.bind(controller));

  app.get("/", { onRequest }, controller.getInvoices.bind(controller));
  app.get("/nextNumber", { onRequest }, controller.getNextInvoiceNumber.bind(controller));
  app.get("/:id/share", { onRequest: onRequestOptional }, controller.getInvoiceShareToken.bind(controller));

  app.get("/:id", { onRequest: onRequestOptional }, controller.getInvoice.bind(controller));
  app.put("/:id", { onRequest: onRequestOptional }, controller.updateInvoice.bind(controller));
  app.put("/:id/status", controller.updateInvoiceStatus.bind(controller));
  app.put("/:id/complete", controller.completeInvoicePayment.bind(controller));
}
