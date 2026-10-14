import mongoose from "mongoose";

// Thin wrapper around GridFS so uploaded files live in MongoDB instead of the
// local disk (serverless hosts have no writable, persistent disk).
const bucket = () =>
  new mongoose.mongo.GridFSBucket(mongoose.connection.db as mongoose.mongo.Db, {
    bucketName: "materials",
  });

export const saveFile = (
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<mongoose.Types.ObjectId> =>
  new Promise((resolve, reject) => {
    const stream = bucket().openUploadStream(filename, {
      metadata: { mimeType },
    });
    stream.on("error", reject);
    stream.on("finish", () => resolve(stream.id as mongoose.Types.ObjectId));
    stream.end(buffer);
  });

export const readFile = async (id: string): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of bucket().openDownloadStream(
    new mongoose.Types.ObjectId(id)
  )) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
};

export const streamFile = (id: string) =>
  bucket().openDownloadStream(new mongoose.Types.ObjectId(id));

export const deleteFile = async (id: string) => {
  try {
    await bucket().delete(new mongoose.Types.ObjectId(id));
  } catch {
    // already gone, nothing to clean up
  }
};
