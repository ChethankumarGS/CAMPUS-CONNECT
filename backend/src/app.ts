import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import courseRoutes from "./routes/course.routes";
import materialRoutes from "./routes/material.routes";
import aiRoutes from "./routes/ai.routes";

dotenv.config();

let dbPromise: Promise<typeof mongoose> | null = null;
const connectDb = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose);
  if (!dbPromise) {
    dbPromise = mongoose.connect(process.env.MONGODB_URI as string).catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
};

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Campus connect Backend API",
  });
});

// Middleware
const allowedOrigins = [
  /^http:\/\/localhost:\d+$/,
  process.env.FRONTEND_URL || "https://department-ms.vercel.app",
];

app.use(
  cors({
    origin: (origin: string, callback: (arg0: Error, arg1: boolean) => any) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is allowed
      const isAllowed = allowedOrigins.some((allowedOrigin) =>
        allowedOrigin instanceof RegExp
          ? allowedOrigin.test(origin)
          : allowedOrigin === origin
      );

      if (isAllowed) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Make sure MongoDB is connected before any route runs. On serverless hosts
// the process can start cold on every request, so the connection is cached.
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    res.status(500).json({ success: false, message: "Database unavailable" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/ai", aiRoutes);

// Upload errors (too big, wrong type) come back as JSON instead of a stack trace
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "File is too large (max 4MB)"
          : err.message;
      res.status(400).json({ success: false, message, data: null });
      return;
    }
    if (err.message === "Invalid file type") {
      res.status(400).json({ success: false, message: err.message, data: null });
      return;
    }
    next(err);
  }
);

const port = process.env.PORT || 4000;
// On Vercel the platform calls the exported app itself, no listening needed.
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
  });
}

export default app;
