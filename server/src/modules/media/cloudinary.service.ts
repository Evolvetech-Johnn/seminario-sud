import { v2 as cloudinary } from "cloudinary";

import { env } from "../../config/env";

function ensureCloudinaryConfigured() {
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
}

export async function uploadImage(input: {
  buffer: Buffer;
  folder?: string;
  filename?: string;
}) {
  ensureCloudinaryConfigured();

  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: input.folder ?? "seminario-sud",
        public_id: input.filename,
        resource_type: "image",
      },
      (error, res) => {
        if (error || !res) return reject(error ?? new Error("UPLOAD_FAILED"));
        return resolve({ secure_url: res.secure_url, public_id: res.public_id });
      },
    );

    uploadStream.end(input.buffer);
  });

  return result;
}

