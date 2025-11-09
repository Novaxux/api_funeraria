import usuariosRoutes from "./users.routes.js";
import { Router } from "express";

const router = Router();

router.use("/users", usuariosRoutes);

export default router;
