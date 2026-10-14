import express from "express";
import {
  uploadMaterial,
  getMaterialsByCourse,
  deleteMaterial,
  downloadMaterial,
} from "../controllers/material.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import upload from "../middlewares/uploadMiddleware";

const router = express.Router();

// Same visibility the old /uploads static route had: the link is only handed
// out on the course page and the id is not guessable.
router.get("/file/:id", downloadMaterial);

router.post(
  "/:courseId",
  authenticate,
  authorize(["lecturer"]),
  upload.single("file"),
  uploadMaterial
);
router.get("/:courseId", authenticate, getMaterialsByCourse);
router.delete(
  "/:id",
  authenticate,
  authorize(["lecturer", "admin"]),
  deleteMaterial
);

export default router;
