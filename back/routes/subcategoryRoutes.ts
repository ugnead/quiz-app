import express from 'express';
import { getAllSubcategories } from "../controllers/subcategoryController";

const router = express.Router();

router.route("/:categoryId").get(getAllSubcategories);

export default router;
