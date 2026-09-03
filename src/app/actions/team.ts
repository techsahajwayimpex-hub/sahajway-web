"use server";

import { revalidatePath } from "next/cache";
import { connectDB, isUsingMockDB, readMockDB, writeMockDB } from "@/lib/db";
import TeamMemberModel from "@/lib/models/TeamMember";
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
 * Creates a new Team Member
 */
export async function createTeamMember(data: {
  name: string;
  designation: string;
  country: string;
  imageData?: string; // base64 representation of profile photo
  bio: string;
  email: string;
  linkedin: string;
  displayOrder: number;
  active: boolean;
}) {
  await checkAuth();

  let imageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80";

  // Upload image to Cloudinary/local if present
  if (data.imageData) {
    try {
      imageUrl = await uploadImage(data.imageData);
    } catch (err) {
      console.error("Failed to upload profile image, using fallback:", err);
    }
  }

  if (isUsingMockDB) {
    const db = readMockDB();
    const newMember = {
      _id: `team_${Date.now()}`,
      name: data.name,
      designation: data.designation,
      country: data.country,
      image: imageUrl,
      bio: data.bio,
      email: data.email,
      linkedin: data.linkedin,
      displayOrder: data.displayOrder,
      active: data.active,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.team.push(newMember);
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      const member = new TeamMemberModel({
        name: data.name,
        designation: data.designation,
        country: data.country,
        image: imageUrl,
        bio: data.bio,
        email: data.email,
        linkedin: data.linkedin,
        displayOrder: data.displayOrder,
        active: data.active,
      });

      await member.save();
    } catch (err: any) {
      console.error("Database error creating team member:", err);
      return { success: false, message: err.message || "Failed to add team member" };
    }
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  return { success: true };
}

/**
 * Updates an existing Team Member
 */
export async function updateTeamMember(
  id: string,
  data: {
    name: string;
    designation: string;
    country: string;
    image?: string; // Existing image url
    imageData?: string; // New base64 image data
    bio: string;
    email: string;
    linkedin: string;
    displayOrder: number;
    active: boolean;
  }
) {
  await checkAuth();

  let imageUrl = data.image || "";

  // Replace profile image if new file uploaded
  if (data.imageData) {
    try {
      if (imageUrl && !imageUrl.includes("unsplash.com")) {
        await deleteImage(imageUrl);
      }
      imageUrl = await uploadImage(data.imageData);
    } catch (err) {
      console.error("Failed to replace profile image:", err);
    }
  }

  if (isUsingMockDB) {
    const db = readMockDB();
    const idx = db.team.findIndex((t: any) => t._id === id);
    if (idx === -1) {
      return { success: false, message: "Team member not found" };
    }

    db.team[idx] = {
      ...db.team[idx],
      name: data.name,
      designation: data.designation,
      country: data.country,
      image: imageUrl,
      bio: data.bio,
      email: data.email,
      linkedin: data.linkedin,
      displayOrder: data.displayOrder,
      active: data.active,
      updatedAt: new Date().toISOString(),
    };
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      await TeamMemberModel.findByIdAndUpdate(id, {
        name: data.name,
        designation: data.designation,
        country: data.country,
        image: imageUrl,
        bio: data.bio,
        email: data.email,
        linkedin: data.linkedin,
        displayOrder: data.displayOrder,
        active: data.active,
      });
    } catch (err: any) {
      console.error("Database error updating team member:", err);
      return { success: false, message: err.message || "Failed to update team member" };
    }
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  return { success: true };
}

/**
 * Deletes a Team Member
 */
export async function deleteTeamMember(id: string, imageUrl?: string) {
  await checkAuth();

  if (imageUrl && !imageUrl.includes("unsplash.com")) {
    try {
      await deleteImage(imageUrl);
    } catch (err) {
      console.error("Failed to delete profile photo:", err);
    }
  }

  if (isUsingMockDB) {
    const db = readMockDB();
    db.team = db.team.filter((t: any) => t._id !== id);
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      await TeamMemberModel.findByIdAndDelete(id);
    } catch (err: any) {
      console.error("Database error deleting team member:", err);
      return { success: false, message: err.message || "Failed to delete team member" };
    }
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  return { success: true };
}

/**
 * Toggles team member active status
 */
export async function toggleTeamMemberStatus(id: string, active: boolean) {
  await checkAuth();

  if (isUsingMockDB) {
    const db = readMockDB();
    const member = db.team.find((t: any) => t._id === id);
    if (member) {
      member.active = active;
      writeMockDB(db);
    }
  } else {
    try {
      await connectDB();
      await TeamMemberModel.findByIdAndUpdate(id, { active });
    } catch (err: any) {
      console.error("Failed to toggle team status:", err);
      return { success: false, message: "Failed to update active status" };
    }
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  return { success: true };
}
