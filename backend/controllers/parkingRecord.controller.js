// import CarsModel from "../models/carModel.js";
// import slot from "../models/slotsModel.js";
import ParkingRecordModel from "../models/parkingRecords.js";


export const getParkingRecords = async(req, res) =>{
    const { userId } = req.params;
    try {
        const records = await ParkingRecordModel.find( userId );
        return res.status(200).json(records); 
    } catch (error) {
        console.log(error);
    }
};

