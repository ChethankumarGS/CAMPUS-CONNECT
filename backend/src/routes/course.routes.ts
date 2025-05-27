import express from "express";
import {
  createCourse,
  getCourses,
  getLecturerCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getStudentsByCourse,
  enrollStudent,
  disenrollStudent,
  fetchStudentCourses,
} from "../controllers/course.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authenticate, authorize(["admin", "lecturer"]), createCourse);
router.get("/", authenticate, getCourses);
router.get("/lecturer/:lecturerId", authenticate, getLecturerCourses);
router.get("/students", authenticate, fetchStudentCourses);
router.get("/:id", authenticate, getCourseById);
router.get("/:courseId/students", authenticate, getStudentsByCourse);
router.post("/:courseId/enroll", authenticate, enrollStudent);
router.delete("/:courseId/disenroll", authenticate, disenrollStudent);
router.put(
  "/:id",
  authenticate,
  authorize(["admin", "lecturer"]),
  updateCourse
);
router.delete("/:id", authenticate, authorize(["admin"]), deleteCourse);

export default router;
