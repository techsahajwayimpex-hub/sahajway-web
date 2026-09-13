import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  imageUrl?: string;
  role: "admin" | "user";
  companyName?: string;
  country?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    companyName: { type: String, default: "" },
    country: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
