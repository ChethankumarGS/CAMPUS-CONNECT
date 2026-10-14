import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { isAiConfigured, transcribePdf } from "./gemini";

// Returns the readable text of an uploaded file, or "" if we can't read that
// format (old .doc / .ppt / .pptx are skipped for now).
export const extractText = async (
  buffer: Buffer,
  filename: string
): Promise<string> => {
  const ext = path.extname(filename).toLowerCase();

  if (ext === ".pdf") {
    try {
      const parsed = await pdfParse(buffer);
      if (parsed.text && parsed.text.trim()) return parsed.text;
    } catch (err) {
      console.warn("pdf-parse failed, falling back to Gemini", err);
    }
    return isAiConfigured() ? transcribePdf(buffer) : "";
  }
  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }
  return "";
};
