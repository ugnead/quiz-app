import express from "express";
import {
  getOverallProgress,
  getProgressBySubcategory,
  updateUserProgress,
  deleteUserTestProgress,
} from "../controllers/userProgressController";

const router = express.Router();

router.get("/progress/overview", getOverallProgress);
router.get("/subcategories/:subcategoryId/progress", getProgressBySubcategory);
router.post("/progress", updateUserProgress);
router.delete("/subcategories/:subcategoryId/progress", deleteUserTestProgress);

export default router;


