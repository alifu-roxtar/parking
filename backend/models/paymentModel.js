import mongoose from "mongoose";

const PaymentsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carID: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const PaymentModel = mongoose.model('Payment', PaymentsSchema);

export default PaymentModel;