import express from "express";
import {
  getFuneralHomePermissions,
  updateFuneralHomePermission,
} from "../controllers/funeralHomePermissions.controller.js";
import { authorizeRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authorizeRole("admin"));

router.get("/:id_funeral_home", getFuneralHomePermissions);
router.patch("/update", updateFuneralHomePermission);

export default router;
