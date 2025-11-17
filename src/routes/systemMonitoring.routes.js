import express from "express";
import {
  getSystemStats,
  searchSystemData,
} from "../controllers/systemMonitoring.controller.js";
import { authorizeRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authorizeRole("admin"));

router.get("/stats", getSystemStats);
router.get("/search", searchSystemData);

export default router;
