import { Schema, model, Document } from "mongoose";

export interface RoomDoc extends Document {
  name: string;
  baseHourlyRate: number;
  capacity: number;
}

const RoomSchema = new Schema<RoomDoc>({
  name: { type: String, required: true },
  baseHourlyRate: { type: Number, required: true },
  capacity: { type: Number, required: true },
});

const RoomModel = model<RoomDoc>("Room", RoomSchema);
export default RoomModel;
