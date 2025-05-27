import mongoose from "mongoose";
import { User } from "../models/User";
import dotenv from "dotenv";
import { hashPassword } from "./auth";

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    hashPassword;

    const hashedPassword = await hashPassword("password");

    const adminUser = new User({
      name: "Admin",
      email: "admin@campusconnect.com",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser();
