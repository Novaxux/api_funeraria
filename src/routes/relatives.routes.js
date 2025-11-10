import express from "express";
import {
  addRelative,
  removeRelative,
  getRelatives,
  getRelativeById,
  editRelative,
} from "../controllers/relatives.controller.js";

const router = express.Router();

router.patch("/edit", editRelative);
router.get("/", getRelatives);
router.get("/:id", getRelativeById);
router.post("/add", addRelative);
router.delete("/remove", removeRelative);

export default router;
