import express from "express";
import { getQuestionsBySubcategory } from "../controllers/questionController";

const router = express.Router();

router.route("/subcategory/:subcategoryId").get(getQuestionsBySubcategory);

export default router;
