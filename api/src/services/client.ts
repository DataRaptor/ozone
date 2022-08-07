import { Service } from "typedi"
import { prisma } from "../database/prisma"
import { ApiError } from "../errors"
import { IGetClientPayload, IAddClientPayload, IUpdateClientPayload, IUser, IDeleteClientPayload } from "../interfaces"
import { clientSchema } from "../schema"
import { utils } from "../utils"

@Service()
export class ClientService {
  public async addClient(payload: IAddClientPayload, user: IUser) {
    const cleanPayload: IAddClientPayload = utils.clean(payload)
    const data: IAddClientPayload = await clientSchema.validateAsync(cleanPayload)
    if (data.email) {
      const client = await prisma.client.findFirst({
        where: { email: data.email, company: { ownerId: { equals: user.id } } },
      })

      if (client) {
        throw new ApiError("Client email address already exists", 409)
      }
    }

    if (data.phone) {
      const client = await prisma.client.findFirst({
        where: { phone: data.phone, company: { ownerId: { equals: user.id } } },
      })

      if (client) {
        throw new ApiError("Client phone number already exists", 409)
      }
    }

    const client = await prisma.client.create({
      data: {
        company: { connect: { ownerId: user.id } },
        email: data.email,
        name: data.name,
        phone: data.phone,
        taxNumber: data.taxNumber,
        line1: data.line1,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
      },
    })

    return client
  }

  public async getClients(user: IUser) {
    const clients = await prisma.client.findMany({
      where: { company: { ownerId: { equals: user.id } } },
    })

    return clients
  }

  public async getClient(payload: IGetClientPayload, user: IUser) {
    const cleanPayload: IGetClientPayload = utils.clean(payload)
    const client = await prisma.client.findUnique({ where: { id: cleanPayload.id }, include: { company: true } })

    if (!client) {
      throw new ApiError("Client does not exist", 404)
    }
    if (client.company.ownerId !== user.id) {
      throw new ApiError("You do not have permission to view this resoure", 403)
    }

    return client
  }

  public async updateClient(payload: IUpdateClientPayload, user: IUser) {
    const cleanPayload: IUpdateClientPayload = utils.clean(payload)
    const client = await prisma.client.findUnique({
      where: { id: cleanPayload.id },
      include: { company: true },
    })

    if (!client) {
      throw new ApiError("Client does not exist", 404)
    }

    if (client.company.ownerId !== user.id) {
      throw new ApiError("You do not have permission to perform this action", 403)
    }

    const data: IUpdateClientPayload["client"] = await clientSchema.validateAsync(cleanPayload.client)

    if (data.email && data.email !== client.email) {
      const client = await prisma.client.findFirst({
        where: { email: data.email, company: { ownerId: { equals: user.id } } },
      })

      if (client) {
        throw new ApiError("Client email address already exists", 409)
      }
    }

    if (data.phone && data.phone !== client.phone) {
      const client = await prisma.client.findFirst({
        where: { phone: data.phone, company: { ownerId: { equals: user.id } } },
      })

      if (client) {
        throw new ApiError("Client phone number already exists", 409)
      }
    }

    return await prisma.client.update({ where: { id: cleanPayload.id }, data: { ...cleanPayload.client, ...data } })
  }

  public async deleteClient(payload: IDeleteClientPayload, user: IUser) {
    const cleanPayload: IDeleteClientPayload = utils.clean(payload)
    const client = await prisma.client.findUnique({
      where: { id: cleanPayload.id },
      include: { company: true },
    })

    if (!client) {
      throw new ApiError("Client does not exist", 404)
    }
    if (client.company.ownerId !== user.id) {
      throw new ApiError("You do not have permission to perform this action", 403)
    }

    await prisma.client.delete({ where: { id: cleanPayload.id } })
  }
}
