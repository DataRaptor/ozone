import argon2 from "argon2"
import Joi from "joi"
import { Service } from "typedi"
import { prisma } from "../database/prisma"
import { ApiError } from "../errors"
import { IGetTokenPayload, IUser } from "../interfaces"
import { utils } from "../utils"

@Service()
export class TokenService {
  public async getTokens() {
    const tokens = await prisma.token.findMany()
    return tokens
  }

  public async getToken(payload: IGetTokenPayload) {
    const cleanPayload: IGetTokenPayload = utils.clean(payload)
    const token = await prisma.token.findUnique({ where: { id: cleanPayload.id } })

    if (!token) {
      throw new ApiError("Token does not exist", 404)
    }

    return token
  }
}
