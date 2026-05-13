import express from "express";
import { createSlot, getSlotsForUser, updateSlotStatus, deleteSlot } from "../controllers/slot.controller.js";

const slotRouter = express.Router();

slotRouter.post("/add-new", createSlot);
slotRouter.get("/user/:userId", getSlotsForUser);
slotRouter.put("/update/:slotId", updateSlotStatus);
slotRouter.delete("/delete/:slotId", deleteSlot);

export default slotRouter;