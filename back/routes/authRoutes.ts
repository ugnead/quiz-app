import express from "express";
import { googleAuth } from "../controllers/authController";
import { handleRefreshToken } from "../controllers/tokenController";

const router = express.Router();

router.route("/google").post(googleAuth);
router.route("/refresh_token").post(handleRefreshToken);

export default router;
