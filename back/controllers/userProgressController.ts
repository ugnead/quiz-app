import { Request, Response } from "express";
import UserProgress from "../models/userProgressModel";
import Question from "../models/questionModel";
import {
  getLearnedQuestionsCount,
  getCorrectTestAnswersCount,
  getOverallEnabled,
  getOverallLearnedQuestionsCount,
} from "../services/userProgressService";

export const getOverallProgress = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;

    const { enabledCategories } = await getOverallEnabled();

    const totalQuestions = enabledCategories.reduce((acc, cat) => {
      return (
        acc +
        cat.enabledSubcategories.reduce(
          (subAcc, sub) => subAcc + sub.enabledQuestionIds.length,
          0
        )
      );
    }, 0);

    const allEnabledQuestionIds = enabledCategories.flatMap((cat) =>
      cat.enabledSubcategories.flatMap((sub) => sub.enabledQuestionIds)
    );

    const learnedQuestions = await getOverallLearnedQuestionsCount(
      userId,
      allEnabledQuestionIds
    );

    const totalTests = enabledCategories.reduce((acc, cat) => {
      const validSubcats = cat.enabledSubcategories.filter(
        (sub) => sub.enabledQuestionIds.length > 0
      );
      return acc + validSubcats.length;
    }, 0);

    let passedTests = 0;
    for (const cat of enabledCategories) {
      for (const sub of cat.enabledSubcategories) {
        const subcatTotal = sub.enabledQuestionIds.length;
        if (subcatTotal === 0) continue;
        const correctTestAnswers = await getCorrectTestAnswersCount(
          userId,
          sub._id.toString()
        );
        const passRatio = correctTestAnswers / subcatTotal;
        if (passRatio >= 0.8) {
          passedTests++;
        }
      }
    }

    return res.status(200).json({
      status: "success",
      data: {
        learnedQuestions,
        totalQuestions,
        passedTests,
        totalTests,
      },
    });
  } catch (error) {
    console.error("Error fetching user overview", error);
    return res.status(500).json({
      status: "fail",
      message: error,
    });
  }
};

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

    const learnedQuestions = await getLearnedQuestionsCount(
      userId,
      subcategoryId
    );

    const correctTestAnswers = await getCorrectTestAnswersCount(
      userId,
      subcategoryId
    );

    res.status(200).json({
      status: "success",
      data: {
        subcategoryId,
        totalQuestions,
        learnedQuestions,
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

export const deleteOverallProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = (req as any).user;

    await UserProgress.deleteMany({ user: userId });

    res
      .status(200)
      .json({ status: "success", message: "Overall user progress cleared" });
  } catch (error) {
    res.status(500).json({
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
