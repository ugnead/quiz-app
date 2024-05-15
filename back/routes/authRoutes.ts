import express from "express";
import { googleAuth } from "../controllers/authController";
import { handleRefreshToken, handleTokenVerification } from "../controllers/tokenController";
import { verifyToken } from "../middlewares/authMiddleware";
import { loginLimiter } from "../middlewares/rateLimiters";

const router = express.Router();

router.route("/google").post(loginLimiter, googleAuth);
router.route("/refresh_token").post(loginLimiter, handleRefreshToken);
router.route("/verify_token").get(verifyToken, handleTokenVerification);

export default router;
