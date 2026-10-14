// Thin wrapper over the Gemini REST API (free tier). We use plain fetch so
// there is no extra SDK to install.
const BASE = "https://generativelanguage.googleapis.com/v1beta";
const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || "gemini-embedding-001";
const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || "gemini-2.0-flash";
const EMBED_DIMS = 768;

const apiKey = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return key;
};

export const isAiConfigured = () => Boolean(process.env.GEMINI_API_KEY);

const post = async (url: string, body: unknown) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Gemini request failed (${res.status}): ${detail.slice(0, 300)}`);
  }
  return res.json() as Promise<any>;
};

export const embedTexts = async (
  texts: string[],
  taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY"
): Promise<number[][]> => {
  const out: number[][] = [];
  // batchEmbedContents accepts up to 100 items; stay well under it
  for (let i = 0; i < texts.length; i += 50) {
    const batch = texts.slice(i, i + 50);
    const data = await post(`${BASE}/models/${EMBED_MODEL}:batchEmbedContents`, {
      requests: batch.map((t) => ({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text: t }] },
        taskType,
        outputDimensionality: EMBED_DIMS,
      })),
    });
    for (const e of data.embeddings) out.push(normalize(e.values));
  }
  return out;
};

export const generate = async (
  prompt: string,
  opts: { system?: string; json?: boolean } = {}
): Promise<string> => {
  const data = await post(`${BASE}/models/${CHAT_MODEL}:generateContent`, {
    systemInstruction: opts.system
      ? { parts: [{ text: opts.system }] }
      : undefined,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: opts.json ? "application/json" : "text/plain",
    },
  });
  return data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") || "";
};

// Gemini only returns unit vectors for the full-size output, so we normalise
// the truncated ones ourselves. Then cosine similarity is just a dot product.
const normalize = (v: number[]) => {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / norm);
};
