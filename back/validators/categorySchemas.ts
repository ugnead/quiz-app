import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required(),
  status: Joi.string().valid("enabled", "disabled").default("disabled"),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).optional(),
  status: Joi.string().valid("enabled", "disabled").optional(),
});