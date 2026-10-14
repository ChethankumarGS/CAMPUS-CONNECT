import mongoose, { Schema, Document } from "mongoose";
import { Course } from "./Course";
import { User } from "./User";

export interface IMaterial extends Document {
  title: string;
  fileUrl: string;
  courseId: Schema.Types.ObjectId | typeof Course;
  uploadedBy: Schema.Types.ObjectId | typeof User;
  indexStatus?: "pending" | "indexed" | "unsupported" | "failed";
  studyKit?: {
    summary: string;
    quiz: { question: string; options: string[]; answerIndex: number; explanation: string }[];
    generatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const materialSchema = new Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    indexStatus: {
      type: String,
      enum: ["pending", "indexed", "unsupported", "failed"],
    },
    studyKit: {
      summary: String,
      quiz: [
        {
          question: String,
          options: [String],
          answerIndex: Number,
          explanation: String,
        },
      ],
      generatedAt: Date,
    },
  },
  { timestamps: true }
);

export const Material = mongoose.model<IMaterial>("Material", materialSchema);
