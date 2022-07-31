import argon2 from "argon2"
import Joi from "joi"
import { Service } from "typedi"
import { prisma } from "../database/prisma"
import { IGetTokenPayload, IUser } from "../interfaces"

@Service()
export class TokenService {
  public async getTokens() {
    const tokens = await prisma.token.findMany()
    return tokens
  }

  public async getToken(payload: IGetTokenPayload) {
    const token = await prisma.token.findUnique({ where: { id: payload.id } })
    if (!token) {
      throw new Error("Token does not exist")
    }

    return token
  }
}
