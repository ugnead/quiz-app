import Joi from "joi";

export const createQuestionSchema = Joi.object({
  name: Joi.string().trim().min(3).max(255).required(),
  answerOptions: Joi.array().items(Joi.string().trim().min(1).max(255).required()).min(2).max(5).required(),
  correctAnswer: Joi.string().trim().min(1).max(255).required(),
  explanation: Joi.string().trim().min(3).max(500).optional(),
  status: Joi.string().valid("enabled", "disabled").default("disabled"),
});

export const updateQuestionSchema = Joi.object({
  name: Joi.string().trim().min(3).max(255).optional(),
  answerOptions: Joi.array().items(Joi.string().trim().min(1).max(50).required()).min(2).max(5).optional(),
  correctAnswer: Joi.string().trim().min(1).max(50).optional(),
  explanation: Joi.string().trim().min(3).max(500).optional(),
  status: Joi.string().valid("enabled", "disabled").optional(),
});