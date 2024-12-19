import express from "express";
import {
  getSubcategoriesByCategoryId,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../controllers/subcategoryController";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router.get("/categories/:categoryId/subcategories", getSubcategoriesByCategoryId);
router.get("/subcategories/:subcategoryId", getSubcategoryById);

router.post("/categories/:categoryId/subcategories", isAdmin, createSubcategory);
router.patch("/subcategories/:subcategoryId", isAdmin, updateSubcategory);
router.delete("/subcategories/:subcategoryId", isAdmin, deleteSubcategory);

export default router;
