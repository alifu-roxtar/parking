import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import ConnectDB from "./config/db.js";

import userRouter from "./routes/user.routes.js";
import slotRouter from "./routes/slots.routes.js";
import CarsRouter from "./routes/cars.routes.js";
import RecordRoutes from "./routes/records.routes.js";
import PaymentRoutes from "./routes/payments.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

ConnectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req,res) =>{
    res.json({msg: "Server Is Running"});
});

app.use("/api/users", userRouter);
app.use("/api/slots", slotRouter);
app.use("/api/cars", CarsRouter);
app.use("/api/parking", RecordRoutes);
app.use("/api/payments", PaymentRoutes);

app.listen(port , () =>{
    console.log(`Server is running on port:  http://localhost:${port}`);
});