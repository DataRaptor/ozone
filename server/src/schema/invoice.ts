import Joi from "joi";

export const invoiceSchema = Joi.object({
  title: Joi.string().required(),
  dueAt: Joi.number().required(),
  number: Joi.string().required(),
  issuedAt: Joi.number().required(),
  clientId: Joi.string().required(),
  paymentTokenId: Joi.string().required(),
  paymentAddressId: Joi.string().required(),
  notes: Joi.string().optional().default(null),
  status: Joi.string().required(),
  items: Joi.array()
    .items({
      id: Joi.string().optional(),
      mode: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      companyId: Joi.string().required(),
      description: Joi.string().required(),
      tax: Joi.number().optional().default(null),
      discount: Joi.number().optional().default(null),
    })
    .optional()
    .empty(Joi.array().length(0))
    .default([]),
});

export const updateInvoiceStatusSchema = Joi.object({
  status: Joi.string().required().valid("APPROVED", "REJECTED").trim(),
  token: Joi.string().required().trim(),
});

export const completeInvoicePaymentSchema = Joi.object({
  transactionId: Joi.string().required().trim(),
  token: Joi.string().required().trim(),
});
