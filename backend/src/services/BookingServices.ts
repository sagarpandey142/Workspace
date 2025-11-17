import mongoose from "mongoose";
import BookingModel, { BookingDoc } from "../Models/Booking";
import RoomModel, { RoomDoc } from "../Models/Rooms";
import { minutesBetween, nowIso, toTz } from "../utils/Time";
import { computePriceForRange } from "../utils/Pricing";

interface CanBookResult {
  ok: boolean;
  error?: string;
  conflict?: BookingDoc;
}

// List all rooms 
export async function listRooms(): Promise<RoomDoc[]> {
  return RoomModel.find(); 
}

// List all bookings sorted by start time
export async function listBookings(): Promise<BookingDoc[]> {
  return BookingModel.find().sort({ startTime: 1 }); 
}

// Find room by ID
export async function findRoomById(id: string): Promise<RoomDoc | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return RoomModel.findById(id); 
}

// Find conflicting confirmed booking
export async function findConflictingBooking(
  roomId: string,
  startISO: string,
  endISO: string
): Promise<BookingDoc | null> {
  const start = new Date(startISO);
  const end = new Date(endISO);

  return BookingModel.findOne({
    roomId,
    status: "CONFIRMED",
    $expr: {
      $and: [
        { $lt: ["$startTime", end] },
        { $lt: [start, "$endTime"] },
      ],
    },
  }); 
}

// Check if booking is allowed
export async function canBook(
  roomId: string,
  startISO: string,
  endISO: string
): Promise<CanBookResult> {
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (!(start < end)) return { ok: false, error: "startTime must be before endTime" };

  const mins = minutesBetween(start, end);
  if (mins <= 0) return { ok: false, error: "duration must be > 0" };
  if (mins > 12 * 60) return { ok: false, error: "duration cannot exceed 12 hours" };

  const conflict = await findConflictingBooking(roomId, startISO, endISO);
  if (conflict) {
    return {
      ok: false,
      error: `Room already booked from ${toTz(conflict.startTime).format(
        "YYYY-MM-DD HH:mm"
      )} to ${toTz(conflict.endTime).format("YYYY-MM-DD HH:mm")}`,
      conflict,
    };
  }

  return { ok: true };
}

// Create a new booking
export async function createBooking(
  roomId: string,
  userId: string,  
  userName: string,
  startISO: string,
  endISO: string
): Promise<BookingDoc> {
  const room = await findRoomById(roomId);
  if (!room) throw new Error("room not found");

  const can = await canBook(roomId, startISO, endISO);
  if (!can.ok) throw new Error(can.error);

  const price = computePriceForRange(room, startISO, endISO);

  const booking = new BookingModel({
    roomId,
    userId,       
    userName,
    startTime: new Date(startISO),
    endTime: new Date(endISO),
    totalPrice: price,
    status: "CONFIRMED",
  });

  await booking.save();
  return booking.toObject();
}


// Cancel a booking
export async function cancelBooking(
  id: string
): Promise<{ ok: boolean; status?: number; error?: string; booking?: BookingDoc }> {
  if (!mongoose.Types.ObjectId.isValid(id))
    return { ok: false, status: 404, error: "booking not found" };

  const b = await BookingModel.findById(id);
  if (!b) return { ok: false, status: 404, error: "booking not found" };
  if (b.status === "CANCELLED") return { ok: false, status: 400, error: "booking already cancelled" };

  const now = new Date(nowIso());
  const diffMin = (b.startTime.getTime() - now.getTime()) / (1000 * 60);
  if (diffMin < 120)
    return { ok: false, status: 400, error: "cancellation not allowed within 2 hours of start time" };

  b.status = "CANCELLED";
  await b.save();

  return { ok: true, booking: b };
}

export async function listBookingsByUser(userId: string): Promise<any[]> {
  return BookingModel.find({ userId }).sort({ startTime: 1 }).lean();
}