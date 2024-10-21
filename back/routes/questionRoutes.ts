import express from "express";
import {
  getQuestionsForLearning,
  getQuestionsForTesting,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router({ mergeParams: true });

router.get("/learn", getQuestionsForLearning);
router.get("/test", getQuestionsForTesting);

router.post("/", isAdmin, createQuestion);
router.put("/:questionId", isAdmin, updateQuestion);
router.delete("/:questionId", isAdmin, deleteQuestion);

export default router;
