import express from "express";
import { getParkingRecords } from "../controllers/parkingRecord.controller.js";

const RecordRoutes = express.Router();

RecordRoutes.get('/records/:userId', getParkingRecords);

export default RecordRoutes;