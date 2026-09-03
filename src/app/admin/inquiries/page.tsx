import React from "react";
import InquiryCMSClient from "@/components/admin/InquiryCMSClient";
import { connectDB, readMockDB, isUsingMockDB } from "@/lib/db";
import InquiryModel from "@/lib/models/Inquiry";

export const revalidate = 0;

async function getInquiries() {
  if (isUsingMockDB) {
    const db = readMockDB();
    return db.inquiries;
  }

  try {
    await connectDB();
    const inquiries = await InquiryModel.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(inquiries));
  } catch (err) {
    console.error("Failed to query B2B inquiries, falling back to mock:", err);
    const db = readMockDB();
    return db.inquiries;
  }
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return <InquiryCMSClient inquiries={inquiries} />;
}
