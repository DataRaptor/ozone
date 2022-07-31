import argon2 from "argon2"
import Joi from "joi"
import { Service } from "typedi"
import { app } from "../app"
import { prisma } from "../database/prisma"
import { ISignupUserPayload, ISigninUserPayload } from "../interfaces"

@Service()
export class AuthService {
  public async signupUser(payload: ISignupUserPayload) {
    switch (payload.mode) {
      case "wallet":
        return await this.walletSignup(payload)
      case "email":
        return this.emailSignup(payload)
      default:
        throw new Error("Authentication mode is not supported")
    }
  }

  public async signinUser(payload: ISigninUserPayload) {
    switch (payload.mode) {
      case "wallet":
        return await this.walletSignin(payload)
      case "email":
        return this.emailSignin(payload)
      default:
        throw new Error("Authentication mode is not supported")
    }
  }

  private async walletSignup(payload: ISignupUserPayload) {
    const schema = Joi.object({
      address: Joi.string().required().trim(),
    })

    const data: ISignupUserPayload = await schema.validateAsync(payload, { allowUnknown: true })
    const user = await prisma.user.findUnique({ where: { address: data.address } })
    if (user) {
      throw new Error("User already exists")
    }

    const newUser = await prisma.user.create({
      data: {
        address: data.address,
        company: {
          create: { name: `${data.address}'s company` },
        },
      },
    })
    return {
      token: app.jwt.sign({ id: newUser.id, address: newUser.address }),
    }
  }

  private async emailSignup(payload: ISignupUserPayload) {
    const schema = Joi.object({
      name: Joi.string().required().trim(),
      password: Joi.string().required().trim(),
      email: Joi.string().email().required().trim(),
    })

    const data: ISignupUserPayload = await schema.validateAsync(payload, { allowUnknown: true })
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (user) {
      throw new Error("User already exists")
    }

    const password = await argon2.hash(data.password!)
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password,
        company: {
          create: { name: data.name! },
        },
      },
    })

    return {
      token: app.jwt.sign({ id: newUser.id, email: newUser.email }),
    }
  }

  private async emailSignin(payload: ISigninUserPayload) {
    const schema = Joi.object({
      address: Joi.string().required().trim(),
    })

    const data = await schema.validateAsync(payload, { allowUnknown: true })
    const user = await prisma.user.findUnique({ where: { address: data.address } })

    if (!user) {
      throw new Error("User does not exist")
    }

    return { token: app.jwt.sign({ id: user.id, address: user.address }) }
  }

  private async walletSignin(payload: ISigninUserPayload) {
    const schema = Joi.object({
      password: Joi.string().required().trim(),
      email: Joi.string().email().required().trim(),
    })

    const data = await schema.validateAsync(payload, { allowUnknown: true })
    const user = await prisma.user.findUnique({ where: { email: data.email } })

    if (!user) {
      throw new Error("User does not exist")
    }

    const isValidPassword = await argon2.verify(user.password!, data.password)
    if (!isValidPassword) {
      throw new Error("The password provided is invalid")
    }

    return { token: app.jwt.sign({ id: user.id, email: user.email }) }
  }
}
