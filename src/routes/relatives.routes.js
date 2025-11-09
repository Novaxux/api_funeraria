import express from "express";
import {
  addRelative,
  removeRelative,
} from "../controllers/relatives.controller.js";

const router = express.Router();

router.post("/add", addRelative);
router.delete("/remove", removeRelative);

export default router;
