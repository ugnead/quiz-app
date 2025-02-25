import { Request, Response } from "express";
import UserProgress from "../models/userProgressModel";
import Subcategory from "../models/subcategoryModel";
import Question from "../models/questionModel";
import {
  getProgressCountBySubcat,
  getEnabledQuestionsIds,
  getLearnedQuestionsCount
} from "../services/userProgressService";

export const getOverallProgress = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;

    const enabledQuestionIds = await getEnabledQuestionsIds();
    const totalQuestions = enabledQuestionIds.length;

    const learnedQuestions = await getLearnedQuestionsCount(userId, enabledQuestionIds);

    const totalTests = await Subcategory.countDocuments({ status: "enabled" });

    const enabledSubcats = await Subcategory.find({ status: "enabled" });

    let passedTests = 0;
    for (const subcat of enabledSubcats) {
      const subcatQuestionCount = await Question.countDocuments({
        subcategory: subcat._id,
        status: "enabled",
      });

      if (subcatQuestionCount === 0) {
        continue;
      }

      const userProgressDocs = await UserProgress.find({
        user: userId,
        subcategory: subcat._id,
        mode: "test",
      });

      let correctCount = 0;
      for (const doc of userProgressDocs) {
        if (doc.correctAnswersCount >= 1) {
          correctCount++;
        }
      }

      const percent = correctCount / subcatQuestionCount;
      if (percent >= 0.8) {
        passedTests++;
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
