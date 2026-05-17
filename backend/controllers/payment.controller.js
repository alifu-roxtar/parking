import PaymentModel from "../models/paymentModel.js";

export const createPayment = async (req, res) =>{
    const { userId } = req.params;
    const { carID, amount } = req.body;

    try{
        const newPayment = await PaymentModel.create({ userId, carID, amount, status: 'completed' });
        return res.status(201).json({msg:"Payment Created Successfully", newPayment});
    }catch(error){
        console.error("Error creating payment:", error);
        return res.status(500).json({ msg: "Failed to create payment" });
    }
};

export const getPaymentsByUserId = async (req, res) =>{
    const { userId } = req.params;

    try{
        const payments = await PaymentModel.find({ userId })
        .populate({
                path: "carID",
                populate: {
                    path: "slotID"
                }
            });
        return res.status(200).json(payments);
    }catch(error){
        console.error("Error fetching payments:", error);
        return res.status(500).json({ message: "Failed to fetch payments" });
    }
};

export const getPaymentById = async (req, res) => {

    const { paymentId } = req.params;

    try {

        const payment = await PaymentModel.findById(paymentId)

            .populate({
                path: "carID",
                populate: {
                    path: "slotID"
                }
            });

        if (!payment) {

            return res.status(404).json({
                message: "Payment not found"
            });
        }

        return res.status(200).json(payment);

    } catch (error) {

        console.error("Error fetching payment:", error);

        return res.status(500).json({
            message: "Failed to fetch payment"
        });
    }
};


export const updatePaymentStatus = async (req, res) => {

    const { paymentId } = req.params;

    try {

        const updatedPayment = await PaymentModel.findByIdAndUpdate(
            paymentId,
            req.body,
            {
                returnDocument: "after"
            }
        )

        .populate({
            path: "carID",
            populate: {
                path: "slotID"
            }
        });

        if (!updatedPayment) {

            return res.status(404).json({
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            msg: "Payment Updated Successfully",
            updatedPayment
        });

    } catch (error) {

        console.error("Error updating payment status:", error);

        return res.status(500).json({
            message: "Failed to update payment status"
        });
    }
};

export const deletePayment = async (req, res) => {

    const { paymentId } = req.params;

    try {

        const deletedPayment = await PaymentModel.findByIdAndDelete(paymentId);

        if (!deletedPayment) {

            return res.status(404).json({
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            msg: "Payment Deleted Successfully"
        });

    } catch (error) {

        console.error("Error deleting payment:", error);

        return res.status(500).json({
            message: "Failed to delete payment"
        });
    }
};