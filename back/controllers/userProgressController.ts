import { Request, Response } from "express";
import UserProgress from "../models/userProgressModel";
import Question from "../models/questionModel";

export const getProgressBySubcategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    const { subcategoryId } = req.params;

    const totalQuestions = await Question.countDocuments({
      subcategory: subcategoryId,
      status: "enabled",
    });

    const learnedQuestions = await UserProgress.countDocuments({
      user: userId,
      subcategory: subcategoryId,
      mode: "learn",
      correctAnswersCount: { $gte: 2 },
    });

    const correctTestAnswers = await UserProgress.countDocuments({
      user: userId,
      subcategory: subcategoryId,
      mode: "test",
      correctAnswersCount: { $gte: 1 },
    });

    res.status(200).json({
      status: "success",
      data: {
        subcategoryId,
        learnedQuestions,
        totalQuestions,
        correctTestAnswers,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

export const updateUserProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    const { subcategoryId, questionId, isCorrect, mode } = req.body;

    const userProgress = await UserProgress.findOne({
      user: userId,
      question: questionId,
      mode,
    });

    if (userProgress) {
      if (isCorrect) {
        userProgress.correctAnswersCount += 1;
      } else {
        userProgress.correctAnswersCount = 0;
      }
      await userProgress.save();
    } else {
      await UserProgress.create({
        user: userId,
        subcategory: subcategoryId,
        question: questionId,
        correctAnswersCount: isCorrect ? 1 : 0,
        mode,
      });
    }

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

export const deleteUserTestProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    const { subcategoryId } = req.params;

    await UserProgress.deleteMany({
      user: userId,
      subcategory: subcategoryId,
      mode: "test",
    });

    res
      .status(200)
      .json({ status: "success", message: "Test progress cleared" });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error,
    });
  }
};
