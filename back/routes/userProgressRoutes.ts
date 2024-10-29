import express from "express";
import {
  getUserProgress,
  updateUserProgress,
  deleteUserTestProgress,
} from "../controllers/userProgressController";

const router = express.Router();

router.get("/subcategories/:subcategoryId/progress", getUserProgress);
router.post("/progress", updateUserProgress);
router.delete("/subcategories/:subcategoryId/progress", deleteUserTestProgress);

export default router;


