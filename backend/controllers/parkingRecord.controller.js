// import CarsModel from "../models/carModel.js";
// import slot from "../models/slotsModel.js";
import ParkingRecordModel from "../models/parkingRecords.js";


export const getParkingRecords = async(req, res) =>{
    const { userId } = req.params;
    try {
        const records = await ParkingRecordModel.find({ userId })
        .populate("carID")
        .populate("slotID")
        .sort({ entryTime: -1 });
        return res.status(200).json(records); 
    } catch (error) {
        console.log(error);
    }
};

export const deleteRecord = async(req,res) =>{
    const { id } = req.params;
    try {
        const remove = await ParkingRecordModel.findByIdAndDelete({ id });
        return res.status(200).json({msg: "Record Removed Successfully", remove });
    } catch (error) {
        console.log(error);
    }
}

