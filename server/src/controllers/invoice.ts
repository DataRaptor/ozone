import { FastifyRequest, FastifyReply } from "fastify"
import { response } from "../utils"
import { InvoiceService } from "../services"
import { Service } from "typedi"

@Service()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  public async createInvoice(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request
    const payload = {
      title: body.title,
      notes: body.notes,
      status: body.status,
      clientId: body.clientId,
      paymentTokenId: body.paymentTokenId,
      dueAt: body.dueAt,
      number: body.number,
      issuedAt: body.issuedAt,
      paymentAddressId: body.paymentAddressId,
      items: body.items,
    }

    const data = await this.invoiceService.createInvoice(payload, user)
    return response.success(reply, { message: "Invoice created successfuly", data })
  }

  public async getInvoices(request: FastifyRequest, reply: FastifyReply) {
    const { query, user }: { [key: string]: any } = request
    const payload = { status: query.status }

    const data = await this.invoiceService.getInvoices(payload, user)
    return response.success(reply, { message: "Invoices fetched successfuly", data })
  }

  public async getInvoice(request: FastifyRequest, reply: FastifyReply) {
    const { params, user }: { [key: string]: any } = request
    const payload = {
      id: params.id,
    }

    const data = await this.invoiceService.getInvoice(payload, user)
    return response.success(reply, { message: "Invoice fetched successfuly", data })
  }

  public async updateInvoice(request: FastifyRequest, reply: FastifyReply) {
    const { params, body, user }: { [key: string]: any } = request
    const payload = {
      id: params.id,
      invoice: {
        title: body.title,
        notes: body.notes,
        status: body.status,
        clientId: body.clientId,
        paymentTokenId: body.paymentTokenId,
        dueAt: body.dueAt,
        number: body.number,
        issuedAt: body.issuedAt,
        paymentAddressId: body.paymentAddressId,
        items: body.items,
      },
    }

    const data = await this.invoiceService.updateInvoice(payload, user)
    return response.success(reply, { message: "Invoice created successfuly", data })
  }
}
