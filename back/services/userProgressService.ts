import mongoose from "mongoose";
import UserProgress from "../models/userProgressModel";

export async function getProgressCount(
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