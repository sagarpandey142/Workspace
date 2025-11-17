
import express from "express";
import * as roomController from "../controllers/roomController";

const router = express.Router();

// List rooms
router.get("/", roomController.getRooms);

// Seed rooms 
router.post("/seed", roomController.seed);

export default router;
