import usuariosRoutes from "./users.routes.js";
import relativesRoutes from "./relatives.routes.js";
import { Router } from "express";

const router = Router();
router.use("/users", usuariosRoutes);
router.use("/relatives", relativesRoutes);

export default router;
