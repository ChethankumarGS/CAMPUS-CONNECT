import mongoose, { Schema, Document } from "mongoose";

export interface IMaterialChunk extends Document {
  materialId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
  index: number;
  text: string;
  embedding: number[];
}

const materialChunkSchema = new Schema({
  materialId: { type: Schema.Types.ObjectId, ref: "Material", required: true, index: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  index: { type: Number, required: true },
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
});

export const MaterialChunk = mongoose.model<IMaterialChunk>(
  "MaterialChunk",
  materialChunkSchema
);
