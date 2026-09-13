"use server";

import { revalidatePath } from "next/cache";
import { connectDB, isUsingMockDB, readMockDB, writeMockDB } from "@/lib/db";
import BannerModel from "@/lib/models/Banner";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { getAdminSession } from "@/lib/auth";

// Auth verification
async function checkAuth() {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    throw new Error("Unauthorized access. Admin privileges required.");
  }
}

/**
 * Creates a new Hero Banner slide
 */
export async function createBanner(data: {
  badge: string;
  title: string;
  highlightText?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  image?: string;
  imageData?: string; // base64 representation of slide image
  showGlobe: boolean;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundImageData?: string; // base64 background image
  displayOrder: number;
  active: boolean;
}) {
  await checkAuth();

  let imageUrl = data.image || "";
  if (data.imageData) {
    try {
      imageUrl = await uploadImage(data.imageData, "sahajway-impex/banners");
    } catch (err) {
      console.error("Failed to upload banner image:", err);
    }
  }

  let bgImageUrl = data.backgroundImage || "";
  if (data.backgroundImageData) {
    try {
      bgImageUrl = await uploadImage(data.backgroundImageData, "sahajway-impex/banners");
    } catch (err) {
      console.error("Failed to upload banner background image:", err);
    }
  }

  if (isUsingMockDB) {
    const db = readMockDB();
    const newBanner = {
      _id: `banner_${Date.now()}`,
      badge: data.badge || "Premium Global B2B Exporter",
      title: data.title,
      highlightText: data.highlightText || "",
      subtitle: data.subtitle || "",
      primaryButtonText: data.primaryButtonText || "Explore Products",
      primaryButtonLink: data.primaryButtonLink || "/products",
      secondaryButtonText: data.secondaryButtonText || "Contact Us",
      secondaryButtonLink: data.secondaryButtonLink || "/contact",
      image: imageUrl,
      showGlobe: data.showGlobe ?? false,
      backgroundColor: data.backgroundColor || "bg-gradient-premium",
      backgroundImage: bgImageUrl,
      displayOrder: Number(data.displayOrder) || 0,
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.banners.push(newBanner);
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      const banner = new BannerModel({
        badge: data.badge || "Premium Global B2B Exporter",
        title: data.title,
        highlightText: data.highlightText || "",
        subtitle: data.subtitle || "",
        primaryButtonText: data.primaryButtonText || "Explore Products",
        primaryButtonLink: data.primaryButtonLink || "/products",
        secondaryButtonText: data.secondaryButtonText || "Contact Us",
        secondaryButtonLink: data.secondaryButtonLink || "/contact",
        image: imageUrl,
        showGlobe: data.showGlobe ?? false,
        backgroundColor: data.backgroundColor || "bg-gradient-premium",
        backgroundImage: bgImageUrl,
        displayOrder: Number(data.displayOrder) || 0,
        active: data.active ?? true,
      });

      await banner.save();
    } catch (err: any) {
      console.error("Database error creating banner:", err);
      return {
        success: false,
        message: err.message || "Failed to create banner slide",
      };
    }
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { success: true };
}

/**
 * Updates an existing Hero Banner slide
 */
export async function updateBanner(
  id: string,
  data: {
    badge: string;
    title: string;
    highlightText?: string;
    subtitle?: string;
    primaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    image?: string;
    imageData?: string;
    showGlobe: boolean;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundImageData?: string;
    displayOrder: number;
    active: boolean;
  }
) {
  await checkAuth();

  let imageUrl = data.image || "";
  if (data.imageData) {
    try {
      if (imageUrl && !imageUrl.includes("unsplash.com")) {
        await deleteImage(imageUrl);
      }
      imageUrl = await uploadImage(data.imageData, "sahajway-impex/banners");
    } catch (err) {
      console.error("Failed to replace banner image:", err);
    }
  }

  let bgImageUrl = data.backgroundImage || "";
  if (data.backgroundImageData) {
    try {
      if (bgImageUrl && !bgImageUrl.includes("unsplash.com")) {
        await deleteImage(bgImageUrl);
      }
      bgImageUrl = await uploadImage(data.backgroundImageData, "sahajway-impex/banners");
    } catch (err) {
      console.error("Failed to replace banner background image:", err);
    }
  }

  if (isUsingMockDB) {
    const db = readMockDB();
    const idx = db.banners.findIndex((b: any) => b._id === id);
    if (idx === -1) {
      return { success: false, message: "Banner not found" };
    }

    db.banners[idx] = {
      ...db.banners[idx],
      badge: data.badge,
      title: data.title,
      highlightText: data.highlightText || "",
      subtitle: data.subtitle || "",
      primaryButtonText: data.primaryButtonText || "Explore Products",
      primaryButtonLink: data.primaryButtonLink || "/products",
      secondaryButtonText: data.secondaryButtonText || "Contact Us",
      secondaryButtonLink: data.secondaryButtonLink || "/contact",
      image: imageUrl,
      showGlobe: data.showGlobe ?? false,
      backgroundColor: data.backgroundColor || "bg-gradient-premium",
      backgroundImage: bgImageUrl,
      displayOrder: Number(data.displayOrder) || 0,
      active: data.active,
      updatedAt: new Date().toISOString(),
    };
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      await BannerModel.findByIdAndUpdate(id, {
        badge: data.badge,
        title: data.title,
        highlightText: data.highlightText || "",
        subtitle: data.subtitle || "",
        primaryButtonText: data.primaryButtonText || "Explore Products",
        primaryButtonLink: data.primaryButtonLink || "/products",
        secondaryButtonText: data.secondaryButtonText || "Contact Us",
        secondaryButtonLink: data.secondaryButtonLink || "/contact",
        image: imageUrl,
        showGlobe: data.showGlobe ?? false,
        backgroundColor: data.backgroundColor || "bg-gradient-premium",
        backgroundImage: bgImageUrl,
        displayOrder: Number(data.displayOrder) || 0,
        active: data.active,
      });
    } catch (err: any) {
      console.error("Database error updating banner:", err);
      return {
        success: false,
        message: err.message || "Failed to update banner slide",
      };
    }
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { success: true };
}

/**
 * Deletes a Banner slide
 */
export async function deleteBanner(id: string, imageUrl?: string, bgImageUrl?: string) {
  await checkAuth();

  if (imageUrl && !imageUrl.includes("unsplash.com")) {
    try {
      await deleteImage(imageUrl);
    } catch (err) {
      console.error("Failed to delete banner photo:", err);
    }
  }

  if (bgImageUrl && !bgImageUrl.includes("unsplash.com")) {
    try {
      await deleteImage(bgImageUrl);
    } catch (err) {
      console.error("Failed to delete banner bg photo:", err);
    }
  }

  if (isUsingMockDB) {
    const db = readMockDB();
    db.banners = db.banners.filter((b: any) => b._id !== id);
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      await BannerModel.findByIdAndDelete(id);
    } catch (err: any) {
      console.error("Database error deleting banner:", err);
      return {
        success: false,
        message: err.message || "Failed to delete banner slide",
      };
    }
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { success: true };
}

/**
 * Toggles active status of a Banner slide
 */
export async function toggleBannerStatus(id: string, active: boolean) {
  await checkAuth();

  if (isUsingMockDB) {
    const db = readMockDB();
    const banner = db.banners.find((b: any) => b._id === id);
    if (banner) {
      banner.active = active;
      writeMockDB(db);
    }
  } else {
    try {
      await connectDB();
      await BannerModel.findByIdAndUpdate(id, { active });
    } catch (err: any) {
      console.error("Failed to toggle banner status:", err);
      return { success: false, message: "Failed to update status" };
    }
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { success: true };
}
