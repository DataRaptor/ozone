import argon2 from "argon2"
import Joi from "joi"
import { Service } from "typedi"
import { prisma } from "../database/prisma"
import { ApiError } from "../errors"
import {
  IGetAddressPayload,
  IAddAddressPayload,
  IUpdateAddressPayload,
  IUser,
  IDeleteAddressPayload,
} from "../interfaces"
import { addressSchema } from "../schema"
import { utils } from "../utils"

@Service()
export class AddressService {
  public async addAddress(payload: IAddAddressPayload, user: IUser) {
    const cleanPayload: IAddAddressPayload = utils.clean(payload)
    const data: IAddAddressPayload = await addressSchema.validateAsync(cleanPayload)
    const address = await prisma.address.findFirst({
      where: { address: data.address, company: { ownerId: { equals: user.id } } },
    })

    if (address) {
      throw new ApiError("Address already exists", 409)
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
    const cleanPayload: IGetAddressPayload = utils.clean(payload)
    const address = await prisma.address.findUnique({
      where: {
        id: cleanPayload.id,
      },
      include: { company: true },
    })

    if (!address) {
      throw new ApiError("Address does not exist", 404)
    }
    if (address.company.ownerId !== user.id) {
      throw new ApiError("You do not have permission to view this resoure", 403)
    }

    return address
  }

  public async updateAddress(payload: IUpdateAddressPayload, user: IUser) {
    const cleanPayload: IUpdateAddressPayload = utils.clean(payload)
    const address = await prisma.address.findUnique({
      where: {
        id: cleanPayload.id,
      },
      include: { company: true },
    })

    if (!address) {
      throw new ApiError("Address does not exist", 404)
    }
    if (address.company.ownerId !== user.id) {
      throw new ApiError("You do not have permission to perform this action", 403)
    }

    const data: IUpdateAddressPayload["address"] = await addressSchema.validateAsync(cleanPayload.address)
    return await prisma.address.update({ where: { id: cleanPayload.id }, data })
  }

  public async deleteAddress(payload: IDeleteAddressPayload, user: IUser) {
    const cleanPayload: IDeleteAddressPayload = utils.clean(payload)
    const address = await prisma.address.findUnique({
      where: {
        id: cleanPayload.id,
      },
      include: { company: true },
    })

    if (!address) {
      throw new ApiError("Address does not exist", 404)
    }
    if (address.company.ownerId !== user.id) {
      throw new ApiError("You do not have permission to perform this action", 403)
    }

    await prisma.address.delete({ where: { id: cleanPayload.id } })
  }
}
