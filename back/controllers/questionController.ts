import { Request, Response } from "express";
import Subcategory from "../models/subcategoryModel";
import Question from "../models/questionModel";
import UserProgress from "../models/userProgressModel";

export const getQuestionsForLearning = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = (req as any).user;
  const { subcategoryId } = req.params;

  try {
    const allQuestions = await Question.find({ subcategory: subcategoryId });

    const userProgress = await UserProgress.find({
      user: userId,
      subcategory: subcategoryId,
      mode: "learn",
    });

    const unansweredQuestions = allQuestions.filter(
      (question) =>
        !userProgress.some(
          (progress) => progress.question.toString() === question._id.toString()
        )
    );

    const incorrectlyAnsweredQuestions = userProgress
      .filter((progress) => progress.correctAnswersCount === 0)
      .map((progress) =>
        allQuestions.find(
          (question) => question._id.toString() === progress.question.toString()
        )
      );

    const answeredOnceQuestions = userProgress
      .filter((progress) => progress.correctAnswersCount === 1)
      .map((progress) =>
        allQuestions.find(
          (question) => question._id.toString() === progress.question.toString()
        )
      );

    const answeredTwiceOrMoreQuestions = userProgress
      .filter((progress) => progress.correctAnswersCount >= 2)
      .map((progress) =>
        allQuestions.find(
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
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

export const getQuestionsForTesting = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { subcategoryId } = req.params;

  try {
    const questions = await Question.find({ subcategory: subcategoryId });

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

export const createQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subcategoryId } = req.params;
    const { question, options, correctAnswer, explanation } = req.body;

    // Input validation
    if (!question || !options || options.length < 2 || !correctAnswer) {
      res.status(400).json({
        status: "fail",
        message:
          "Question text, at least two options, and correct answer are required",
      });
      return;
    }

    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      res.status(404).json({
        status: "fail",
        message: "Subcategory not found",
      });
      return;
    }

    const newQuestion = await Question.create({
      question,
      options,
      correctAnswer,
      explanation,
      subcategory: subcategoryId,
    });

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
    const { questionId } = req.params;
    const { question, options, correctAnswer, explanation } = req.body;

    if (!question && !options && !correctAnswer && !explanation) {
      res.status(400).json({
        status: "fail",
        message: "At least one field is required to update",
      });
      return;
    }

    const updateFields: any = {};

    if (question) updateFields.question = question;
    if (options) {
      if (options.length < 2) {
        res.status(400).json({
          status: "fail",
          message: "At least two options are required",
        });
        return;
      }
      updateFields.options = options;
    }
    if (correctAnswer) updateFields.correctAnswer = correctAnswer;
    if (explanation !== undefined) updateFields.explanation = explanation;

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      res.status(404).json({
        status: "fail",
        message: "Question not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        question: updatedQuestion,
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

    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
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