import React from "react";
import CategoryCMSClient from "@/components/admin/CategoryCMSClient";
import { connectDB, readMockDB, isUsingMockDB } from "@/lib/db";
import CategoryModel from "@/lib/models/Category";

export const revalidate = 0;

async function getCategories() {
  if (isUsingMockDB) {
    const db = readMockDB();
    return db.categories;
  }

  try {
    await connectDB();
    const categories = await CategoryModel.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (err) {
    console.error("Failed to query categories, falling back to mock:", err);
    const db = readMockDB();
    return db.categories;
  }
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return <CategoryCMSClient initialCategories={categories} />;
}
