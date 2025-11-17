// src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv"

const connectDB = async (): Promise<void> => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGO_URI not defined in .env");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB connected");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ DB connection error:", err.message);
    } else {
      console.error("❌ DB connection error:", err);
    }
    process.exit(1);
  }
};

export default connectDB;
