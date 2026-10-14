import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

// Returns the readable text of an uploaded file, or "" if we can't read that
// format (old .doc / .ppt / .pptx are skipped for now).
export const extractText = async (
  buffer: Buffer,
  filename: string
): Promise<string> => {
  const ext = path.extname(filename).toLowerCase();

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
