import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/responseHandler";

// Simple in-memory limiter so one user can't burn through the free API quota.
// Resets on server restart, which is fine for a single instance.
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;
const hits = new Map<string, number[]>();

const rateLimitAi = (req: Request, res: Response, next: NextFunction) => {
  const key = req.user?.userId || req.ip || "anon";
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    sendResponse(res, 429, false, "Too many AI requests, wait a minute", null);
    return;
  }
  recent.push(now);
  hits.set(key, recent);
  next();
};

export default rateLimitAi;
