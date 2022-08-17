import Joi from "joi";

export const addressSchema = Joi.object({
  address: Joi.string().required().trim(),
  label: Joi.string().required().trim(),
});
