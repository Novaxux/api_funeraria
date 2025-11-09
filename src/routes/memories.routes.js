import express from "express";
import { createMemory, editMemory, getMemories } from "../controllers/memories.controller.js";

const router = express.Router();

router.get("/", getMemories);
router.post("/add", createMemory);
router.patch("/edit", editMemory);

export default router;
