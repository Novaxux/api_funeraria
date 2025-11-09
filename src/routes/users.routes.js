import express from "express";
import {
  signup,
  login,
  logout,
  updateUser,
} from "../controllers/users.controller.js";
import { requireAuth, attachUser } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.patch("/update", requireAuth, attachUser, updateUser);
export default router;
