import express from 'express';
import { getAllSubcategories, getSubcategoryById } from "../controllers/subcategoryController";

const router = express.Router();

router.route("/category/:categoryId").get(getAllSubcategories);
router.route("/:subcategoryId").get(getSubcategoryById);

export default router;
