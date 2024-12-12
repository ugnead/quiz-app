import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:categoryId", getCategoryById);

router.post("/", isAdmin, createCategory);
router.patch("/:categoryId", isAdmin, updateCategory);
router.delete("/:categoryId", isAdmin, deleteCategory);

export default router;
