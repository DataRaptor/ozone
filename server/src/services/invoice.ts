import Joi from "joi"
import { Service } from "typedi"
import { prisma } from "../database/prisma"
import { ApiError } from "../errors"
import { IUser } from "../interfaces"
import { ICreateInvoicePayload, IGetInvoicePayload, IGetInvoicesPayload, IUpdateInvoicePayload } from "../interfaces"
import { invoiceSchema } from "../schema"
import { tally, utils } from "../utils"

@Service()
export class InvoiceService {
  public async createInvoice(payload: ICreateInvoicePayload, user: IUser) {
    const cleanPayload: ICreateInvoicePayload = utils.clean(payload)
    const data: ICreateInvoicePayload = await invoiceSchema.validateAsync(cleanPayload)

    const token = await prisma.token.findUnique({ where: { id: data.paymentTokenId } })
    if (!token) {
      throw new ApiError("Slected token is not supported", 404)
    }

    const client = await prisma.client.findUnique({ where: { id: data.clientId } })
    if (!client) {
      throw new ApiError("Slected client does not exist", 404)
    }

    const address = await prisma.address.findUnique({ where: { id: data.paymentAddressId } })
    if (!address) {
      throw new ApiError("Slected address does not exist", 404)
    }

    const sumItems = [],
      createItems = []

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i]

      if (item.mode === "create") {
        createItems.push({
          description: item.description,
          quantity: item.quantity,
          price: item.price * Math.pow(10, token.decimals),
          discount: item.discount,
          tax: item.tax,
          companyId: item.companyId,
        })

        sumItems.push({ ...item, ...tally.getItemAmounts(item) })
      }
    }

    const amounts = tally.sumTotalAmounts(sumItems)
    const invoice = await prisma.invoice.create({
      data: {
        notes: data.notes,
        title: data.title,
        number: data.number,
        dueAt: new Date(data.dueAt),
        items: { create: createItems },
        issuedAt: new Date(data.issuedAt),
        client: { connect: { id: data.clientId } },
        company: { connect: { ownerId: user.id } },
        status: data.status == null ? undefined : data.status,
        paymentToken: { connect: { id: data.paymentTokenId } },
        paymentAddress: { connect: { id: data.paymentAddressId } },
        netAmount: amounts.netAmount * Math.pow(10, token.decimals),
      },
    })

    return invoice
  }

  public async getInvoices(payload: IGetInvoicesPayload, user: IUser) {
    console.log(payload)
    const include = { client: true, paymentToken: true }
    let invoices
    if (!payload.status) {
      invoices = await prisma.invoice.findMany({
        where: { company: { ownerId: { equals: user.id } }, status: { not: { equals: "DRAFT" } } },
        include,
      })
    } else {
      invoices = await prisma.invoice.findMany({
        where: { status: payload.status, company: { ownerId: { equals: user.id } } },
        include,
      })
    }

    return invoices
  }

  public async getInvoice(payload: IGetInvoicePayload, user: IUser) {
    const cleanPayload: IGetInvoicePayload = utils.clean(payload)
    const invoice = await prisma.invoice.findUnique({
      where: { id: cleanPayload.id },
      include: {
        items: true,
        client: true,
        company: true,
        paymentToken: true,
        paymentAddress: true,
      },
    })

    if (!invoice) {
      throw new ApiError("Invoice does not exist", 404)
    }

    if (invoice.company.ownerId !== user.id) {
      throw new ApiError("You do not have permission to view this resoure", 403)
    }

    return invoice
  }

  public async updateInvoice(payload: IUpdateInvoicePayload, user: IUser) {
    const cleanPayload: IUpdateInvoicePayload = utils.clean(payload)
    const data: IUpdateInvoicePayload["invoice"] = await invoiceSchema.validateAsync(cleanPayload.invoice)

    const invoice = await prisma.invoice.findFirst({ where: { id: cleanPayload.id }, select: { id: true } })
    if (!invoice) {
      throw new ApiError("Invoice not found", 404)
    }

    const token = await prisma.token.findUnique({ where: { id: data.paymentTokenId } })
    if (!token) {
      throw new ApiError("Slected token is not supported", 404)
    }

    const client = await prisma.client.findUnique({ where: { id: data.clientId } })
    if (!client) {
      throw new ApiError("Slected client does not exist", 404)
    }

    const address = await prisma.address.findUnique({ where: { id: data.paymentAddressId } })
    if (!address) {
      throw new ApiError("Slected address does not exist", 404)
    }

    const sumItems = [],
      createItems = [],
      deleteItems = [],
      updateItems = []

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i]

      if (item.mode === "create") {
        createItems.push({
          tax: item.tax,
          price: item.price * Math.pow(10, token.decimals),
          quantity: item.quantity,
          discount: item.discount,
          companyId: item.companyId,
          description: item.description,
        })

        sumItems.push({ ...item, ...tally.getItemAmounts(item) })
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
        })

        sumItems.push({ ...item, ...tally.getItemAmounts(item) })
      } else {
        deleteItems.push({ id: item.id })
      }
    }

    const amounts = tally.sumTotalAmounts(sumItems)
    const updateData = {
      notes: data.notes,
      title: data.title,
      number: data.number,
      dueAt: new Date(data.dueAt),
      issuedAt: new Date(data.issuedAt),
      client: { connect: { id: data.clientId } },
      company: { connect: { ownerId: user.id } },
      status: data.status == null ? undefined : data.status,
      paymentToken: { connect: { id: data.paymentTokenId } },
      paymentAddress: { connect: { id: data.paymentAddressId } },
      netAmount: amounts.netAmount * Math.pow(10, token.decimals),
      items: { create: createItems, update: updateItems, delete: deleteItems },
    }

    const update = await prisma.invoice.update({
      where: { id: invoice.id },
      data: updateData,
      include: { items: true, client: true, company: true, paymentToken: true, paymentAddress: true },
    })

    return update
  }
}
