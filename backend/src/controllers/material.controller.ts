import { RequestHandler } from "express";
import { Material } from "../models/Material";
import { Course } from "../models/Course";
import mongoose from "mongoose";
import { MaterialChunk } from "../models/MaterialChunk";
import { saveFile, streamFile, deleteFile } from "../services/fileStorage";
import { indexMaterial } from "../services/ai/indexer";
import { sendResponse } from "../utils/responseHandler";

export const uploadMaterial: RequestHandler = async (req, res) => {
  try {
    const { courseId } = req.params;
    const file = req.file;
    if (!file) {
      sendResponse(res, 400, false, "No file uploaded", null);
      return;
    }

    const _id = new mongoose.Types.ObjectId();
    const fileId = await saveFile(file.buffer, file.originalname, file.mimetype);

    const material = new Material({
      _id,
      title: req.body.title,
      fileUrl: `/api/materials/file/${_id}`,
      fileId: String(fileId),
      fileName: file.originalname,
      courseId,
      uploadedBy: req.user?.userId,
    });

    await material.save();

    // Update the course to include the new material
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { materials: material._id },
    });

    // build the AI search index before responding (a serverless function can
    // be frozen once the response is sent). Failures are recorded on the
    // material and don't fail the upload.
    await indexMaterial(String(material._id), file.buffer);

    sendResponse(res, 201, true, "Material uploaded successfully", material);
  } catch (error) {
    sendResponse(res, 500, false, "Failed to upload material", null);
  }
};

export const getMaterialsByCourse: RequestHandler = async (req, res) => {
  try {
    const { courseId } = req.params;
    const materials = await Material.find({ courseId });
    sendResponse(res, 200, true, "Materials fetched successfully", materials);
  } catch (error) {
    sendResponse(res, 500, false, "Failed to fetch materials", null);
  }
};

export const downloadMaterial: RequestHandler = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material || !material.fileId) {
      sendResponse(res, 404, false, "File not found", null);
      return;
    }
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(material.fileName || material.title)}"`
    );
    streamFile(material.fileId)
      .on("error", () => res.status(404).end())
      .pipe(res);
  } catch (error) {
    sendResponse(res, 500, false, "Failed to download file", null);
  }
};

export const deleteMaterial: RequestHandler = async (req, res) => {
  try {
    const materialId = req.params.id;

    // Find and delete the material
    const material = await Material.findByIdAndDelete(materialId);
    if (!material) {
      sendResponse(res, 404, false, "Material not found", null);
      return;
    }

    await MaterialChunk.deleteMany({ materialId });
    if (material.fileId) await deleteFile(material.fileId);

    // Update the course to remove the deleted material
    await Course.findByIdAndUpdate(material.courseId, {
      $pull: { materials: materialId },
    });

    sendResponse(res, 200, true, "Material deleted successfully", null);
    return;
  } catch (error) {
    console.error("Error deleting material:", error);
    sendResponse(res, 500, false, "Material deleted successfully", null);
    return;
  }
};
