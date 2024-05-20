import { Request, Response } from "express";
import UserProgress from "../models/userProgressModel";
import Question from "../models/questionModel";

export const getQuestionsForLearning = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = (req as any).user;
  const { subcategoryId } = req.params;

  try {
    const userProgress = await UserProgress.find({
      user: userId,
      subcategory: subcategoryId,
    });
    const learnedQuestionIds = userProgress
      .filter((up) => up.correctAnswersCount >= 2)
      .map((up) => up.question);
    const questions = await Question.find({
      subcategory: subcategoryId,
      _id: { $nin: learnedQuestionIds },
    });

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

export const updateUserProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = (req as any).user;
  const { questionId, isCorrect } = req.body;

  try {
    const userProgress = await UserProgress.findOne({
      user: userId,
      question: questionId,
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
        subcategory: req.body.subcategoryId,
        question: questionId,
        correctAnswersCount: isCorrect ? 1 : 0,
      });
    }

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error,
    });
  }
};
