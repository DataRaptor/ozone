import Joi from "joi"

export const clientSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().email().optional().default(null).trim(),
  phone: Joi.string().optional().default(null).trim(),
  taxNumber: Joi.string().optional().default(null).trim(),
  line1: Joi.string().optional().default(null).trim(),
  city: Joi.string().optional().default(null).trim(),
  state: Joi.string().optional().default(null).trim(),
  postalCode: Joi.string().optional().default(null),
  country: Joi.string().optional().default(null).trim(),
})
