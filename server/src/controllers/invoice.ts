import { FastifyRequest, FastifyReply } from "fastify";
import { response } from "../utils";
import { InvoiceService } from "../services";
import { Service } from "typedi";

@Service()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  public async createInvoice(request: FastifyRequest, reply: FastifyReply) {
    const { body, user, company }: { [key: string]: any } = request;
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
    };

    const data = await this.invoiceService.createInvoice(payload, { user, company });
    return response.success(reply, { message: "Invoice created successfuly", data });
  }

  public async getInvoices(request: FastifyRequest, reply: FastifyReply) {
    const { query, user, company }: { [key: string]: any } = request;
    const payload = { status: query.status, clientId: query.clientId };

    const data = await this.invoiceService.getInvoices(payload, { user, company });
    return response.success(reply, { message: "Invoices fetched successfuly", data });
  }

  public async getNextInvoiceNumber(request: FastifyRequest, reply: FastifyReply) {
    const { user, company }: { [key: string]: any } = request;

    const data = await this.invoiceService.getNextInvoiceNumber({ user, company });
    return response.success(reply, { message: "Invoice number fetched successfuly", data });
  }

  public async getInvoice(request: FastifyRequest, reply: FastifyReply) {
    const { params, user, company }: { [key: string]: any } = request;
    const payload = {
      id: params.id,
    };

    const data = await this.invoiceService.getInvoice(payload);
    return response.success(reply, { message: "Invoice fetched successfuly", data });
  }

  public async updateInvoice(request: FastifyRequest, reply: FastifyReply) {
    const { params, body, user, company }: { [key: string]: any } = request;
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
    };

    const data = await this.invoiceService.updateInvoice(payload, { user, company });
    return response.success(reply, { message: "Invoice created successfuly", data });
  }

  public async updateInvoiceStatus(request: FastifyRequest, reply: FastifyReply) {
    const { params, body }: { [key: string]: any } = request;
    const payload = {
      id: params.id,
      data: {
        status: body.status,
        token: body.token,
      },
    };

    const data = await this.invoiceService.updateInvoiceStatus(payload);
    return response.success(reply, { message: "Invoice status updated successfuly", data });
  }

  public async completeInvoicePayment(request: FastifyRequest, reply: FastifyReply) {
    const { params, body }: { [key: string]: any } = request;
    const payload = {
      id: params.id,
      data: {
        transactionId: body.transactionId,
        token: body.token,
      },
    };

    const data = await this.invoiceService.completeInvoicePayment(payload);
    return response.success(reply, { message: "Invoice payment completed successfuly", data });
  }

  public async getInvoiceShareToken(request: FastifyRequest, reply: FastifyReply) {
    const { params }: { [key: string]: any } = request;
    const payload = { id: params.id };

    const data = await this.invoiceService.getInvoiceShareToken(payload);
    return response.success(reply, { message: "Invoice share token fetched successfuly", data });
  }

  public async sendInvoiceReminder(request: FastifyRequest, reply: FastifyReply) {
    const { params, user, company }: { [key: string]: any } = request;
    const payload = { id: params.id };

    const data = await this.invoiceService.sendInvoiceReminder(payload, { user, company });
    return response.success(reply, { message: "Invoice status updated successfuly", data });
  }
}
