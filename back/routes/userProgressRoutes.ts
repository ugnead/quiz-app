import express from "express";
import {
  getOverallProgress,
  getProgressBySubcategory,
  updateUserProgress,
  deleteOverallProgress,
  deleteUserTestProgress,
} from "../controllers/userProgressController";

const router = express.Router();

router.get("/progress/overall", getOverallProgress);
router.get("/subcategories/:subcategoryId/progress", getProgressBySubcategory);
router.post("/progress", updateUserProgress);
router.delete("/progress/overall", deleteOverallProgress);
router.delete("/subcategories/:subcategoryId/progress", deleteUserTestProgress);

export default router;


