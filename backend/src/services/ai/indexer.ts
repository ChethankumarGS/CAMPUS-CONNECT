import { Material } from "../../models/Material";
import { MaterialChunk } from "../../models/MaterialChunk";
import { chunkText } from "./chunker";
import { extractText } from "./extractText";
import { embedTexts, isAiConfigured } from "./gemini";

// Reads an uploaded file, splits it up and stores an embedding per chunk.
// Runs in the background after upload so the lecturer isn't kept waiting.
export const indexMaterial = async (materialId: string) => {
  const material = await Material.findById(materialId);
  if (!material) return;

  try {
    if (!isAiConfigured()) return;

    const text = await extractText(material.fileUrl);
    const chunks = chunkText(text);
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
