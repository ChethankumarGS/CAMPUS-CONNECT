import express from "express";
import rateLimitAi from "../middlewares/aiRateLimit";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
  askCourse,
  generateStudyKit,
  getStudyKit,
} from "../controllers/ai.controller";

const router = express.Router();

router.post("/courses/:courseId/ask", authenticate, rateLimitAi, askCourse);
router.get("/materials/:id/study-kit", authenticate, getStudyKit);
router.post(
  "/materials/:id/study-kit",
  authenticate,
  authorize(["lecturer", "admin"]),
  rateLimitAi,
  generateStudyKit
);

export default router;
