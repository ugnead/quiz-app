import express from "express";
import { getAllQuestions } from "../controllers/questionController";

const router = express.Router();

router.route("/").get(getAllQuestions);

export default router;
