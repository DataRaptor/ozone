import Container from "typedi"
import { InvoiceController } from "../controllers"
import { AppInstance } from "../interfaces"

export async function invoice(app: AppInstance) {
  const controller = Container.get(InvoiceController)

  const onRequest = [app.authenticate]

  app.post("/", { onRequest }, controller.createInvoice.bind(controller))
  app.get("/", { onRequest }, controller.getInvoices.bind(controller))
  app.get("/:id", { onRequest }, controller.getInvoice.bind(controller))
  app.put("/:id", { onRequest }, controller.updateInvoice.bind(controller))
}
