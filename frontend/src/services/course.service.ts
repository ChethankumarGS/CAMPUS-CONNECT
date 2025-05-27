import axios from "../lib/axios";
import {
  Course,
  CreateCourseData,
  UpdateCourseData,
  CourseWithDetails,
} from "../types/course";
import { ApiResponse, QueryParams } from "../types/api";
import { User } from "@/types/user";

export const courseService = {
  getAllCourses: async (
    params?: QueryParams
  ): Promise<ApiResponse<Course[]>> => {
    const response = await axios.get("/courses", { params });
    return response.data;
  },

  getLecturerCourses: async (
    lecturerId: string,
    params?: QueryParams
  ): Promise<ApiResponse<Course[]>> => {
    const response = await axios.get(`/courses/lecturer/${lecturerId}`, {
      params,
    });
    return response.data;
  },

  getCourseById: async (
    id: string
  ): Promise<ApiResponse<CourseWithDetails>> => {
    const response = await axios.get(`/courses/${id}`);
    return response.data;
  },

  getStudentsByCourse: async (
    courseId: string
  ): Promise<ApiResponse<User[]>> => {
    const response = await axios.get(`/courses/${courseId}/students`);
    return response.data;
  },

  getEnrolledCourses: async (): Promise<ApiResponse<Course[]>> => {
    const response = await axios.get("/courses/students");
    return response.data;
  },

  enrollStudent: async (courseId: string): Promise<ApiResponse<Course>> => {
    const response = await axios.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  disenrollStudent: async (courseId: string): Promise<ApiResponse<Course>> => {
    const response = await axios.delete(`/courses/${courseId}/disenroll`);
    return response.data;
  },

  createCourse: async (
    data: CreateCourseData
  ): Promise<ApiResponse<Course>> => {
    const response = await axios.post("/courses", data);
    return response.data;
  },

  updateCourse: async (
    id: string,
    data: UpdateCourseData
  ): Promise<ApiResponse<Course>> => {
    const response = await axios.put(`/courses/${id}`, data);
    return response.data;
  },

  deleteCourse: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`/courses/${id}`);
    return response.data;
  },
};
