import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    slotNumber: {
        type: Number,
        required: true
    },
    slotStatus: {
        type: Boolean,
        default: true
    }
}, { timestamps: true } );

const slot = mongoose.model("Slot", slotSchema);

export default slot;