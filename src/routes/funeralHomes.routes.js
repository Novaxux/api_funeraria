import express from "express";
import {
  registerFuneralHome,
  getFuneralHomes,
  getFunerariaById,
} from "../controllers/funeralHomes.controller.js";
import { authorizeRole } from "../middleware/auth.middleware.js";
import funeralHomePermissionsRoutes from "./funeralHomePermissions.routes.js";

const router = express.Router();

router.use(authorizeRole("admin"));
router.use("/permissions", funeralHomePermissionsRoutes);

router.get("/", getFuneralHomes);
router.post("/register", registerFuneralHome);
router.get("/:id", getFunerariaById);

export default router;
