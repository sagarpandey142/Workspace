
import { Schema, model, Document, Types } from "mongoose";

export interface BookingDoc extends Document {
  roomId: Types.ObjectId;
  userId:Types.ObjectId;
  userName: string;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED";
  createdAt: Date;
}

// Mongoose schema
const BookingSchema = new Schema<BookingDoc>({
  roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "Users", required: true, index: true }, 
  userName: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["CONFIRMED", "CANCELLED"], default: "CONFIRMED" },
  createdAt: { type: Date, default: () => new Date() },
});

// Export Mongoose model
const BookingModel = model<BookingDoc>("Booking", BookingSchema);
export default BookingModel;
