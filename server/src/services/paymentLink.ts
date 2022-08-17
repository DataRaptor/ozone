import { Service } from "typedi";
import { app } from "../app";
import { prisma } from "../database/prisma";
import { ApiError } from "../errors";
import { Context, ICreatePaymentLinkPayload, IGetPaymentLinkPayload } from "../interfaces";
import { createPaymentLinkSchema } from "../schema";
import { utils } from "../utils";

@Service()
export class PaymentLinkService {
  public async createPaymentLink(payload: ICreatePaymentLinkPayload, context: Context) {
    const { company } = context;
    const cleanPayload = utils.clean(payload);
    const data: ICreatePaymentLinkPayload = await createPaymentLinkSchema.validateAsync(cleanPayload);

    const token = await prisma.token.findUnique({ where: { id: data.tokenId } });
    if (!token) {
      throw new ApiError("Token is not supported", 404);
    }

    const address = await prisma.address.findUnique({ where: { id: data.addressId } });
    if (!address) {
      throw new ApiError("Address not found", 404);
    }

    const payment = await prisma.paymentLink.create({
      data: {
        title: data.title,
        description: data.description,
        redirectUrl: data.redirectUrl,
        token: { connect: { id: token.id } },
        address: { connect: { id: address.id } },
        company: { connect: { id: company!.id } },
        amount: data.amount * Math.pow(10, token.decimals),
      },
      include: { token: true, company: true, address: true },
    });

    return payment;
  }

  public async getPaymentLink(payload: IGetPaymentLinkPayload) {
    const cleanPayload: IGetPaymentLinkPayload = utils.clean(payload);

    if (cleanPayload.token) {
      const token: { invoiceId: string } = app.jwt.verify(Buffer.from(cleanPayload.token, "hex").toString());

      if (token && token.invoiceId !== cleanPayload.id) {
        throw new ApiError("Invalid Token", 400);
      }
    }

    const paymentLink = await prisma.paymentLink.findUnique({
      where: { id: cleanPayload.id },
      include: { token: true, company: true, address: true },
    });

    if (!paymentLink) {
      throw new ApiError("Payment link not found", 404);
    }

    return paymentLink;
  }

  public async getPaymentLinks(context: Context) {
    const { company } = context;

    const paymentLinks = await prisma.paymentLink.findMany({
      where: { company: { id: company!.id } },
      include: { token: true, company: true, address: true },
    });

    return paymentLinks;
  }

  public async getPaymentLinkShareToken(payload: IGetPaymentLinkPayload) {
    const cleanPayload: IGetPaymentLinkPayload = utils.clean(payload);

    const paymentLink = await prisma.paymentLink.findFirst({ where: { id: cleanPayload.id }, select: { id: true } });
    if (!paymentLink) {
      throw new ApiError("Payment link not found", 404);
    }

    return {
      token: Buffer.from(app.jwt.sign({ paymentId: paymentLink.id })).toString("hex"),
    };
  }
}
