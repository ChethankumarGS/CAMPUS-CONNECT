"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../controllers/course.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin", "lecturer"]), course_controller_1.createCourse);
router.get("/", auth_middleware_1.authenticate, course_controller_1.getCourses);
router.get("/lecturer/:lecturerId", auth_middleware_1.authenticate, course_controller_1.getLecturerCourses);
router.get("/students", auth_middleware_1.authenticate, course_controller_1.fetchStudentCourses);
router.get("/:id", auth_middleware_1.authenticate, course_controller_1.getCourseById);
router.get("/:courseId/students", auth_middleware_1.authenticate, course_controller_1.getStudentsByCourse);
router.post("/:courseId/enroll", auth_middleware_1.authenticate, course_controller_1.enrollStudent);
router.delete("/:courseId/disenroll", auth_middleware_1.authenticate, course_controller_1.disenrollStudent);
router.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin", "lecturer"]), course_controller_1.updateCourse);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), course_controller_1.deleteCourse);
exports.default = router;
//# sourceMappingURL=course.routes.js.map