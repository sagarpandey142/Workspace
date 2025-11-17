import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import bookingsRouter from "./routes/Booking";
import roomsRouter from "./routes/Room";
import authRouter from "./routes/auth"
import { authMiddleware } from "./middleware/auth";

const app = express();

app.use(cors({
    origin:"*"
}));
app.use(bodyParser.json());

// Routes
app.use("/api/bookings", bookingsRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/auth", authRouter);

// basic health
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

export default app;
