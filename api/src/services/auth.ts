import argon2 from "argon2"
import Joi from "joi"
import { Service } from "typedi"
import { app } from "../app"
import { walletAuthMessage } from "../config"
import { prisma } from "../database/prisma"
import { ApiError } from "../errors"
import { ISignupUserPayload, ISigninUserPayload } from "../interfaces"
import { emailSignInSchema, emailSignUpSchema, walletSignatureSchema } from "../schema"
import { nacl, utils } from "../utils"

@Service()
export class AuthService {
  public async signUpUser(payload: ISignupUserPayload) {
    const cleanPayload: ISignupUserPayload = utils.clean(payload)

    switch (cleanPayload.mode) {
      case "wallet":
        return await this.walletSignUp(cleanPayload)
      case "email":
        return this.emailSignUp(cleanPayload)
      default:
        throw new ApiError("Authentication mode is not supported", 400)
    }
  }

  public async signInUser(payload: ISigninUserPayload) {
    const cleanPayload: ISigninUserPayload = utils.clean(payload)

    switch (cleanPayload.mode) {
      case "wallet":
        return await this.walletSignIn(cleanPayload)
      case "email":
        return this.emailSignIn(cleanPayload)
      default:
        throw new ApiError("Authentication mode is not supported", 400)
    }
  }

  private async walletSignUp(payload: ISignupUserPayload) {
    const data: ISignupUserPayload = await walletSignatureSchema.validateAsync(payload, { allowUnknown: true })

    const message = `${walletAuthMessage} ${data.messageId}`
    const isValidSignature = nacl.verifyMessage(message, data.signature!, data.address!)

    if (!isValidSignature) {
      throw new ApiError("Invalid signature", 409)
    }

    const user = await prisma.user.findUnique({ where: { address: data.address } })
    if (user) {
      throw new ApiError("User already exists", 409)
    }

    const newUser = await prisma.user.create({
      data: {
        address: data.address,
        company: {
          create: {
            addresses: {
              create: {
                label: "Main",
                address: data.address!,
              },
            },
          },
        },
      },
    })

    return {
      token: app.jwt.sign({ id: newUser.id, address: newUser.address }),
    }
  }

  private async emailSignUp(payload: ISignupUserPayload) {
    const data: ISignupUserPayload = await emailSignUpSchema.validateAsync(payload, { allowUnknown: true })
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (user) {
      throw new ApiError("User already exists", 409)
    }

    const password = await argon2.hash(data.password!)
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password,
        company: {
          create: { name: data.name },
        },
      },
    })

    return {
      token: app.jwt.sign({ id: newUser.id, email: newUser.email }),
    }
  }

  private async walletSignIn(payload: ISigninUserPayload) {
    const data: ISigninUserPayload = await walletSignatureSchema.validateAsync(payload, { allowUnknown: true })

    const message = `${walletAuthMessage} ${data.messageId}`
    const isValidSignature = nacl.verifyMessage(message, data.signature!, data.address!)
    if (!isValidSignature) {
      throw new ApiError("Invalid signature", 400)
    }

    const user = await prisma.user.findUnique({ where: { address: data.address } })
    if (!user) {
      throw new ApiError("User does not exist", 404)
    }

    return { token: app.jwt.sign({ id: user.id, address: user.address }) }
  }

  private async emailSignIn(payload: ISigninUserPayload) {
    const data: ISigninUserPayload = await emailSignInSchema.validateAsync(payload, { allowUnknown: true })
    const user = await prisma.user.findUnique({ where: { email: data.email } })

    if (!user) {
      throw new ApiError("User does not exist", 404)
    }

    const isValidPassword = await argon2.verify(user.password!, data.password!)
    if (!isValidPassword) {
      throw new ApiError("The password provided is invalid", 400)
    }

    return { token: app.jwt.sign({ id: user.id, email: user.email }) }
  }
}
