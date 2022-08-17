import { FastifyRequest, FastifyReply } from "fastify";
import { response } from "../utils";
import { PaymentLinkService } from "../services";
import { Service } from "typedi";

@Service()
export class PaymentLinkController {
  constructor(private readonly paymentService: PaymentLinkService) {}

  public async createPaymentLink(request: FastifyRequest, reply: FastifyReply) {
    const { body, user, company }: { [key: string]: any } = request;
    const payload = {
      title: body.title,
      amount: body.amount,
      tokenId: body.tokenId,
      addressId: body.addressId,
      description: body.description,
      redirectUrl: body.redirectUrl,
    };

    const data = await this.paymentService.createPaymentLink(payload, { user, company });
    return response.success(reply, { message: "Payment link created successfuly", data });
  }

  public async getPaymentLink(request: FastifyRequest, reply: FastifyReply) {
    const { query, params }: { [key: string]: any } = request;
    const payload = {
      id: params.id,
      token: query.token,
    };

    const data = await this.paymentService.getPaymentLink(payload);
    return response.success(reply, { message: "Payment link fetched successfuly", data });
  }

  public async getPaymentLinks(request: FastifyRequest, reply: FastifyReply) {
    const { user, company }: { [key: string]: any } = request;

    const data = await this.paymentService.getPaymentLinks({ user, company });
    return response.success(reply, { message: "Payment fetched successfuly", data });
  }

  public async getPaymentLinkShareToken(request: FastifyRequest, reply: FastifyReply) {
    const { params }: { [key: string]: any } = request;
    const payload = {
      id: params.id,
    };

    const data = await this.paymentService.getPaymentLinkShareToken(payload);
    return response.success(reply, { message: "Payment fetched successfuly", data });
  }
}
