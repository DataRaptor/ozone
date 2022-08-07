import Joi from "joi"

export const emailSignUpSchema = Joi.object({
  name: Joi.string().required().trim(),
  password: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
})

export const walletSignatureSchema = Joi.object({
  address: Joi.string().required().trim(),
  signature: Joi.string().required().trim(),
  messageId: Joi.string().required().trim(),
})

export const emailSignInSchema = Joi.object({
  password: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
})
