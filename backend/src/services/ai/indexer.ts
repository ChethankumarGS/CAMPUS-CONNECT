import { Material } from "../../models/Material";
import { MaterialChunk } from "../../models/MaterialChunk";
import { chunkText } from "./chunker";
import { extractText } from "./extractText";
import { readFile } from "../fileStorage";
import { embedTexts, isAiConfigured } from "./gemini";

// Reads an uploaded file, splits it up and stores an embedding per chunk.
// The upload handler waits for this: serverless functions can be frozen as
// soon as the response goes out, so background work isn't reliable there.
// Cap on chunks per file so one huge upload can't burn the free API quota.
const MAX_CHUNKS = 150;

export const indexMaterial = async (materialId: string, file?: Buffer) => {
  const material = await Material.findById(materialId);
  if (!material) return;

  try {
    if (!isAiConfigured()) return;

    if (!material.fileId && !file) return;
    const buffer = file || (await readFile(material.fileId as string));
    const text = await extractText(buffer, material.fileName || material.title);
    const chunks = chunkText(text).slice(0, MAX_CHUNKS);
    if (chunks.length === 0) {
      material.indexStatus = "unsupported";
      await material.save();
      return;
    }

    const embeddings = await embedTexts(chunks, "RETRIEVAL_DOCUMENT");

    await MaterialChunk.deleteMany({ materialId: material._id });
    await MaterialChunk.insertMany(
      chunks.map((text, index) => ({
        materialId: material._id,
        courseId: material.courseId,
        index,
        text,
        embedding: embeddings[index],
      }))
    );
    material.indexStatus = "indexed";
    await material.save();
  } catch (error) {
    console.error("Failed to index material", materialId, error);
    material.indexStatus = "failed";
    await material.save();
  }
};
