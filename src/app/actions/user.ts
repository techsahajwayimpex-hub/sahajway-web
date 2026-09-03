"use server";

import { revalidatePath } from "next/cache";
import { connectDB, isUsingMockDB } from "@/lib/db";
import UserModel from "@/lib/models/User";
import { getAdminSession } from "@/lib/auth";

async function checkAuth() {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    throw new Error("Unauthorized access. Admin privileges required.");
  }
}

/**
 * Get all registered users (Admin only)
 */
export async function getUsers() {
  await checkAuth();

  if (isUsingMockDB) {
    return [
      {
        _id: "user_mock_1",
        clerkId: "user_2test123",
        email: "admin@sahajwayimpex.com",
        name: "Developer Admin",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    ];
  }

  try {
    await connectDB();
    const users = await UserModel.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(users));
  } catch (err: any) {
    console.error("Failed to fetch users from MongoDB:", err);
    return [];
  }
}

/**
 * Sync or upsert Clerk user into MongoDB
 */
export async function syncClerkUser(data: {
  clerkId: string;
  email: string;
  name: string;
  imageUrl?: string;
}) {
  if (isUsingMockDB) return { success: true };

  try {
    await connectDB();
    await UserModel.findOneAndUpdate(
      { clerkId: data.clerkId },
      {
        $set: {
          email: data.email,
          name: data.name,
          imageUrl: data.imageUrl || "",
        },
      },
      { upsert: true, new: true }
    );
    return { success: true };
  } catch (err: any) {
    console.error("Error syncing Clerk user to MongoDB:", err);
    return { success: false, message: err.message };
  }
}
