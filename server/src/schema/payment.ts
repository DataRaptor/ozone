import Joi from "joi";

export const paymentSchema = Joi.object({
  source: Joi.string().required(),
  amount: Joi.number().required(),
  tokenId: Joi.string().required(),
  companyId: Joi.string().required(),
  addressId: Joi.string().required(),
  clientId: Joi.string().optional().default(null),
  invoiceId: Joi.string().optional().default(null),
  paymentLinkId: Joi.string().optional().default(null),
});

export const completePaymentSchema = Joi.object({
  transactionId: Joi.string().required(),
});
