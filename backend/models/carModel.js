import mongoose from "mongoose";


const carSchema = new mongoose.Schema({
    slotID: { type: mongoose.Types.ObjectId, ref: "Slot", required: true },
    plateNumber: { type: String, required: true },
    driverName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    entryTime: { type: Date, default: Date.now }
});

const CarsModel = mongoose.model("Car", carSchema);

export default CarsModel;