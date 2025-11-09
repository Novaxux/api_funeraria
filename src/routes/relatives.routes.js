import express from "express";
import {
  addRelative,
  removeRelative,
  getRelatives,
} from "../controllers/relatives.controller.js";

const router = express.Router();

router.get("/", getRelatives);
router.post("/add", addRelative);
router.delete("/remove", removeRelative);

export default router;
