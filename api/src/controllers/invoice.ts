import { FastifyRequest, FastifyReply } from "fastify"
import { response } from "../utils/response"
import { InvoiceService } from "../services"
import { Service } from "typedi"

@Service()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  public async createInvoice(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { body, user }: { [key: string]: any } = request
      const payload = {
        title: body.title,
        note: body.note,
        status: body.status,
        clientId: body.clientId,
        tokenId: body.tokenId,
        dueAt: body.dueAt,
        paymentAddressId: body.paymentAddressId,
        items: body.items,
      }

      const data = await this.invoiceService.createInvoice(payload, user)
      return response.success(reply, { message: "Invoice created successfuly", data })
    } catch (e) {
      request.log.error(e)
      return response.error(reply, { message: "An error occured" })
    }
  }

  public async getInvoices(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { user }: { [key: string]: any } = request

      const data = await this.invoiceService.getInvoices(user)
      return response.success(reply, { message: "Invoices fetched successfuly", data })
    } catch (e) {
      request.log.error(e)
      return response.error(reply, { message: "An error occured" })
    }
  }

  public async getInvoice(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { params, user }: { [key: string]: any } = request
      const payload = {
        id: params.id,
      }

      const data = await this.invoiceService.getInvoice(payload, user)
      return response.success(reply, { message: "Invoice fetched successfuly", data })
    } catch (e) {
      request.log.error(e)
      return response.error(reply, { message: "An error occured" })
    }
  }
}
