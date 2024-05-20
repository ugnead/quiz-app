import express from "express";
import { getQuestionsForLearning, updateUserProgress } from "../controllers/userProgressController";

const router = express.Router();

router.route("/:subcategoryId").get(getQuestionsForLearning);
router.route("/user_progress").post(updateUserProgress);

export default router;
