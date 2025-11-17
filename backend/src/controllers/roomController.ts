// src/controllers/RoomController.ts
import { Request, Response } from "express";
import RoomModel, { RoomDoc } from "../Models/Rooms";

// List all rooms
export async function getRooms(req: Request, res: Response): Promise<void> {
  try {
    const rooms = await RoomModel.find().lean(); 
    res.json(rooms); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
}

// Seed rooms 
export async function seed(req: Request, res: Response): Promise<void> {
  try {
    const count = await RoomModel.countDocuments();
    if (count > 0) {
      res.json({ ok: true, seeded: false }); 
      return; 
    }

    await RoomModel.create([
      { name: "Cabin 1", baseHourlyRate: 400, capacity: 4 },
      { name: "Cabin 2", baseHourlyRate: 350, capacity: 3 },
      { name: "Conference A", baseHourlyRate: 800, capacity: 12 },
    ]);

    res.json({ ok: true, seeded: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to seed rooms" });
  }
}

