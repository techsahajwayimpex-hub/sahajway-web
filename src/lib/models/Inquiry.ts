import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  productInterest: string;
  message: string;
  createdAt: Date;
}

const InquirySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    companyName: { type: String, default: "" },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    productInterest: { type: String, default: "" },
    message: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
