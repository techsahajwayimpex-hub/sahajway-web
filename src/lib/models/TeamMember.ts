import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  designation: string;
  country: string;
  image: string;
  bio: string;
  email: string;
  linkedin: string;
  displayOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    country: { type: String, required: true },
    image: { type: String, required: true },
    bio: { type: String, default: "" },
    email: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);
