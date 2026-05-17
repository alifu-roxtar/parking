import express from "express";
import { createPayment, getPaymentsByUserId, getPaymentById, updatePaymentStatus, deletePayment }from "../controllers/payment.controller.js" 

const PaymentRoutes = express.Router();

PaymentRoutes.post("/create/:userId", createPayment);
PaymentRoutes.get("/all/:userId", getPaymentsByUserId);
PaymentRoutes.get("/:paymentId", getPaymentById);
PaymentRoutes.put("/update/:paymentId", updatePaymentStatus);
PaymentRoutes.delete("/delete/:paymentId", deletePayment);

export default PaymentRoutes;