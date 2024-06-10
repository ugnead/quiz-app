import express from 'express';
import { getAllCategories, getCategoryById } from "../controllers/categoryController";

const router = express.Router();

router.route("/").get(getAllCategories);
router.route("/:categoryId").get(getCategoryById);

export default router;
