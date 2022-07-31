import Joi from "joi"
import { Service } from "typedi"
import { prisma } from "../database/prisma"
import { IUser } from "../interfaces"
import { ICreateInvoicePayload, IGetInvoicePayload } from "../interfaces/invoice"

@Service()
export class InvoiceService {
  public async createInvoice(payload: ICreateInvoicePayload, user: IUser) {
    const schema = Joi.object({
      title: Joi.string().required(),
      note: Joi.string().optional(),
      status: Joi.string().required(),
      dueAt: Joi.number().required(),
      clientId: Joi.string().required(),
      tokenId: Joi.string().required(),
      items: Joi.array()
        .items({
          description: Joi.string().required(),
          quantity: Joi.number().required(),
          price: Joi.number().required(),
          companyId: Joi.string().required(),
          discount: Joi.number().optional(),
          tax: Joi.number().optional(),
        })
        .optional(),
    })

    const data: ICreateInvoicePayload = await schema.validateAsync(payload)
    const totalAmount = data.items.reduce((a, b) => a + (b.price - (b.discount || 0)), 0)

    const invoice = await prisma.invoice.create({
      data: {
        title: data.title,
        status: data.status,
        amount: totalAmount,
        dueAt: new Date(data.dueAt),
        note: data.note,
        paymentAddress: { connect: { id: data.paymentAddressId } },
        company: { connect: { ownerId: user.id } },
        token: { connect: { id: data.tokenId } },
        client: { connect: { id: data.clientId } },
        items: { create: data.items },
      },
    })

    return invoice
  }

  public async getInvoices(user: IUser) {
    const invoices = await prisma.invoice.findMany({
      where: { company: { ownerId: { equals: user.id } } },
    })

    return invoices
  }

  public async getInvoice(payload: IGetInvoicePayload, user: IUser) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: payload.id },
      include: { items: true, client: true, token: true, company: true, paymentAddress: true },
    })
    if (!invoice) {
      throw new Error("Invoice does not exist")
    }
    if (invoice.company.ownerId !== user.id) {
      throw new Error("You do not have permission to view this resoure")
    }

    return invoice
  }
}
