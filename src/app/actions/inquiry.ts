"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { connectDB, isUsingMockDB, readMockDB, writeMockDB } from "@/lib/db";
import InquiryModel from "@/lib/models/Inquiry";
import { sendInquiryEmails } from "@/lib/email";
import { getAdminSession } from "@/lib/auth";

// Validation schema using Zod
const InquirySchema = z.object({
  name: z.string().min(2, { message: "Full Name must be at least 2 characters" }),
  companyName: z.string().min(1, { message: "Company Name is required for B2B inquiries" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(6, { message: "Valid phone number is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  productInterest: z.string().min(2, { message: "Product interest must be specified" }),
  message: z.string().min(10, { message: "Please provide a message with at least 10 characters" }),
});

export type InquiryFormState = {
  success?: boolean;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
};

/**
 * Server action to process and save a B2B product inquiry
 */
export async function submitInquiry(prevState: any, formData: FormData): Promise<InquiryFormState> {
  // Extract values
  const name = formData.get("name") as string;
  const companyName = formData.get("companyName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const country = formData.get("country") as string;
  const productInterest = formData.get("productInterest") as string;
  const message = formData.get("message") as string;

  // Validate fields
  const validatedFields = InquirySchema.safeParse({
    name,
    companyName,
    email,
    phone,
    country,
    productInterest,
    message,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please correct the fields below.",
    };
  }

  const data = validatedFields.data;

  // 1. Store in Database
  if (isUsingMockDB) {
    console.log("Mock database mode. Saving inquiry to local store...");
    const db = readMockDB();
    const newInquiry = {
      _id: `inq_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    db.inquiries.unshift(newInquiry);
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      const newInquiry = new InquiryModel({
        ...data,
      });
      await newInquiry.save();
      console.log("Inquiry saved to MongoDB Atlas");
    } catch (dbErr) {
      console.error("Failed to write inquiry to MongoDB, using local fallback:", dbErr);
      const db = readMockDB();
      const newInquiry = {
        _id: `inq_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      };
      db.inquiries.unshift(newInquiry);
      writeMockDB(db);
    }
  }

  // 2. Dispatch Emails (Admin alert + Customer auto-reply)
  try {
    await sendInquiryEmails({
      name: data.name,
      companyName: data.companyName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      productInterest: data.productInterest,
      message: data.message,
    });
    console.log("Inquiry emails processed successfully");
  } catch (emailErr) {
    console.error("Failed to dispatch Resend emails for inquiry:", emailErr);
    // Do not crash the user action - the DB save succeeded!
  }

  return {
    success: true,
    message: "Thank you! Your trade inquiry has been received. Our B2B desk will contact you shortly.",
  };
}

/**
 * Server action to delete an inquiry (Admin only)
 */
export async function deleteInquiry(id: string) {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    throw new Error("Unauthorized access. Admin privileges required.");
  }

  if (isUsingMockDB) {
    const db = readMockDB();
    db.inquiries = (db.inquiries || []).filter((inq: any) => inq._id !== id);
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      await InquiryModel.findByIdAndDelete(id);
    } catch (err: any) {
      console.error("Failed to delete inquiry:", err);
      return { success: false, message: err.message || "Failed to delete inquiry" };
    }
  }

  revalidatePath("/admin/inquiries");
  return { success: true };
}
