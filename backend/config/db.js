import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = () =>{
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log(err));
};

export default ConnectDB;