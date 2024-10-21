import express from "express";
import {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../controllers/subcategoryController";
import questionRouter from "./questionRoutes";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router({ mergeParams: true });

router.get("/", getAllSubcategories);
router.get("/:subcategoryId", getSubcategoryById);

router.post("/", isAdmin, createSubcategory);
router.put("/:subcategoryId", isAdmin, updateSubcategory);
router.delete("/:subcategoryId", isAdmin, deleteSubcategory);

router.use("/:subcategoryId/questions", questionRouter);

export default router;
