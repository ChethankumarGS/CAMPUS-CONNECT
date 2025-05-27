import { Course } from "./course";
import { User } from "./user";

export interface Material {
  _id: string;
  title: string;
  fileUrl: string;
  courseId: string | Course; // Can be either ID or populated course object
  uploadedBy: string | User; // Can be either ID or populated user object
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialData {
  title: string;
  file: File;
  courseId: string;
}

export interface MaterialWithDetails extends Material {
  courseId: Course;
  uploadedBy: User;
}
