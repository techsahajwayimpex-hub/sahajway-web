import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, isUsingMockDB, readMockDB, writeMockDB } from "@/lib/db";
import InquiryModel from "@/lib/models/Inquiry";
import { sendInquiryEmails } from "@/lib/email";

const InquirySchema = z.object({
  name: z.string().min(2),
  companyName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  country: z.string().min(2),
  productInterest: z.string().min(2),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = InquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    if (isUsingMockDB) {
      const db = readMockDB();
      const newInq = { _id: `inq_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
      db.inquiries.unshift(newInq);
      writeMockDB(db);
    } else {
      await connectDB();
      const newInq = new InquiryModel(data);
      await newInq.save();
    }

    // Fire email notifications in background
    sendInquiryEmails(data).catch((err) =>
      console.error("Failed to send inquiry emails via API:", err)
    );

    return NextResponse.json({
      success: true,
      message: "Trade inquiry received successfully.",
    });
  } catch (err: any) {
    console.error("API /api/inquiries error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process inquiry" },
      { status: 500 }
    );
  }
}
