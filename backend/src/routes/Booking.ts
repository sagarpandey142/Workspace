
import express, { Request, Response } from "express";
import * as bookingController from "../controllers/BookingController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.use(authMiddleware);
// List all bookings
router.get("/", (req: Request, res: Response) => bookingController.listBookingsHandler(req, res));

//List Booking based On Id
router.get("/ListBookingBasedOnId", authMiddleware, bookingController.listUserBookingsHandler);

// Create a booking
router.post("/", (req: Request, res: Response) => bookingController.createBookingHandler(req, res));

// Cancel a booking
router.post("/:id/cancel", (req: Request, res: Response) => bookingController.cancelBookingHandler(req, res));

// Analytics (date range)
router.get("/analytics", (req: Request, res: Response) => bookingController.analyticsHandler(req, res));

export default router;
