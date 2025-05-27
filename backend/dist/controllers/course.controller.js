"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disenrollStudent = exports.enrollStudent = exports.fetchStudentCourses = exports.getStudentsByCourse = exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.getLecturerCourses = exports.getCourses = exports.createCourse = void 0;
const Course_1 = require("../models/Course");
const responseHandler_1 = require("../utils/responseHandler");
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = new Course_1.Course(req.body);
        yield course.save();
        (0, responseHandler_1.sendResponse)(res, 201, true, "Course created successfully", course);
        return;
    }
    catch (error) {
        (0, responseHandler_1.sendResponse)(res, 500, false, "Failed to create course", null);
        return;
    }
});
exports.createCourse = createCourse;
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield Course_1.Course.find().populate("lecturer", "name email");
        (0, responseHandler_1.sendResponse)(res, 200, true, "Courses fetched successfully", courses);
        return;
    }
    catch (error) {
        (0, responseHandler_1.sendResponse)(res, 500, false, "Failed to fetch courses", null);
        return;
    }
});
exports.getCourses = getCourses;
const getLecturerCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10 } = req.query;
        const lecturerId = req.params.lecturerId;
        const courses = yield Course_1.Course.find({ lecturer: lecturerId })
            .populate("lecturer", "name email")
            .populate("materials")
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .sort({ createdAt: -1 });
        const total = yield Course_1.Course.countDocuments({ lecturer: lecturerId });
        (0, responseHandler_1.sendResponse)(res, 200, true, "Lecturer courses fetched successfully", courses);
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getLecturerCourses = getLecturerCourses;
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield Course_1.Course.findById(req.params.id);
        if (!course) {
            (0, responseHandler_1.sendResponse)(res, 404, false, "Course not found", null);
            return;
        }
        (0, responseHandler_1.sendResponse)(res, 200, true, "Course fetched successfully", course);
        return;
    }
    catch (error) {
        (0, responseHandler_1.sendResponse)(res, 500, false, "Failed to fetch course", null);
        return;
    }
});
exports.getCourseById = getCourseById;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield Course_1.Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!course) {
            (0, responseHandler_1.sendResponse)(res, 404, false, "Course not found", null);
            return;
        }
        (0, responseHandler_1.sendResponse)(res, 200, true, "Course updated successfully", course);
        return;
    }
    catch (error) {
        (0, responseHandler_1.sendResponse)(res, 500, false, "Failed to update course", null);
        return;
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield Course_1.Course.findByIdAndDelete(req.params.id);
        if (!course) {
            (0, responseHandler_1.sendResponse)(res, 404, false, "Course not found", null);
            return;
        }
        (0, responseHandler_1.sendResponse)(res, 200, true, "Course deleted successfully", null);
        return;
    }
    catch (error) {
        (0, responseHandler_1.sendResponse)(res, 500, false, "Failed to delete course", null);
        return;
    }
});
exports.deleteCourse = deleteCourse;
const getStudentsByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    try {
        const course = yield Course_1.Course.findById(courseId).populate("students");
        if (!course) {
            (0, responseHandler_1.sendResponse)(res, 404, false, "Course not found", null);
            return;
        }
        (0, responseHandler_1.sendResponse)(res, 200, true, "Students fetched successfully", course.students);
        return;
    }
    catch (error) {
        (0, responseHandler_1.sendResponse)(res, 500, false, "Failed to fetch students", null);
        return;
    }
});
exports.getStudentsByCourse = getStudentsByCourse;
const fetchStudentCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!studentId) {
        (0, responseHandler_1.sendResponse)(res, 401, false, "Unauthorized", null);
        return;
    }
    try {
        const enrolledCourses = yield Course_1.Course.find({ students: studentId })
            .populate("lecturer", "name email")
            .lean();
        if (!enrolledCourses.length) {
            (0, responseHandler_1.sendResponse)(res, 404, false, "No courses found for this student", null);
            return;
        }
        (0, responseHandler_1.sendResponse)(res, 200, true, "Student Courses retrieve successfully", enrolledCourses);
        return;
    }
    catch (error) {
        console.error("Error fetching student courses:", error);
        (0, responseHandler_1.sendResponse)(res, 500, false, "Internal Server Error", null);
        return;
    }
});
exports.fetchStudentCourses = fetchStudentCourses;
const enrollStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const studentId = req.user.userId;
    try {
        const course = yield Course_1.Course.findByIdAndUpdate(courseId, { $addToSet: { students: studentId } }, { new: true }).populate("lecturer", "name email");
        if (!course) {
            (0, responseHandler_1.sendResponse)(res, 404, false, "Course not found", null);
            return;
        }
        (0, responseHandler_1.sendResponse)(res, 200, true, "Student enrolled successfully", course);
        return;
    }
    catch (error) {
        (0, responseHandler_1.sendResponse)(res, 500, false, "Failed to enroll student", null);
        return;
    }
});
exports.enrollStudent = enrollStudent;
const disenrollStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const studentId = req.user.userId;
    try {
        // Find the course and update the students array
        const course = yield Course_1.Course.findByIdAndUpdate(courseId, { $pull: { students: studentId } }, { new: true } // Return the updated course
        ).populate("lecturer", "name email");
        if (!course) {
            (0, responseHandler_1.sendResponse)(res, 404, true, "Course not found", null);
            return;
        }
        (0, responseHandler_1.sendResponse)(res, 200, true, "Disenroll Successfull", course);
        return;
    }
    catch (error) {
        console.log(error);
        (0, responseHandler_1.sendResponse)(res, 500, true, "Failed to disenroll student", null);
        return;
    }
});
exports.disenrollStudent = disenrollStudent;
//# sourceMappingURL=course.controller.js.map