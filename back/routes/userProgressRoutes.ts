import express from "express";
import { getQuestionsForLearning, getQuestionsForTesting, updateUserProgress, getUserProgress } from "../controllers/userProgressController";

const router = express.Router();

router.route("/:subcategoryId/learn").get(getQuestionsForLearning);
router.route("/:subcategoryId/test").get(getQuestionsForTesting);
router.route("/:subcategoryId/progress").get(getUserProgress);
router.route("/user_progress").post(updateUserProgress);

export default router;

