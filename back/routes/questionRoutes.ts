import express from "express";
import {
  getQuestionsForLearning,
  getQuestionsForTesting,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router.get("/subcategories/:subcategoryId/questions/learn", getQuestionsForLearning);
router.get("/subcategories/:subcategoryId/questions/test", getQuestionsForTesting);

router.post("/subcategories/:subcategoryId/questions", isAdmin, createQuestion);
router.put("/questions/:questionId", isAdmin, updateQuestion);
router.delete("/questions/:questionId", isAdmin, deleteQuestion);

export default router;
