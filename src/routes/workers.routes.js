import express from "express";
import {
  registerWorker,
  listWorkers,
  updateWorker,
  deleteWorker,
  searchClients,
  updateClientStatus,
  getClientInfo,
} from "../controllers/workers.controller.js";

import { authorizeRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// Only funeral homes can manage workers
router.use(authorizeRole("funeral_home"));

// Worker CRUD
router.post("/register", registerWorker);
router.get("/", listWorkers);
router.patch("/:id_user", updateWorker);
router.delete("/:id_user", deleteWorker);

// Search clients
router.get("/clients/search", searchClients);

// Update alive → deceased
router.patch("/clients/:id_user/status", updateClientStatus);

// Get memories + relatives
router.get("/clients/:id_user/info", getClientInfo);

export default router;
