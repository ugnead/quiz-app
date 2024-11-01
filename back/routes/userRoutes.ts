import express from "express";
import { getAllUsers, updateUserRole } from "../controllers/userController";

const router = express.Router();

router.get("/", getAllUsers);
router.patch("/:userId/role", updateUserRole);

export default router;
