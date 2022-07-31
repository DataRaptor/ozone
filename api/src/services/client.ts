import argon2 from "argon2"
import Joi from "joi"
import { Service } from "typedi"
import { prisma } from "../database/prisma"
import { IGetClientPayload, IAddClientPayload, IUpdateClientPayload, IUser, IDeleteClientPayload } from "../interfaces"

@Service()
export class ClientService {
  public async addClient(payload: IAddClientPayload, user: IUser) {
    const schema = Joi.object({
      email: Joi.string().email().required().trim(),
      name: Joi.string().optional().trim(),
      companyName: Joi.string().optional().trim(),
      firstName: Joi.string().optional().trim(),
      lastName: Joi.string().optional().trim(),
      taxNumber: Joi.string().optional().trim(),
      line1: Joi.string().optional().trim(),
      city: Joi.string().optional().trim(),
      state: Joi.string().optional().trim(),
      postalCode: Joi.string().optional(),
      country: Joi.string().optional().trim(),
    })

    const data: IAddClientPayload = await schema.validateAsync(payload)
    const client = await prisma.client.findUnique({ where: { email: data.email } })

    if (client) {
      throw new Error("Client already exists")
    }

    const newClient = await prisma.client.create({
      data: {
        company: {
          connect: { ownerId: user.id },
        },
        email: data.email,
        companyName: data.companyName,
        firstName: data.firstName,
        lastName: data.lastName,
        taxNumber: data.taxNumber,
        line1: data.line1,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
      },
    })

    return newClient
  }

  public async getClients(user: IUser) {
    const clients = await prisma.client.findMany({
      where: { company: { ownerId: { equals: user.id } } },
    })

    return clients
  }

  public async getClient(payload: IGetClientPayload, user: IUser) {
    const client = await prisma.client.findUnique({
      where: { id: payload.id },
      include: { company: true },
    })

    if (!client) {
      throw new Error("Client does not exist")
    }
    if (client.company.ownerId !== user.id) {
      throw new Error("You do not have permission to view this resoure")
    }

    return client
  }

  public async updateClient(payload: IUpdateClientPayload, user: IUser) {
    const client = await prisma.client.findUnique({
      where: { id: payload.id },
      include: { company: true },
    })

    if (!client) {
      throw new Error("Client does not exist")
    }
    if (client.company.ownerId !== user.id) {
      throw new Error("You do not have permission to perform this action")
    }

    const schema = Joi.object({
      email: Joi.string().email().required().trim(),
      name: Joi.string().optional().trim(),
      companyName: Joi.string().optional().trim(),
      firstName: Joi.string().optional().trim(),
      lastName: Joi.string().optional().trim(),
      taxNumber: Joi.string().optional().trim(),
      line1: Joi.string().optional().trim(),
      city: Joi.string().optional().trim(),
      state: Joi.string().optional().trim(),
      postalCode: Joi.string().optional(),
      country: Joi.string().optional().trim(),
    })

    const data: IUpdateClientPayload["client"] = await schema.validateAsync(payload.client)

    await prisma.client.update({ where: { id: payload.id }, data })
  }

  public async deleteClient(payload: IDeleteClientPayload, user: IUser) {
    const client = await prisma.client.findUnique({
      where: { id: payload.id },
      include: { company: true },
    })

    if (!client) {
      throw new Error("Client does not exist")
    }
    if (client.company.ownerId !== user.id) {
      throw new Error("You do not have permission to perform this action")
    }

    await prisma.client.delete({ where: { id: payload.id } })
  }
}
