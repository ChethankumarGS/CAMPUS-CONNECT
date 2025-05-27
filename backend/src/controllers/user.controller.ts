import { RequestHandler } from "express";
import { User } from "../models/User";
import { sendResponse } from "../utils/responseHandler";

export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    sendResponse(res, 200, true, "Users fetched successfully", users);
    return;
  } catch (error) {
    sendResponse(res, 500, false, "Failed to fetch users", null);
    return;
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      sendResponse(res, 404, false, "User not found", null);
      return;
    }
    sendResponse(res, 200, true, "User fetched successfully", user);
    return;
  } catch (error) {
    sendResponse(res, 500, false, "Failed to fetch user", null);
    return;
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    );

    if (!updatedUser) {
      sendResponse(res, 404, false, "User not found", null);
      return;
    }

    sendResponse(res, 200, true, "User successfully updated", updatedUser);
    return;
  } catch (error) {
    sendResponse(res, 500, false, "Server error", null);
    return;
  }
};
