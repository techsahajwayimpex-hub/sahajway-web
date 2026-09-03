"use server";

import { revalidatePath } from "next/cache";
import { connectDB, isUsingMockDB, readMockDB, writeMockDB } from "@/lib/db";
import CategoryModel from "@/lib/models/Category";
import ProductModel from "@/lib/models/Product";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { getAdminSession } from "@/lib/auth";

// Check permissions
async function checkAuth() {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    throw new Error("Unauthorized access. Admin privileges required.");
  }
}

/**
 * Creates a new category
 */
export async function createCategory(data: {
  name: string;
  slug: string;
  imageData?: string; // base64 representation of image
  description: string;
  status: boolean;
}) {
  await checkAuth();

  let imageUrl = "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80";

  // Upload image to Cloudinary/local if present
  if (data.imageData) {
    try {
      imageUrl = await uploadImage(data.imageData);
    } catch (err) {
      console.error("Failed to upload category image, using fallback:", err);
    }
  }

  const slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

  if (isUsingMockDB) {
    const db = readMockDB();
    const existing = db.categories.find((c: any) => c.slug === slug);
    if (existing) {
      return { success: false, message: "Category with this slug already exists" };
    }

    const newCategory = {
      _id: `cat_${Date.now()}`,
      name: data.name,
      slug,
      image: imageUrl,
      description: data.description,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.categories.push(newCategory);
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      const existing = await CategoryModel.findOne({ slug });
      if (existing) {
        return { success: false, message: "Category with this slug already exists" };
      }

      const category = new CategoryModel({
        name: data.name,
        slug,
        image: imageUrl,
        description: data.description,
        status: data.status,
      });

      await category.save();
    } catch (err: any) {
      console.error("Database error creating category:", err);
      return { success: false, message: err.message || "Failed to create category" };
    }
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

/**
 * Updates an existing category
 */
export async function updateCategory(
  id: string,
  data: {
    name: string;
    slug: string;
    image?: string; // Existing image url
    imageData?: string; // New base64 image data
    description: string;
    status: boolean;
  }
) {
  await checkAuth();

  let imageUrl = data.image || "";

  // Upload new image if base64 data provided
  if (data.imageData) {
    try {
      // Try to delete old image if it was on Cloudinary
      if (imageUrl && !imageUrl.includes("unsplash.com")) {
        await deleteImage(imageUrl);
      }
      imageUrl = await uploadImage(data.imageData);
    } catch (err) {
      console.error("Failed to replace category image:", err);
    }
  }

  const slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

  if (isUsingMockDB) {
    const db = readMockDB();
    const categoryIdx = db.categories.findIndex((c: any) => c._id === id);
    if (categoryIdx === -1) {
      return { success: false, message: "Category not found" };
    }

    // Check slug collision
    const collision = db.categories.find((c: any) => c.slug === slug && c._id !== id);
    if (collision) {
      return { success: false, message: "Category with this slug already exists" };
    }

    db.categories[categoryIdx] = {
      ...db.categories[categoryIdx],
      name: data.name,
      slug,
      image: imageUrl,
      description: data.description,
      status: data.status,
      updatedAt: new Date().toISOString(),
    };
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      // Check slug collision
      const collision = await CategoryModel.findOne({ slug, _id: { $ne: id } });
      if (collision) {
        return { success: false, message: "Category with this slug already exists" };
      }

      await CategoryModel.findByIdAndUpdate(id, {
        name: data.name,
        slug,
        image: imageUrl,
        description: data.description,
        status: data.status,
      });
    } catch (err: any) {
      console.error("Database error updating category:", err);
      return { success: false, message: err.message || "Failed to update category" };
    }
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

/**
 * Deletes a category
 */
export async function deleteCategory(id: string, imageUrl?: string) {
  await checkAuth();

  if (imageUrl && !imageUrl.includes("unsplash.com")) {
    try {
      await deleteImage(imageUrl);
    } catch (err) {
      console.error("Failed to delete category image:", err);
    }
  }

  if (isUsingMockDB) {
    const db = readMockDB();
    db.categories = db.categories.filter((c: any) => c._id !== id);
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      await CategoryModel.findByIdAndDelete(id);
    } catch (err: any) {
      console.error("Database error deleting category:", err);
      return { success: false, message: err.message || "Failed to delete category" };
    }
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

/**
 * Toggles a category's published status
 */
export async function toggleCategoryStatus(id: string, status: boolean) {
  await checkAuth();

  if (isUsingMockDB) {
    const db = readMockDB();
    const cat = db.categories.find((c: any) => c._id === id);
    if (cat) {
      cat.status = status;
      writeMockDB(db);
    }
  } else {
    try {
      await connectDB();
      await CategoryModel.findByIdAndUpdate(id, { status });
    } catch (err: any) {
      console.error("Failed to toggle category status:", err);
      return { success: false, message: "Failed to update status" };
    }
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true };
}
