import express from "express";
import {
  register,
  loginUser,
  logoutUser,
  getCurrentUser,
  setAvatar,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", isAuthenticated, getCurrentUser);
router.post("/set-avatar", isAuthenticated, setAvatar);
 // optional: protect this too with isAuthenticated

export default router;
