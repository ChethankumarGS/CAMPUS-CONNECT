import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

// Returns the readable text of an uploaded material, or "" if we can't read
// that format (old .doc / .ppt / .pptx are skipped for now).
export const extractText = async (filePath: string): Promise<string> => {
  const ext = path.extname(filePath).toLowerCase();
  const buffer = await fs.readFile(filePath);

  if (ext === ".pdf") {
    const parsed = await pdfParse(buffer);
    return parsed.text || "";
  }
  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }
  return "";
};
