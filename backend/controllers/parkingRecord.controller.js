import mongoose from "mongoose";
import ParkingRecordModel from "../models/parkingRecords.js";

export const getParkingRecords = async (req, res) => {

    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {

        return res.status(400).json({
            message: "Invalid User ID"
        });
    }

    try {

        const records = await ParkingRecordModel.find({
            userId
        })

        .populate("carID")
        .populate("slotID")

        .sort({
            entryTime: -1
        });

        return res.status(200).json(records);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Failed To Fetch Parking Records"
        });
    }
};

export const deleteRecord = async (req, res) => {

    const { id } = req.params;

    try {

        const remove = await ParkingRecordModel.findByIdAndDelete(id);

        if (!remove) {

            return res.status(404).json({
                message: "Record Not Found"
            });
        }

        return res.status(200).json({
            msg: "Record Removed Successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Failed To Delete Record"
        });
    }
};