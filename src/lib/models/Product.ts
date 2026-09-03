import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string; // Stored as name or reference
  images: string[];
  specifications: string[];
  features: string[];
  exportInformation: string;
  seoTitle: string;
  seoDescription: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: [String], default: [] },
    specifications: { type: [String], default: [] },
    features: { type: [String], default: [] },
    exportInformation: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    status: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
