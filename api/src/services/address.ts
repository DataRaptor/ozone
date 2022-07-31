import argon2 from "argon2"
import Joi from "joi"
import { Service } from "typedi"
import { prisma } from "../database/prisma"
import {
  IGetAddressPayload,
  IAddAddressPayload,
  IUpdateAddressPayload,
  IUser,
  IDeleteAddressPayload,
} from "../interfaces"

@Service()
export class AddressService {
  public async addAddress(payload: IAddAddressPayload, user: IUser) {
    const schema = Joi.object({
      address: Joi.string().required().trim(),
      label: Joi.string().required().trim(),
    })

    const data: IAddAddressPayload = await schema.validateAsync(payload)
    const address = await prisma.address.findFirst({
      where: {
        address: data.address,
        company: { ownerId: { equals: user.id } },
      },
    })

    if (address) {
      throw new Error("Address already exists")
    }

    const newAddress = await prisma.address.create({
      data: {
        company: { connect: { ownerId: user.id } },
        address: data.address,
        label: data.label,
      },
    })

    return newAddress
  }

  public async getAddresses(user: IUser) {
    const addresses = await prisma.address.findMany({
      where: {
        company: { ownerId: { equals: user.id } },
      },
    })

    return addresses
  }

  public async getAddress(payload: IGetAddressPayload, user: IUser) {
    const address = await prisma.address.findUnique({
      where: {
        id: payload.id,
      },
      include: { company: true },
    })

    if (!address) {
      throw new Error("Address does not exist")
    }
    if (address.company.ownerId !== user.id) {
      throw new Error("You do not have permission to view this resoure")
    }

    return address
  }

  public async updateAddress(payload: IUpdateAddressPayload, user: IUser) {
    const address = await prisma.address.findUnique({
      where: {
        id: payload.id,
      },
      include: { company: true },
    })

    if (!address) {
      throw new Error("Address does not exist")
    }
    if (address.company.ownerId !== user.id) {
      throw new Error("You do not have permission to perform this action")
    }

    const schema = Joi.object({
      address: Joi.string().required().trim(),
      label: Joi.string().required().trim(),
    })

    const data: IUpdateAddressPayload["address"] = await schema.validateAsync(payload.address)

    await prisma.address.update({ where: { id: payload.id }, data })
  }

  public async deleteAddress(payload: IDeleteAddressPayload, user: IUser) {
    const address = await prisma.address.findUnique({
      where: {
        id: payload.id,
      },
      include: { company: true },
    })

    if (!address) {
      throw new Error("Address does not exist")
    }
    if (address.company.ownerId !== user.id) {
      throw new Error("You do not have permission to perform this action")
    }

    await prisma.address.delete({ where: { id: payload.id } })
  }
}
