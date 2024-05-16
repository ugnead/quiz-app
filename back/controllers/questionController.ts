import { Request, Response } from "express";
import Question from "../models/questionModel";

export const getQuestionsBySubcategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const questions = await Question.find({ subcategory: req.params.subcategoryId });
    res.status(200).json({
      status: "success",
      results: questions.length,
      data: {
        questions,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
