import { Request, Response } from "express";
import Subcategory from "../models/subcategoryModel";
import Question from "../models/questionModel";
import UserProgress from "../models/userProgressModel";
import {
  createQuestionSchema,
  updateQuestionSchema,
} from "../validators/questionSchemas";

export const getQuestionsBySubcategoryId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subcategoryId } = req.params;
    const { status } = req.query;

    const filter: Record<string, unknown> = { subcategory: subcategoryId };

    if (status && typeof status === "string") {
      filter.status = status;
    }

    const questions = await Question.find(filter)
      .select("_id name answerOptions correctAnswer explanation status")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      status: "success",
      results: questions.length,
      data: {
        questions,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error || "Internal Server Error",
    });
  }
};

export const getQuestionsByUserProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    const { subcategoryId } = req.params;
    const { status } = req.query;

    const filter: Record<string, unknown> = {};

    if (status && typeof status === "string") {
      filter.status = status;
    }

    const questions = await Question.find({ subcategory: subcategoryId })
      .select("_id name answerOptions correctAnswer explanation status")
      .sort({
        createdAt: -1,
      });

    const userProgress = await UserProgress.find({
      user: userId,
      subcategory: subcategoryId,
      mode: "learn",
    });

    const unansweredQuestions = questions.filter(
      (question) =>
        !userProgress.some(
          (progress) => question._id.toString() === progress.question.toString()
        )
    );

    const incorrectlyAnsweredQuestions = userProgress
      .filter((progress) => progress.correctAnswersCount === 0)
      .map((progress) =>
        questions.find(
          (question) => question._id.toString() === progress.question.toString()
        )
      );

    const answeredOnceQuestions = userProgress
      .filter((progress) => progress.correctAnswersCount === 1)
      .map((progress) =>
        questions.find(
          (question) => question._id.toString() === progress.question.toString()
        )
      );

    const answeredTwiceOrMoreQuestions = userProgress
      .filter((progress) => progress.correctAnswersCount >= 2)
      .map((progress) =>
        questions.find(
          (question) => question._id.toString() === progress.question.toString()
        )
      );

    const combinedQuestions = [
      ...unansweredQuestions,
      ...incorrectlyAnsweredQuestions,
      ...answeredOnceQuestions,
      ...answeredTwiceOrMoreQuestions,
    ];

    res.status(200).json({
      status: "success",
      results: combinedQuestions.length,
      data: {
        questions: combinedQuestions,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error || "Internal Server Error",
    });
  }
};

export const createQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subcategoryId } = req.params;

    const subcategory = await Subcategory.findById(subcategoryId);

    if (!subcategory) {
      res.status(404).json({
        status: "fail",
        message: "Subcategory not found",
      });
      return;
    }

    const { error, value } = createQuestionSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      res.status(400).json({
        status: "fail",
        message: error.details.map((d) => d.message).join("; "),
      });
      return;
    }

    const { name, answerOptions, correctAnswer, explanation, status } = value;

    const data: any = {
      subcategory: subcategoryId,
      name,
      answerOptions,
      correctAnswer,
    };
    if (explanation) data.explanation = explanation;
    if (status) data.status = status;

    const newQuestion = await Question.create(data);

    res.status(201).json({
      status: "success",
      data: {
        question: newQuestion,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error || "Internal Server Error",
    });
  }
};

export const updateQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error, value } = updateQuestionSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      res.status(400).json({
        status: "fail",
        message: error.details.map((d) => d.message).join("; "),
      });
      return;
    }

    const { questionId } = req.params;
    const { name, answerOptions, correctAnswer, explanation, status } = value;

    if (!name && !answerOptions && !correctAnswer && !explanation && !status) {
      res.status(400).json({
        status: "fail",
        message: "At least one field is required to update",
      });
      return;
    }

    const data: any = {};
    if (name) data.question = name;
    if (answerOptions) data.answerOptions = answerOptions;
    if (correctAnswer) data.correctAnswer = correctAnswer;
    if (explanation) data.explanation = explanation;
    if (status) data.status = status;

    const updateQuestion = await Question.findByIdAndUpdate(questionId, data, {
      new: true,
      runValidators: true,
    });

    if (!updateQuestion) {
      res.status(404).json({
        status: "fail",
        message: "Question not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        question: updateQuestion,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error || "Internal Server Error",
    });
  }
};

export const deleteQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { questionId } = req.params;

    const deleteQuestion = await Question.findByIdAndDelete(questionId);

    if (!deleteQuestion) {
      res.status(404).json({
        status: "fail",
        message: "Question not found",
      });
      return;
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error || "Internal Server Error",
    });
  }
};
