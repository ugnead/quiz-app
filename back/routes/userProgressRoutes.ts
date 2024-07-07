import express from "express";
import { getQuestionsForLearning, getQuestionsForTesting, updateUserProgress, getUserProgress, clearTestProgress } from "../controllers/userProgressController";

const router = express.Router();

router.route("/:subcategoryId/learn").get(getQuestionsForLearning);
router.route("/:subcategoryId/test").get(getQuestionsForTesting);
router.route("/:subcategoryId/progress").get(getUserProgress);
router.route("/user_progress").post(updateUserProgress);
router.route("/:subcategoryId/clear_test_progress").delete(clearTestProgress);

export default router;

