import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
});

export const userExistingPasswordUpdateSchema = Joi.object({
  oldPassword: Joi.string().required().trim(),
  newPassword: Joi.string().required().trim(),
});

export const userNewPasswordUpdateSchema = Joi.object({
  repeatPassword: Joi.string().required().trim(),
  newPassword: Joi.string().required().trim(),
});
