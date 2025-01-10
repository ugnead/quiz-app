import Joi from "joi";

export const createQuestionSchema = Joi.object({
  name: Joi.string().trim().min(3).max(255).required(),
  answerOptions: Joi.array().items(Joi.string().required()).min(2).max(4).required(),
  correctAnswer: Joi.string().required(),
  explanation: Joi.string().trim().max(255).allow("", null),
  status: Joi.string().valid("enabled", "disabled").default("enabled"),
});

export const updateQuestionSchema = Joi.object({
  name: Joi.string().trim().min(3).max(255).optional(),
  answerOptions: Joi.array().items(Joi.string().required()).min(2).optional(),
  correctAnswer: Joi.string().optional(),
  explanation: Joi.string().trim().max(255).allow("", null).optional(),
  status: Joi.string().valid("enabled", "disabled").optional(),
});