import { FastifyRequest, FastifyReply } from "fastify";
import { response } from "../utils";
import { PaymentService } from "../services";
import { Service } from "typedi";

@Service()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  public async initiatePayment(request: FastifyRequest, reply: FastifyReply) {
    const { body }: { [key: string]: any } = request;
    const payload = {
      amount: body.amount,
      source: body.source,
      tokenId: body.tokenId,
      clientId: body.clientId,
      addressId: body.addressId,
      invoiceId: body.invoiceId,
      paymentLinkId: body.paymentLinkId,
      companyId: body.companyId,
    };

    const data = await this.paymentService.initiatePayment(payload);
    return response.success(reply, { message: "Payment initiated successfuly", data });
  }

  public async completePayment(request: FastifyRequest, reply: FastifyReply) {
    const { params, body }: { [key: string]: any } = request;
    const payload = {
      id: params.id,
      data: {
        transactionId: body.transactionId,
      },
    };

    const data = await this.paymentService.completePayment(payload);
    return response.success(reply, { message: "Payment completed successfuly", data });
  }

  public async getPayments(request: FastifyRequest, reply: FastifyReply) {
    const { query, user, company }: { [key: string]: any } = request;
    const payload = {
      addressId: query.addressId,
      clientId: query.clientId,
    };

    const data = await this.paymentService.getPayments(payload, { user, company });
    return response.success(reply, { message: "Payment completed successfuly", data });
  }
}
