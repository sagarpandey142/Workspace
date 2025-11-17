// src/controllers/BookingController.ts
import { Request, Response } from "express";
import * as bookingService from "../services/BookingServices";
import BookingModel from "../Models/Booking";
import RoomModel from "../Models/Rooms";


// POST /api/bookings
export async function createBookingHandler(req: Request & { user?: any }, res: Response) {
  try {
    const { roomId, startTime, endTime } = req.body;
    if (!roomId || !startTime || !endTime) {
      return res.status(400).json({ error: "missing fields: roomId, startTime, endTime" });
    }

    // Pass userId from authenticated user
    const userId = req.user.userId;
    const userName = req.user.name;

    const booking = await bookingService.createBooking(roomId, userId, userName, startTime, endTime);
    return res.status(201).json({
      bookingId: booking._id,
      roomId: booking.roomId,
      userId: booking.userId,     
      userName: booking.userName,
      totalPrice: booking.totalPrice,
      status: booking.status,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}


// GET /api/bookings
export async function listBookingsHandler(req: Request, res: Response): Promise<void> {
  try {
    const bookings = await bookingService.listBookings();
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
}

// POST /api/bookings/:id/cancel
export async function cancelBookingHandler(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  try {
    const result = await bookingService.cancelBooking(id);
    if (!result.ok) {
      res.status(result.status || 400).json({ error: result.error });
      return;
    }
    res.json({ ok: true, booking: result.booking });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
}

export async function listUserBookingsHandler(req: Request & { user?: any }, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const bookings = await bookingService.listBookingsByUser(userId);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
}

// GET /api/bookings/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD
export async function analyticsHandler(req: Request, res: Response): Promise<void> {
  const from = req.query.from as string;
  const to = req.query.to as string;

  if (!from || !to) {
    res.status(400).json({ error: "from and to required in YYYY-MM-DD" });
    return;
  }

  const fromDate = new Date(from + "T00:00:00");
  const toDate = new Date(to + "T23:59:59");

  try {
    const confirmed = await BookingModel.find({ status: "CONFIRMED" }).lean();
    const rooms = await RoomModel.find().lean();

    const grouped: Record<string, { roomId: string; roomName: string; totalMinutes: number; totalRevenue: number }> = {};

    rooms.forEach((r) => {
      grouped[r._id.toString()] = { roomId: r._id.toString(), roomName: r.name, totalMinutes: 0, totalRevenue: 0 };
    });

    confirmed.forEach((b: any) => {
      const s = b.startTime as Date;
      const e = b.endTime as Date;

      if (e < fromDate || s > toDate) return;

      const overlapStart = s < fromDate ? fromDate : s;
      const overlapEnd = e > toDate ? toDate : e;

      const mins = Math.max(0, Math.round((overlapEnd.getTime() - overlapStart.getTime()) / 60000));
      const bookingTotalMins = Math.max(1, Math.round((e.getTime() - s.getTime()) / 60000));
      const revenuePortion = Math.round((b.totalPrice * mins) / bookingTotalMins);

      const g = grouped[b.roomId.toString()];
      if (g) {
        g.totalMinutes += mins;
        g.totalRevenue += revenuePortion;
      }
    });

    const out = Object.values(grouped).map((g) => ({
      roomId: g.roomId,
      roomName: g.roomName,
      totalHours: +(g.totalMinutes / 60).toFixed(2),
      totalRevenue: g.totalRevenue,
    }));

    res.json(out);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
}
