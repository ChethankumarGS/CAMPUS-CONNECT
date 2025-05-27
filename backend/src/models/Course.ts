import mongoose, { Schema, Document } from "mongoose";
import { User } from "./User";
import { Material } from "./Material";

export interface ICourse extends Document {
  title: string;
  courseCode: string;
  description: string;
  lecturer: Schema.Types.ObjectId | typeof User;
  students: (Schema.Types.ObjectId | typeof User)[];
  materials: (Schema.Types.ObjectId | typeof Material)[];
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    lecturer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    materials: [{ type: Schema.Types.ObjectId, ref: "Material" }],
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>("Course", courseSchema);
