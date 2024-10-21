import express from "express";
import {
  getUserProgress,
  updateUserProgress,
  deleteUserTestProgress,
} from "../controllers/userProgressController";

const router = express.Router({ mergeParams: true });

router.get("/progress", getUserProgress);
router.post("/progress", updateUserProgress);
router.delete("/progress", deleteUserTestProgress);

export default router;


