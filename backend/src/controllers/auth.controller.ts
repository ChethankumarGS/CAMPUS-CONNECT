import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../utils/responseHandler";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const registerUser: AsyncRequestHandler = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendResponse(res, 400, false, "User already exists", null);
      return;
    }

    // Hash the password and create the user
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    sendResponse(res, 201, false, "User registered successfully", null);
    return;
  } catch (error) {
    next(error);
  }
};

export const loginUser: AsyncRequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      sendResponse(res, 404, false, "User not found", null);
      return;
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      sendResponse(res, 401, false, "Invalid credentials", null);
      return;
    }

    const userObject = user.toObject();
    delete userObject.password;
    const token = generateToken(userObject);

    sendResponse(res, 200, true, "Login successful", {
      user: userObject,
      token,
    });
    return;
  } catch (error) {
    console.error("Login error:", error);
    return sendResponse(res, 500, false, "Login failed", null);
  }
};

export const verifyToken: AsyncRequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    sendResponse(res, 401, false, "No token provided", null);
    return;
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // Fetch the user from the database using the ID from the decoded token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      sendResponse(res, 404, false, "User not found", null);
      return;
    }

    // Return the user data
    sendResponse(res, 200, true, "User found", user);
    return;
  } catch (error) {
    sendResponse(res, 401, false, "Invalid token", null);
    return;
  }
};
