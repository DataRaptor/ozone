import { Keypair } from "@solana/web3.js";
import { Service } from "typedi";
import { prisma } from "../database/prisma";
import { ApiError } from "../errors";
import { Context, ICompletePaymentPayload, IGetPaymentsPayload, IInitiatePaymentPayload } from "../interfaces";
import { completePaymentSchema, paymentSchema } from "../schema";
import { solana } from "../Solana";
import { utils } from "../utils";

@Service()
export class PaymentService {
  public async initiatePayment(payload: IInitiatePaymentPayload) {
    const cleanPayload = utils.clean(payload);
    const data: IInitiatePaymentPayload = await paymentSchema.validateAsync(cleanPayload);

    const token = await prisma.token.findUnique({ where: { id: data.tokenId } });
    if (!token) {
      throw new ApiError("Token is not supported", 404);
    }

    const address = await prisma.address.findUnique({ where: { id: data.addressId } });
    if (!address) {
      throw new ApiError("Address not found", 404);
    }

    const company = await prisma.company.findUnique({ where: { id: data.companyId } });
    if (!company) {
      throw new ApiError("Company not found", 404);
    }

    let client;
    if (data.clientId) {
      client = await prisma.client.findUnique({ where: { id: data.clientId } });
      if (!client) {
        throw new ApiError("Client does not exist", 404);
      }
    }

    let paymentLink;
    if (data.paymentLinkId) {
      paymentLink = await prisma.paymentLink.findUnique({ where: { id: data.paymentLinkId } });
      if (!paymentLink) {
        throw new ApiError("Payment link does not exist", 404);
      }
    }

    let invoice;
    if (data.invoiceId) {
      invoice = await prisma.invoice.findUnique({ where: { id: data.invoiceId } });
      if (!invoice) {
        throw new ApiError("Invoice not found", 404);
      }
    }

    const payment = await prisma.payment.create({
      data: {
        source: data.source,
        token: { connect: { id: token.id } },
        company: { connect: { id: company.id } },
        address: { connect: { id: address.id } },
        reference: new Keypair().publicKey.toBase58(),
        amount: data.amount * Math.pow(10, token.decimals),
        client: client ? { connect: { id: client.id } } : undefined,
        paymentLink: paymentLink ? { connect: { id: paymentLink.id } } : undefined,
        invoice: invoice ? { connect: { id: invoice.id } } : undefined,
      },
      include: { token: true, company: true, address: true, client: true, invoice: true },
    });

    return payment;
  }

  public async completePayment(payload: ICompletePaymentPayload) {
    const cleanPayload = utils.clean(payload);
    const data: ICompletePaymentPayload["data"] = await completePaymentSchema.validateAsync(cleanPayload.data);

    const payment = await prisma.payment.findUnique({ where: { id: payload.id } });
    if (!payment) {
      throw new ApiError("Payment not found", 404);
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        transactionId: data.transactionId,
        status: "COMPLETED",
      },
      include: { token: true, company: true, address: true, client: true, invoice: true },
    });

    return payment;
  }

  public async getPayments(payload: IGetPaymentsPayload, context: Context) {
    const { company } = context;
    const cleanPayload: IGetPaymentsPayload = utils.clean(payload);

    const payments = await prisma.payment.findMany({
      where: {
        address: cleanPayload.addressId ? { id: cleanPayload.addressId } : undefined,
        client: cleanPayload.clientId ? { id: cleanPayload.clientId } : undefined,
        company: { id: company!.id },
      },
      include: { token: true, company: true, address: true, client: true, invoice: true },
    });

    return payments;
  }
}
