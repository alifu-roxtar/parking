import express from "express";
import { register, login, updateUser, getLoggedInUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.put("/update/:id", updateUser);
userRouter.get("/me", getLoggedInUser);

export default userRouter;