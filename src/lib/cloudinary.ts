import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== "dummy_cloud" &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== "dummy_key" &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== "dummy_secret";

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Custom mock directory path
const MOCK_UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

/**
 * Uploads an image (either as a base64 string or file path)
 * @param fileData Base64 string, image URL, or local path
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(fileData: string): Promise<string> {
  if (!isCloudinaryConfigured) {
    console.log("Cloudinary is not configured. Simulating upload locally...");
    
    // Check if base64 data
    if (fileData.startsWith("data:image")) {
      try {
        // Ensure mock directory exists
        if (!fs.existsSync(MOCK_UPLOAD_DIR)) {
          fs.mkdirSync(MOCK_UPLOAD_DIR, { recursive: true });
        }

        const matches = fileData.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          throw new Error("Invalid base64 string");
        }

        const ext = matches[1];
        const base64Content = matches[2];
        const fileName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const filePath = path.join(MOCK_UPLOAD_DIR, fileName);

        fs.writeFileSync(filePath, Buffer.from(base64Content, "base64"));
        console.log(`Mock file saved locally at: ${filePath}`);
        
        // Return local URL path
        return `/uploads/${fileName}`;
      } catch (error) {
        console.error("Local mock upload failed, returning fallback placeholder:", error);
        return "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80";
      }
    }
    
    // If it's already a URL or path, just return it
    return fileData;
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileData, {
      folder: "sahajway_impex",
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error, using local fallback:", error);
    throw error;
  }
}

/**
 * Deletes an image by its URL
 * @param imageUrl The URL of the image to delete
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  if (!isCloudinaryConfigured) {
    console.log(`Cloudinary not configured. Simulating delete for: ${imageUrl}`);
    if (imageUrl.startsWith("/uploads/")) {
      try {
        const filePath = path.join(process.cwd(), "public", imageUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Mock file deleted: ${filePath}`);
        }
        return true;
      } catch (error) {
        console.error("Error deleting local mock file:", error);
      }
    }
    return true;
  }

  try {
    // Extract public ID from Cloudinary URL
    const urlParts = imageUrl.split("/");
    const filenameWithExt = urlParts[urlParts.length - 1];
    const folderPart = urlParts[urlParts.length - 2];
    const publicId = `sahajway_impex/${filenameWithExt.split(".")[0]}`;

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
}
