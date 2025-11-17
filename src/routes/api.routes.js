import usuariosRoutes from "./users.routes.js";
import relativesRoutes from "./relatives.routes.js";
import memoriesRoutes from "./memories.routes.js";
import funeralHomesRoutes from "./funeralHomes.routes.js";
import systemMonitoringRoutes from "./systemMonitoring.routes.js";
import workersRoutes from "./workers.routes.js";
import { Router } from "express";

const router = Router();
router.use("/users", usuariosRoutes);
router.use("/relatives", relativesRoutes);
router.use("/memories", memoriesRoutes);
router.use("/funeral-homes", funeralHomesRoutes);
router.use("/monitoring", systemMonitoringRoutes);
router.use("/workers", workersRoutes);

export default router;
