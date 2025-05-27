import { RequestHandler } from "express";
import { Material } from "../models/Material";
import { Course } from "../models/Course";
import { sendResponse } from "../utils/responseHandler";

export const uploadMaterial: RequestHandler = async (req, res) => {
  try {
    const { courseId } = req.params;
    const file = req.file;
    if (!file) {
      sendResponse(res, 400, false, "No file uploaded", null);
      return;
    }

    const material = new Material({
      title: req.body.title,
      fileUrl: req.file?.path,
      courseId,
      uploadedBy: req.user?.userId,
    });

    await material.save();

    // Update the course to include the new material
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { materials: material._id },
    });

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

export const deleteMaterial: RequestHandler = async (req, res) => {
  try {
    const materialId = req.params.id;

    // Find and delete the material
    const material = await Material.findByIdAndDelete(materialId);
    if (!material) {
      sendResponse(res, 404, false, "Material not found", null);
      return;
    }

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
