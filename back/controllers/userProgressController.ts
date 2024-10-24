import { Request, Response } from "express";
import UserProgress from "../models/userProgressModel";
import Question from "../models/questionModel";

export const getUserProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = (req as any).user;
  const { subcategoryId } = req.params;

  try {
    const learnProgress = await UserProgress.find({
      user: userId,
      subcategory: subcategoryId,
      mode: "learn",
    });
    const testProgress = await UserProgress.find({
      user: userId,
      subcategory: subcategoryId,
      mode: "test",
    });

    const learnedQuestions = learnProgress.filter(
      (up) => up.correctAnswersCount >= 2
    ).length;
    const totalQuestions = await Question.countDocuments({
      subcategory: subcategoryId,
    });
    const correctTestAnswers =
      testProgress.length > 0
        ? testProgress.filter((up) => up.correctAnswersCount >= 1).length
        : null;

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
  const { userId } = (req as any).user;
  const { questionId, isCorrect, mode } = req.body;

  try {
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
        subcategory: req.body.subcategoryId,
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
  const { userId } = (req as any).user;
  const { subcategoryId } = req.params;

  try {
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
