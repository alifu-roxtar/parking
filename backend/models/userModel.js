import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
}, { timestamps: true });

const user = mongoose.model("User", userSchema);

export default user;