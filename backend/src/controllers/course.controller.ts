import { RequestHandler } from "express";
import { Course } from "../models/Course";
import { sendResponse } from "../utils/responseHandler";

export const createCourse: RequestHandler = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    sendResponse(res, 201, true, "Course created successfully", course);
    return;
  } catch (error) {
    sendResponse(res, 500, false, "Failed to create course", null);
    return;
  }
};

export const getCourses: RequestHandler = async (req, res) => {
  try {
    const courses = await Course.find().populate("lecturer", "name email");
    sendResponse(res, 200, true, "Courses fetched successfully", courses);
    return;
  } catch (error) {
    sendResponse(res, 500, false, "Failed to fetch courses", null);
    return;
  }
};

export const getLecturerCourses: RequestHandler = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const lecturerId = req.params.lecturerId;

    const courses = await Course.find({ lecturer: lecturerId })
      .populate("lecturer", "name email")
      .populate("materials")
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments({ lecturer: lecturerId });

    sendResponse(
      res,
      200,
      true,
      "Lecturer courses fetched successfully",
      courses
    );
    return;
  } catch (error) {
    next(error);
  }
};

export const getCourseById: RequestHandler = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      sendResponse(res, 404, false, "Course not found", null);
      return;
    }
    sendResponse(res, 200, true, "Course fetched successfully", course);
    return;
  } catch (error) {
    sendResponse(res, 500, false, "Failed to fetch course", null);
    return;
  }
};

export const updateCourse: RequestHandler = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) {
      sendResponse(res, 404, false, "Course not found", null);
      return;
    }
    sendResponse(res, 200, true, "Course updated successfully", course);
    return;
  } catch (error) {
    sendResponse(res, 500, false, "Failed to update course", null);
    return;
  }
};

export const deleteCourse: RequestHandler = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      sendResponse(res, 404, false, "Course not found", null);
      return;
    }
    sendResponse(res, 200, true, "Course deleted successfully", null);
    return;
  } catch (error) {
    sendResponse(res, 500, false, "Failed to delete course", null);
    return;
  }
};

export const getStudentsByCourse: RequestHandler = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId).populate("students");
    if (!course) {
      sendResponse(res, 404, false, "Course not found", null);
      return;
    }
    sendResponse(
      res,
      200,
      true,
      "Students fetched successfully",
      course.students
    );
    return;
  } catch (error) {
    sendResponse(res, 500, false, "Failed to fetch students", null);
    return;
  }
};

export const fetchStudentCourses: RequestHandler = async (req, res) => {
  const studentId = req.user?.userId;

  if (!studentId) {
    sendResponse(res, 401, false, "Unauthorized", null);
    return;
  }

  try {
    const enrolledCourses = await Course.find({ students: studentId })
      .populate("lecturer", "name email")
      .lean();

    if (!enrolledCourses.length) {
      sendResponse(res, 404, false, "No courses found for this student", null);
      return;
    }

    sendResponse(
      res,
      200,
      true,
      "Student Courses retrieve successfully",
      enrolledCourses
    );
    return;
  } catch (error) {
    console.error("Error fetching student courses:", error);
    sendResponse(res, 500, false, "Internal Server Error", null);
    return;
  }
};

export const enrollStudent: RequestHandler = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.userId;

  try {
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { students: studentId } },
      { new: true }
    ).populate("lecturer", "name email");

    if (!course) {
      sendResponse(res, 404, false, "Course not found", null);
      return;
    }
    sendResponse(res, 200, true, "Student enrolled successfully", course);
    return;
  } catch (error) {
    sendResponse(res, 500, false, "Failed to enroll student", null);
    return;
  }
};

export const disenrollStudent: RequestHandler = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.userId;

  try {
    // Find the course and update the students array
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { students: studentId } },
      { new: true } // Return the updated course
    ).populate("lecturer", "name email");

    if (!course) {
      sendResponse(res, 404, true, "Course not found", null);
      return;
    }

    sendResponse(res, 200, true, "Disenroll Successfull", course);
    return;
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, true, "Failed to disenroll student", null);
    return;
  }
};
