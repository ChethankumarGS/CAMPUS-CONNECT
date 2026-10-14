// Splits plain text into overlapping chunks so each one fits comfortably
// in an embedding request and keeps a bit of context from its neighbour.
export const chunkText = (
  text: string,
  maxChars = 1000,
  overlap = 150
): string[] => {
  const clean = text.replace(/\r/g, "").replace(/[ \t]+/g, " ").trim();
  if (!clean) return [];

  const paragraphs = clean.split(/\n{2,}/).map((p) => p.replace(/\n/g, " ").trim());
  const chunks: string[] = [];
  let current = "";

  const push = () => {
    if (current.trim()) chunks.push(current.trim());
  };

  for (const para of paragraphs) {
    if (!para) continue;

    // a single paragraph longer than the limit gets sliced by sentence/length
    if (para.length > maxChars) {
      push();
      current = "";
      let start = 0;
      while (start < para.length) {
        const end = Math.min(start + maxChars, para.length);
        chunks.push(para.slice(start, end).trim());
        if (end === para.length) break;
        start = end - overlap;
      }
      continue;
    }

    if ((current + " " + para).length > maxChars) {
      push();
      // carry the tail of the previous chunk forward
      current = current.slice(-overlap) + " " + para;
    } else {
      current = current ? current + " " + para : para;
    }
  }
  push();
  return chunks;
};
