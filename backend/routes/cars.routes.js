import express from "express";

import { addCar, getCarsForUser, deleteCar, updateCar } from "../controllers/cars.controller.js";

const CarsRouter = express.Router();

CarsRouter.post("/add-car", addCar);
CarsRouter.get("/user/:userId", getCarsForUser);
CarsRouter.delete("/delete/:id", deleteCar);
CarsRouter.put("/update/:id", updateCar);

export default CarsRouter;