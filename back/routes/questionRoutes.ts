import express from "express";
import {
  getQuestionsByUserProgress,
  getQuestionsBySubcategoryId,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router.get("/subcategories/:subcategoryId/questions/learn", getQuestionsByUserProgress);
router.get("/subcategories/:subcategoryId/questions", getQuestionsBySubcategoryId);

router.post("/subcategories/:subcategoryId/questions", isAdmin, createQuestion);
router.put("/questions/:questionId", isAdmin, updateQuestion);
router.delete("/questions/:questionId", isAdmin, deleteQuestion);

export default router;
