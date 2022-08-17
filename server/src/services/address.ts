import { Service } from "typedi";
import { prisma } from "../database/prisma";
import { ApiError } from "../errors";
import {
  IGetAddressPayload,
  IAddAddressPayload,
  IUpdateAddressPayload,
  IDeleteAddressPayload,
  Context,
} from "../interfaces";
import { addressSchema } from "../schema";
import { solana } from "../Solana";
import { utils } from "../utils";

@Service()
export class AddressService {
  public async addAddress(payload: IAddAddressPayload, context: Context) {
    const { company } = context;

    const cleanPayload: IAddAddressPayload = utils.clean(payload);
    const data: IAddAddressPayload = await addressSchema.validateAsync(cleanPayload);
    const address = await prisma.address.findFirst({
      where: {
        address: data.address,
        company: { id: { equals: company!.id } },
      },
    });

    if (address) {
      throw new ApiError("Address already exists", 409);
    }

    const newAddress = await prisma.address.create({
      data: {
        company: { connect: { id: company!.id } },
        address: data.address,
        label: data.label,
      },
    });

    return newAddress;
  }

  public async getAddresses(context: Context) {
    const { company } = context;
    const addresses = await prisma.address.findMany({
      where: {
        company: { id: { equals: company!.id } },
      },
    });

    return addresses;
  }

  public async updateAddress(payload: IUpdateAddressPayload, context: Context) {
    const { company } = context;

    const cleanPayload: IUpdateAddressPayload = utils.clean(payload);
    const address = await prisma.address.findUnique({ where: { id: cleanPayload.id }, include: { company: true } });

    if (!address) {
      throw new ApiError("Address does not exist", 404);
    }

    if (address.company.id !== company!.id) {
      throw new ApiError("You do not have permission to perform this action", 403);
    }

    const data: IUpdateAddressPayload["address"] = await addressSchema.validateAsync(cleanPayload.address);
    return await prisma.address.update({ where: { id: cleanPayload.id }, data });
  }

  public async deleteAddress(payload: IDeleteAddressPayload, context: Context) {
    const { company } = context;

    const cleanPayload: IDeleteAddressPayload = utils.clean(payload);
    const address = await prisma.address.findUnique({ where: { id: cleanPayload.id }, include: { company: true } });

    if (!address) {
      throw new ApiError("Address does not exist", 404);
    }

    if (address.company.id !== company!.id) {
      throw new ApiError("You do not have permission to perform this action", 403);
    }

    await prisma.address.delete({ where: { id: cleanPayload.id } });
  }

  public async getAddress(payload: IGetAddressPayload, context: Context) {
    const { company } = context;

    const cleanPayload: IDeleteAddressPayload = utils.clean(payload);
    const address = await prisma.address.findUnique({ where: { id: cleanPayload.id }, include: { company: true } });

    if (!address) {
      throw new ApiError("Address does not exist", 404);
    }
    if (address.company.id !== company!.id) {
      throw new ApiError("You do not have permission to view this resoure", 403);
    }

    const balances = await solana.getBalances(address.address);
    const tokens = await prisma.token.findMany();

    const data = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const balance = balances.find((b) => b.mint == token.address);

      if (balance) {
        const amount = balance.amount / Math.pow(10, token.decimals);
        data.push({ ...token, amount, isNative: balance.isNative === 0 ? false : true });
      }
    }

    return { ...address, tokens: data };
  }
}
