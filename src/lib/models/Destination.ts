import mongoose, { Schema, Document } from "mongoose";

export interface IDestination extends Document {
  name: string;
  country: string;
  lat: number;
  lon: number;
  displayOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Destination ||
  mongoose.model<IDestination>("Destination", DestinationSchema);
