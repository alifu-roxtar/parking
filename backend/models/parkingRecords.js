import mongoose from "mongoose";

const ParkingRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User"},
    carID: { type: mongoose.Types.ObjectId, ref: "Car", required: true },
    slotID: { type: mongoose.Types.ObjectId, ref: "Slot", required: true },
    entryTime: { type: Date, default: Date.now() },
    exitTime: { type: Date, default: null},
    duration: { type: Number, default: null}
});

const ParkingRecordModel = mongoose.model("ParkingRecord", ParkingRecordSchema);

export default ParkingRecordModel;