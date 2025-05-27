import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User";
import { Course } from "../models/Course";
import { Material } from "../models/Material";

dotenv.config();

const clearDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");

    console.log("Clearing Users...");
    await User.deleteMany({});
    console.log("All users cleared.");

    console.log("Clearing Courses...");
    await Course.deleteMany({});
    console.log("All courses cleared.");

    console.log("Clearing Materials...");
    await Material.deleteMany({});
    console.log("All materials cleared.");

    console.log("Database cleared successfully.");
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

clearDatabase();
