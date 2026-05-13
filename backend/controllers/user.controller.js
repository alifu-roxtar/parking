import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import user from "../models/userModel.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) =>{
    const { username, email, password } = req.body;

    try {
        const isExist = await user.findOne({ email });

        if(isExist) return res.status(400).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await user.create({ username, email, password: hashedPassword });

        if(newUser) return res.status(201).json({ msg: "User created successfully" });
    } catch (error) {
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const login = async (req, res) =>{
    const { email, password } = req.body;

    try {
        const isExist = await user.findOne({ email });

        if(!isExist) return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, isExist.password);

        if(!isMatch) return res.status(400).json({ msg: "Invalid Password" });

        const token = jwt.sign({ id: isExist._id, username: isExist.username, email: isExist.email }, JWT_SECRET, { expiresIn: "1d" });

        return res.status(200).json({ msg: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateUser = async (req, res) =>{
    const { id } = req.params;
    const { username, email } = req.body;

    try {
        const update = await user.findByIdAndUpdate(id, { username, email }, { new: true });

        if(update) return res.status(200).json({ msg: "User updated successfully", update });
    } catch (error) {
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getLoggedInUser = async (req, res) =>{
    const token = req.headers.authorization;
    if(!token) return res.status(401).json({ msg: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        return res.status(200).json({ msg: "User found", user: decoded });
    } catch (error) {
        return res.status(500).json({ msg: "Internal server error" });
    }
};
