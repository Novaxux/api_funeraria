import express from "express";
import {
  createMemory,
  editMemory,
  getMemories,
} from "../controllers/memories.controller.js";
import { authorizeRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authorizeRole("cliente"));
router.get("/", getMemories);
router.post("/add", createMemory);
router.patch("/edit", editMemory);

export default router;
