"use server";

import { revalidatePath } from "next/cache";
import { connectDB, isUsingMockDB, readMockDB, writeMockDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { getAdminSession } from "@/lib/auth";

// Auth check helper
async function checkAuth() {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    throw new Error("Unauthorized access. Admin privileges required.");
  }
}

/**
 * Creates a new Product
 */
export async function createProduct(data: {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  imageFiles?: string[]; // Array of base64 image strings
  specifications: string[];
  features: string[];
  exportInformation: string;
  seoTitle: string;
  seoDescription: string;
  status: boolean;
}) {
  await checkAuth();

  const slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  
  // Upload all base64 images
  const imageUrls: string[] = [];
  if (data.imageFiles && data.imageFiles.length > 0) {
    for (const base64Img of data.imageFiles) {
      try {
        const url = await uploadImage(base64Img);
        imageUrls.push(url);
      } catch (err) {
        console.error("Failed to upload product gallery image:", err);
      }
    }
  }

  // Fallback placeholder image if no images uploaded
  if (imageUrls.length === 0) {
    imageUrls.push("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80");
  }

  if (isUsingMockDB) {
    const db = readMockDB();
    const collision = db.products.find((p: any) => p.slug === slug);
    if (collision) {
      return { success: false, message: "Product with this slug already exists" };
    }

    const newProduct = {
      _id: `prod_${Date.now()}`,
      name: data.name,
      slug,
      shortDescription: data.shortDescription,
      description: data.description,
      category: data.category,
      images: imageUrls,
      specifications: data.specifications,
      features: data.features,
      exportInformation: data.exportInformation,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.products.push(newProduct);
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      const collision = await ProductModel.findOne({ slug });
      if (collision) {
        return { success: false, message: "Product with this slug already exists" };
      }

      const product = new ProductModel({
        name: data.name,
        slug,
        shortDescription: data.shortDescription,
        description: data.description,
        category: data.category,
        images: imageUrls,
        specifications: data.specifications,
        features: data.features,
        exportInformation: data.exportInformation,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        status: data.status,
      });

      await product.save();
    } catch (err: any) {
      console.error("Database error creating product:", err);
      return { success: false, message: err.message || "Failed to create product" };
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/");
  return { success: true };
}

/**
 * Updates an existing Product
 */
export async function updateProduct(
  id: string,
  data: {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    category: string;
    images: string[]; // Keep existing image URLs
    imageFiles?: string[]; // Array of new base64 image strings to upload
    specifications: string[];
    features: string[];
    exportInformation: string;
    seoTitle: string;
    seoDescription: string;
    status: boolean;
  }
) {
  await checkAuth();

  const slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

  // Start with existing images list
  const imageUrls = [...data.images];

  // Upload new images if present
  if (data.imageFiles && data.imageFiles.length > 0) {
    for (const base64Img of data.imageFiles) {
      try {
        const url = await uploadImage(base64Img);
        imageUrls.push(url);
      } catch (err) {
        console.error("Failed to upload new product image:", err);
      }
    }
  }

  if (isUsingMockDB) {
    const db = readMockDB();
    const idx = db.products.findIndex((p: any) => p._id === id);
    if (idx === -1) {
      return { success: false, message: "Product not found" };
    }

    const collision = db.products.find((p: any) => p.slug === slug && p._id !== id);
    if (collision) {
      return { success: false, message: "Product with this slug already exists" };
    }

    db.products[idx] = {
      ...db.products[idx],
      name: data.name,
      slug,
      shortDescription: data.shortDescription,
      description: data.description,
      category: data.category,
      images: imageUrls,
      specifications: data.specifications,
      features: data.features,
      exportInformation: data.exportInformation,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      status: data.status,
      updatedAt: new Date().toISOString(),
    };
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      const collision = await ProductModel.findOne({ slug, _id: { $ne: id } });
      if (collision) {
        return { success: false, message: "Product with this slug already exists" };
      }

      await ProductModel.findByIdAndUpdate(id, {
        name: data.name,
        slug,
        shortDescription: data.shortDescription,
        description: data.description,
        category: data.category,
        images: imageUrls,
        specifications: data.specifications,
        features: data.features,
        exportInformation: data.exportInformation,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        status: data.status,
      });
    } catch (err: any) {
      console.error("Database error updating product:", err);
      return { success: false, message: err.message || "Failed to update product" };
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/");
  return { success: true };
}

/**
 * Deletes a Product
 */
export async function deleteProduct(id: string, images: string[], slug: string) {
  await checkAuth();

  // Delete images from Cloudinary / local mock
  if (images && images.length > 0) {
    for (const url of images) {
      if (url && !url.includes("unsplash.com")) {
        try {
          await deleteImage(url);
        } catch (err) {
          console.error("Failed to delete product image:", err);
        }
      }
    }
  }

  if (isUsingMockDB) {
    const db = readMockDB();
    db.products = db.products.filter((p: any) => p._id !== id);
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      await ProductModel.findByIdAndDelete(id);
    } catch (err: any) {
      console.error("Database error deleting product:", err);
      return { success: false, message: err.message || "Failed to delete product" };
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/");
  return { success: true };
}

/**
 * Toggles a product's published status
 */
export async function toggleProductStatus(id: string, status: boolean, slug: string) {
  await checkAuth();

  if (isUsingMockDB) {
    const db = readMockDB();
    const prod = db.products.find((p: any) => p._id === id);
    if (prod) {
      prod.status = status;
      writeMockDB(db);
    }
  } else {
    try {
      await connectDB();
      await ProductModel.findByIdAndUpdate(id, { status });
    } catch (err: any) {
      console.error("Failed to toggle product status:", err);
      return { success: false, message: "Failed to update status" };
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  return { success: true };
}
