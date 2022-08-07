import Container from "typedi"
import { FastifyInstance } from "fastify"
import { InvoiceController } from "../controllers"

export async function invoice(app: FastifyInstance) {
  const controller = Container.get(InvoiceController)

  // @ts-ignore
  const onRequest = [app.authenticate]

  app.post("/", { onRequest }, controller.createInvoice.bind(controller))
  app.get("/", { onRequest }, controller.getInvoices.bind(controller))
  app.get("/:id", { onRequest }, controller.getInvoice.bind(controller))
  app.put("/:id", { onRequest }, controller.updateInvoice.bind(controller))
}
