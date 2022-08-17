import { Service } from "typedi";
import { app } from "../app";
import { environment } from "../config";
import { prisma } from "../database/prisma";
import { ApiError } from "../errors";
import { Context, ICompleteInvoicePaymentPayload, IUpdateInvoiceStatusPayload } from "../interfaces";
import { ICreateInvoicePayload, IGetInvoicePayload, IGetInvoicesPayload, IUpdateInvoicePayload } from "../interfaces";
import { completeInvoicePaymentSchema, invoiceSchema, updateInvoiceStatusSchema } from "../schema";
import { mail, tally, utils } from "../utils";

@Service()
export class InvoiceService {
  public async createInvoice(payload: ICreateInvoicePayload, context: Context) {
    const { company } = context;
    const cleanPayload: ICreateInvoicePayload = utils.clean(payload);
    const data: ICreateInvoicePayload = await invoiceSchema.validateAsync(cleanPayload);

    const token = await prisma.token.findUnique({ where: { id: data.paymentTokenId } });
    if (!token) {
      throw new ApiError("Token is not supported", 404);
    }

    const client = await prisma.client.findUnique({ where: { id: data.clientId } });
    if (!client) {
      throw new ApiError("Client does not exist", 404);
    }

    const address = await prisma.address.findUnique({ where: { id: data.paymentAddressId } });
    if (!address) {
      throw new ApiError("Address does not exist", 404);
    }

    const sumItems = [],
      createItems = [];

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];

      if (item.mode === "create") {
        createItems.push({
          description: item.description,
          quantity: item.quantity,
          price: item.price * Math.pow(10, token.decimals),
          discount: item.discount,
          tax: item.tax,
          companyId: item.companyId,
        });

        sumItems.push({ ...item, ...tally.getItemAmounts(item) });
      }
    }

    const amounts = tally.sumTotalAmounts(sumItems);
    const invoice = await prisma.invoice.create({
      data: {
        notes: data.notes,
        title: data.title,
        number: data.number,
        dueAt: new Date(data.dueAt),
        items: { create: createItems },
        issuedAt: new Date(data.issuedAt),
        client: { connect: { id: data.clientId } },
        company: { connect: { id: company!.id } },
        status: data.status,
        paymentToken: { connect: { id: data.paymentTokenId } },
        paymentAddress: { connect: { id: data.paymentAddressId } },
        netAmount: amounts.netAmount * Math.pow(10, token.decimals),
      },
    });

    if (data.status === "PENDING") {
      const link = new URL(`/invoices/${invoice.id}`, environment.appUrl);
      link.searchParams.set("bar", "0");
      link.searchParams.set("token", Buffer.from(app.jwt.sign({ invoiceId: invoice.id })).toString("hex"));

      const mailData = {
        template: "sendInvoice",
        to: client.email!,
        payload: {
          client: client.name,
          company: company!.name,
          link: link.toString(),
        },
      };

      await mail.send(mailData);
    }

    return invoice;
  }

  public async getInvoices(payload: IGetInvoicesPayload, context: Context) {
    const { company } = context;
    const include = { client: true, paymentToken: true };
    let invoices;
    if (!payload.status) {
      invoices = await prisma.invoice.findMany({
        where: {
          company: { id: { equals: company!.id } },
          status: { not: { equals: "DRAFT" } },
        },
        include,
      });
    } else if (payload.clientId) {
      invoices = await prisma.invoice.findMany({
        where: {
          company: { id: { equals: company!.id } },
          client: { id: { equals: payload.clientId } },
        },
        include,
      });
    } else {
      invoices = await prisma.invoice.findMany({
        where: {
          status: payload.status,
          company: { id: { equals: company!.id } },
        },
        include,
      });
    }

    return invoices;
  }

  public async getInvoice(payload: IGetInvoicePayload) {
    const cleanPayload: IGetInvoicePayload = utils.clean(payload);
    const invoice = await prisma.invoice.findUnique({
      where: { id: cleanPayload.id },
      include: {
        items: true,
        client: true,
        company: true,
        paymentToken: true,
        paymentAddress: true,
      },
    });

    if (!invoice) {
      throw new ApiError("Invoice does not exist", 404);
    }

    return invoice;
  }

  public async getNextInvoiceNumber(context: Context) {
    const { company } = context;
    const count = await prisma.invoice.count({ where: { company: { id: company!.id } } });

    const str = "00000" + (count + 1);
    return { number: `INV-${str.substring(str.length - 5)}` };
  }

  public async updateInvoice(payload: IUpdateInvoicePayload, context: Context) {
    const { company } = context;
    const cleanPayload: IUpdateInvoicePayload = utils.clean(payload);
    const data: IUpdateInvoicePayload["invoice"] = await invoiceSchema.validateAsync(cleanPayload.invoice);

    const invoice = await prisma.invoice.findFirst({
      where: { id: cleanPayload.id },
      select: { id: true, status: true },
    });
    if (!invoice) {
      throw new ApiError("Invoice not found", 404);
    }

    if (invoice.status !== "DRAFT" && data.status === "DRAFT") {
      throw new ApiError(`A sent incoice cannot be made draft`, 400);
    }

    if (invoice.status === "APPROVED" || invoice.status === "REJECTED" || invoice.status === "PAID") {
      throw new ApiError(`You cannot update an already ${invoice.status.toLowerCase()} incoice`, 400);
    }

    const token = await prisma.token.findUnique({ where: { id: data.paymentTokenId } });
    if (!token) {
      throw new ApiError("Token is not supported", 404);
    }

    const client = await prisma.client.findUnique({ where: { id: data.clientId } });
    if (!client) {
      throw new ApiError("Client does not exist", 404);
    }

    const address = await prisma.address.findUnique({ where: { id: data.paymentAddressId } });
    if (!address) {
      throw new ApiError("Address does not exist", 404);
    }

    const sumItems = [],
      createItems = [],
      deleteItems = [],
      updateItems = [];

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];

      if (item.mode === "create") {
        createItems.push({
          tax: item.tax,
          price: item.price * Math.pow(10, token.decimals),
          quantity: item.quantity,
          discount: item.discount,
          companyId: item.companyId,
          description: item.description,
        });

        sumItems.push({ ...item, ...tally.getItemAmounts(item) });
      } else if (item.mode === "update") {
        updateItems.push({
          where: { id: item.id },
          data: {
            tax: item.tax,
            price: item.price * Math.pow(10, token.decimals),
            quantity: item.quantity,
            discount: item.discount,
            companyId: item.companyId,
            description: item.description,
          },
        });

        sumItems.push({ ...item, ...tally.getItemAmounts(item) });
      } else {
        deleteItems.push({ id: item.id });
      }
    }

    const amounts = tally.sumTotalAmounts(sumItems);
    const updateData = {
      notes: data.notes,
      title: data.title,
      number: data.number,
      dueAt: new Date(data.dueAt),
      issuedAt: new Date(data.issuedAt),
      client: { connect: { id: data.clientId } },
      company: { connect: { id: company!.id } },
      status: data.status == null ? undefined : data.status,
      paymentToken: { connect: { id: data.paymentTokenId } },
      paymentAddress: { connect: { id: data.paymentAddressId } },
      netAmount: amounts.netAmount * Math.pow(10, token.decimals),
      items: { create: createItems, update: updateItems, delete: deleteItems },
    };

    const update = await prisma.invoice.update({
      where: { id: invoice.id },
      data: updateData,
      include: { items: true, client: true, company: true, paymentToken: true, paymentAddress: true },
    });

    if (invoice.status === "DRAFT" && data.status === "PENDING") {
      const link = new URL(`/invoices/${invoice.id}`, environment.appUrl);
      link.searchParams.set("bar", "0");
      link.searchParams.set("token", Buffer.from(app.jwt.sign({ invoiceId: invoice.id })).toString("hex"));

      const mailData = {
        template: "sendInvoice",
        to: client.email!,
        payload: {
          client: client.name,
          company: company!.name,
          link: link.toString(),
        },
      };

      await mail.send(mailData);
    }

    return update;
  }

  public async updateInvoiceStatus(payload: IUpdateInvoiceStatusPayload) {
    const cleanPayload: IUpdateInvoiceStatusPayload = utils.clean(payload);
    const data: IUpdateInvoiceStatusPayload["data"] = await updateInvoiceStatusSchema.validateAsync(cleanPayload.data);

    const token: { invoiceId: string } = app.jwt.verify(Buffer.from(data.token, "hex").toString());

    if (token && token.invoiceId !== payload.id) {
      throw new ApiError("Invalid Token", 404);
    }

    const invoice = await prisma.invoice.findFirst({
      where: { id: cleanPayload.id },
      select: { id: true, status: true },
    });
    if (!invoice) {
      throw new ApiError("Invoice not found", 404);
    }

    if (invoice.status === "DRAFT") {
      throw new ApiError("Invoice is still is draft", 409);
    }
    if (invoice.status === "APPROVED") {
      throw new ApiError("Invoice has already been approved", 409);
    }
    if (invoice.status === "REJECTED") {
      throw new ApiError("Invoice has already been rejected", 409);
    }
    if (invoice.status === "PAID") {
      throw new ApiError("Invoice has already been paid", 409);
    }

    return await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: data.status },
      include: { items: true, client: true, company: true, paymentToken: true, paymentAddress: true },
    });
  }

  public async completeInvoicePayment(payload: ICompleteInvoicePaymentPayload) {
    const cleanPayload: ICompleteInvoicePaymentPayload = utils.clean(payload);
    const data: ICompleteInvoicePaymentPayload["data"] = await completeInvoicePaymentSchema.validateAsync(
      cleanPayload.data
    );

    const token: { invoiceId: string } = app.jwt.verify(Buffer.from(data.token, "hex").toString());

    if (token && token.invoiceId !== payload.id) {
      throw new ApiError("Invalid Token", 404);
    }

    const invoice = await prisma.invoice.findFirst({
      where: { id: cleanPayload.id },
      select: { id: true, status: true },
    });
    if (!invoice) {
      throw new ApiError("Invoice not found", 404);
    }

    if (invoice.status === "DRAFT") {
      throw new ApiError("Invoice is still is draft", 409);
    }
    if (invoice.status === "PENDING") {
      throw new ApiError("Invoice has not yet been approved", 409);
    }
    if (invoice.status === "REJECTED") {
      throw new ApiError("Invoice has already been rejected", 409);
    }
    if (invoice.status === "PAID") {
      throw new ApiError("Invoice has already been paid", 409);
    }

    return await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: "PAID",
        payment: {
          update: {
            transactionId: data.transactionId,
            status: "COMPLETED",
          },
        },
      },
      include: {
        items: true,
        client: true,
        company: true,
        paymentToken: true,
        paymentAddress: true,
      },
    });
  }

  public async getInvoiceShareToken(payload: IGetInvoicePayload) {
    const cleanPayload: IGetInvoicePayload = utils.clean(payload);

    const invoice = await prisma.invoice.findFirst({ where: { id: cleanPayload.id }, select: { id: true } });
    if (!invoice) {
      throw new ApiError("Invoice not found", 404);
    }

    return {
      token: Buffer.from(app.jwt.sign({ invoiceId: invoice.id })).toString("hex"),
    };
  }

  public async sendInvoiceReminder(payload: IGetInvoicePayload, context: Context) {
    const { company } = context;
    const cleanPayload: IGetInvoicePayload = utils.clean(payload);

    const invoice = await prisma.invoice.findUnique({
      where: { id: cleanPayload.id },
      include: { client: true },
    });

    if (!invoice) {
      throw new ApiError("Invoice not found", 404);
    }

    if (invoice.companyId !== company!.id) {
      throw new ApiError("You do not have permission to access this resource", 404);
    }

    const link = new URL(`/invoices/${invoice.id}`, environment.appUrl);
    link.searchParams.set("bar", "0");
    link.searchParams.set("token", Buffer.from(app.jwt.sign({ invoiceId: invoice.id })).toString("hex"));

    const mailData = {
      template: "invoiceReminder",
      to: invoice.client.email!,
      payload: {
        client: invoice.client.name,
        company: company!.name,
        link: link.toString(),
      },
    };

    await mail.send(mailData);
  }
}
