import Joi from "joi";

export const createPaymentLinkSchema = Joi.object({
  title: Joi.string().required(),
  tokenId: Joi.string().required(),
  addressId: Joi.string().required(),
  description: Joi.string().required(),
  amount: Joi.string().optional().default(null),
  redirectUrl: Joi.string().optional().default(null),
});
