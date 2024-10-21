import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import subcategoryRouter from "./subcategoryRoutes";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:categoryId", getCategoryById);

router.post("/", isAdmin, createCategory);
router.put("/:categoryId", isAdmin, updateCategory);
router.delete("/:categoryId", isAdmin, deleteCategory);

router.use("/:categoryId/subcategories", subcategoryRouter);

export default router;
