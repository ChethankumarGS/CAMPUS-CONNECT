import { Material } from "@/types/material";
import { User } from "./user";

export interface Course {
  _id: string;
  title: string;
  courseCode: string;
  description: string;
  lecturer?: string | User;
  students?: string[] | User[];
  materials?: string[] | Material[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  courseCode: string;
  lecturer: string; // Lecturer ID
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  lecturer?: string;
}

export interface CourseWithDetails extends Course {
  lecturer: User;
  students: User[];
  materials: Material[];
}
