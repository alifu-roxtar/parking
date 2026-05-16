import express from "express";
import { getParkingRecords, deleteRecord } from "../controllers/parkingRecord.controller.js";

const RecordRoutes = express.Router();

RecordRoutes.get('/records/:userId', getParkingRecords);
RecordRoutes.delete('/delete/:id', deleteRecord );

export default RecordRoutes;