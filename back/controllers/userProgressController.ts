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
    console.error("Error fetching questions for learning:", error);
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

    const learnedQuestions = learnProgress.filter(up => up.correctAnswersCount >= 2).length;
    const totalQuestions = await Question.countDocuments({ subcategory: subcategoryId });
    const correctTestAnswers = testProgress.filter(up => up.correctAnswersCount >= 1).length;

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
