import Joi from "joi";

export const createSubcategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required(),
  status: Joi.string().valid("enabled", "disabled").default("enabled"),
});

export const updateSubcategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).optional(),
  status: Joi.string().valid("enabled", "disabled").optional(),
});