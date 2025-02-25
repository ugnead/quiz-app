import mongoose from "mongoose";
import Category from "../models/categoryModel";
import UserProgress from "../models/userProgressModel";

export async function getProgressCountBySubcat(
  userId: string,
  subcategoryId: string,
  mode: "learn" | "test",
  threshold: number
): Promise<number> {
  const result = await UserProgress.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        subcategory: new mongoose.Types.ObjectId(subcategoryId),
        mode,
        correctAnswersCount: { $gte: threshold },
      },
    },
    {
      $lookup: {
        from: "questions",
        localField: "question",
        foreignField: "_id",
        as: "questionData",
      },
    },
    { $unwind: "$questionData" },
    {
      $match: {
        "questionData.status": "enabled",
      },
    },
    { $count: "count" },
  ]);

  return result.length > 0 ? result[0].count : 0;
}

export async function getLearnedQuestionsCount(
  userId: string,
  subcategoryId: string
): Promise<number> {
  const result = await getProgressCountBySubcat(
    userId,
    subcategoryId,
    "learn",
    2
  );
  return result;
}

export async function getCorrectTestAnswersCount(
  userId: string,
  subcategoryId: string
): Promise<number> {
  const result = await getProgressCountBySubcat(
    userId,
    subcategoryId,
    "test",
    1
  );
  return result;
}

export async function getOverallEnabled(): Promise<{
  enabledCategories: Array<{
    _id: string;
    enabledSubcategories: Array<{
      _id: string;
      enabledQuestionIds: string[];
    }>;
  }>;
}> {
  const hierarchy = await Category.aggregate([
    { $match: { status: "enabled" } },
    {
      $lookup: {
        from: "subcategories",
        localField: "_id",
        foreignField: "category",
        as: "enabledSubcategories",
        pipeline: [
          { $match: { status: "enabled" } },
          {
            $lookup: {
              from: "questions",
              localField: "_id",
              foreignField: "subcategory",
              as: "enabledQuestions",
              pipeline: [
                { $match: { status: "enabled" } },
                { $project: { _id: 1 } },
              ],
            },
          },
          { $project: { enabledQuestions: 1 } },
        ],
      },
    },
    { $unwind: "$enabledSubcategories" },
    { $unwind: "$enabledSubcategories.enabledQuestions" },
    {
      $group: {
        _id: null,
        questionIds: {
          $addToSet: "$enabledSubcategories.enabledQuestions._id",
        },
      },
    },
    {
      $project: { _id: 0, questionIds: 1 },
    },
  ]);
  return result.length > 0 ? result[0].questionIds : [];
}

export async function getLearnedQuestionsCount(
  userId: string,
  enabledQuestionIds: string[]
): Promise<number> {
  const objectIds = enabledQuestionIds.map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  const result = await UserProgress.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        question: { $in: objectIds },
        mode: "learn",
        correctAnswersCount: { $gte: 2 },
      },
    },
    { $count: "learnedCount" },
  ]);

  return result.length > 0 ? result[0].learnedCount : 0;
}
