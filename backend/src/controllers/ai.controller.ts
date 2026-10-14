import { RequestHandler } from "express";
import { Course } from "../models/Course";
import { Material } from "../models/Material";
import { MaterialChunk } from "../models/MaterialChunk";
import { sendResponse } from "../utils/responseHandler";
import { embedTexts, generate, isAiConfigured } from "../services/ai/gemini";
import { topK } from "../services/ai/retrieval";
import { indexMaterial } from "../services/ai/indexer";

// Students must be enrolled, lecturers must own the course, admins see all.
const canAccessCourse = async (courseId: string, user?: { userId: string; role: string }) => {
  if (!user) return false;
  const course = await Course.findById(courseId);
  if (!course) return false;
  if (user.role === "admin") return true;
  if (user.role === "lecturer") return String(course.lecturer) === user.userId;
  return course.students.some((s) => String(s) === user.userId);
};

export const askCourse: RequestHandler = async (req, res) => {
  try {
    if (!isAiConfigured()) {
      sendResponse(res, 503, false, "AI features are not configured", null);
      return;
    }
    const { courseId } = req.params;
    const question = String(req.body.question || "").trim();
    if (!question || question.length > 500) {
      sendResponse(res, 400, false, "Question must be 1-500 characters", null);
      return;
    }
    if (!(await canAccessCourse(courseId, req.user))) {
      sendResponse(res, 403, false, "You don't have access to this course", null);
      return;
    }

    const chunks = await MaterialChunk.find({ courseId }).lean();
    if (chunks.length === 0) {
      sendResponse(res, 200, true, "No indexed materials yet", {
        answer: "There are no readable materials for this course yet, so I can't answer from them.",
        sources: [],
      });
      return;
    }

    const [queryVector] = await embedTexts([question], "RETRIEVAL_QUERY");
    const best = topK(queryVector, chunks, 5);
    if (best.length === 0) {
      sendResponse(res, 200, true, "No relevant passages", {
        answer: "I couldn't find anything about that in this course's materials.",
        sources: [],
      });
      return;
    }

    const materials = await Material.find({
      _id: { $in: best.map((b) => b.item.materialId) },
    }).select("title");
    const titleById = new Map(materials.map((m) => [String(m._id), m.title]));

    const context = best
      .map((b, i) => `[${i + 1}] (${titleById.get(String(b.item.materialId))})\n${b.item.text}`)
      .join("\n\n");

    const answer = await generate(
      `Course material excerpts:\n\n${context}\n\nQuestion: ${question}`,
      {
        system:
          "You are a teaching assistant for a university course. Answer using only the excerpts provided. " +
          "Cite the excerpts you used like [1] or [2]. If the excerpts don't contain the answer, say so plainly. Keep it concise.",
      }
    );

    sendResponse(res, 200, true, "OK", {
      answer,
      sources: best.map((b, i) => ({
        ref: i + 1,
        materialId: b.item.materialId,
        title: titleById.get(String(b.item.materialId)),
        snippet: b.item.text.slice(0, 200),
        score: Number(b.score.toFixed(3)),
      })),
    });
  } catch (error) {
    console.error("askCourse failed", error);
    sendResponse(res, 500, false, `Failed to get an answer: ${String((error as Error)?.message || error).slice(0, 160)}`, null);
  }
};

const MAX_STUDY_CHARS = 30000;

export const generateStudyKit: RequestHandler = async (req, res) => {
  try {
    if (!isAiConfigured()) {
      sendResponse(res, 503, false, "AI features are not configured", null);
      return;
    }
    const material = await Material.findById(req.params.id);
    if (!material) {
      sendResponse(res, 404, false, "Material not found", null);
      return;
    }
    if (!(await canAccessCourse(String(material.courseId), req.user))) {
      sendResponse(res, 403, false, "You don't have access to this course", null);
      return;
    }

    let chunks = await MaterialChunk.find({ materialId: material._id }).sort({ index: 1 });
    if (chunks.length === 0) {
      // maybe the background indexing hasn't run yet or failed; try once now
      await indexMaterial(String(material._id));
      chunks = await MaterialChunk.find({ materialId: material._id }).sort({ index: 1 });
    }
    if (chunks.length === 0) {
      sendResponse(res, 422, false, "This file has no readable text (PDF and DOCX are supported)", null);
      return;
    }

    const text = chunks.map((c) => c.text).join("\n").slice(0, MAX_STUDY_CHARS);
    const raw = await generate(
      `Material title: ${material.title}\n\nContent:\n${text}\n\n` +
        `Write a short summary (4-6 sentences) and 8 multiple choice questions that test the main ideas. ` +
        `Respond as JSON: {"summary": string, "quiz": [{"question": string, "options": [4 strings], "answerIndex": 0-3, "explanation": string}]}`,
      { json: true }
    );

    const kit = parseStudyKit(raw);
    if (!kit) {
      sendResponse(res, 502, false, "The AI returned an unusable response, try again", null);
      return;
    }

    material.studyKit = { ...kit, generatedAt: new Date() };
    await material.save();
    sendResponse(res, 200, true, "Study kit generated", material.studyKit);
  } catch (error) {
    console.error("generateStudyKit failed", error);
    sendResponse(res, 500, false, "Failed to generate study kit", null);
  }
};

export const getStudyKit: RequestHandler = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      sendResponse(res, 404, false, "Material not found", null);
      return;
    }
    if (!(await canAccessCourse(String(material.courseId), req.user))) {
      sendResponse(res, 403, false, "You don't have access to this course", null);
      return;
    }
    sendResponse(res, 200, true, "OK", material.studyKit || null);
  } catch (error) {
    sendResponse(res, 500, false, "Failed to fetch study kit", null);
  }
};

// Models sometimes wrap JSON in code fences or return a bad option count, so
// validate before saving anything.
export const parseStudyKit = (raw: string) => {
  try {
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    const data = JSON.parse(cleaned);
    if (typeof data.summary !== "string" || !Array.isArray(data.quiz)) return null;
    const quiz = data.quiz.filter(
      (q: any) =>
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        Number.isInteger(q.answerIndex) &&
        q.answerIndex >= 0 &&
        q.answerIndex < 4
    );
    if (quiz.length === 0) return null;
    return {
      summary: data.summary,
      quiz: quiz.map((q: any) => ({
        question: q.question,
        options: q.options.map(String),
        answerIndex: q.answerIndex,
        explanation: String(q.explanation || ""),
      })),
    };
  } catch {
    return null;
  }
};
