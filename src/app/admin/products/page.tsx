import React from "react";
import ProductCMSClient from "@/components/admin/ProductCMSClient";
import { connectDB, readMockDB, isUsingMockDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import CategoryModel from "@/lib/models/Category";

export const revalidate = 0;

async function getProductsAndCategories() {
  if (isUsingMockDB) {
    const db = readMockDB();
    return {
      products: db.products,
      categories: db.categories,
    };
  }

  try {
    await connectDB();
    const [products, categories] = await Promise.all([
      ProductModel.find().sort({ createdAt: -1 }).lean(),
      CategoryModel.find({ status: true }).lean(),
    ]);

    return {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
    };
  } catch (err) {
    console.error("Failed to query products/categories, using mock fallback:", err);
    const db = readMockDB();
    return {
      products: db.products,
      categories: db.categories,
    };
  }
}

export default async function AdminProductsPage() {
  const { products, categories } = await getProductsAndCategories();

  return <ProductCMSClient initialProducts={products} categories={categories} />;
}
