import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  image: string;
  showGlobe: boolean;
  backgroundColor: string;
  backgroundImage: string;
  displayOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    badge: { type: String, default: "Premium Global B2B Exporter" },
    title: { type: String, required: true },
    highlightText: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    primaryButtonText: { type: String, default: "Explore Products" },
    primaryButtonLink: { type: String, default: "/products" },
    secondaryButtonText: { type: String, default: "Contact Us" },
    secondaryButtonLink: { type: String, default: "/contact" },
    image: { type: String, default: "" },
    showGlobe: { type: Boolean, default: false },
    backgroundColor: { type: String, default: "" },
    backgroundImage: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Banner ||
  mongoose.model<IBanner>("Banner", BannerSchema);
