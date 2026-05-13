import CarsModel from "../models/carModel.js";
import slot from "../models/slotsModel.js";
import ParkingRecordModel from "../models/parkingRecords.js";

export const addCar = async (req, res) => {

    const {
        userId,
        slotID,
        plateNumber,
        driverName,
        phoneNumber
    } = req.body;

    try {

        const existingSlot = await slot.findById(slotID);

        if (!existingSlot) {
            return res.status(404).json({
                msg: "Slot Not Found"
            });
        }

        if (existingSlot.slotStatus === false) {
            return res.status(400).json({
                msg: "Slot Already Occupied"
            });
        }

        const newCar = await CarsModel.create({
            slotID,
            plateNumber,
            driverName,
            phoneNumber
        });

        await slot.findByIdAndUpdate(
            slotID,
            {
                $set: {
                    slotStatus: false
                }
            }
        );

        const populatedCar = await CarsModel.findById(newCar._id)
            .populate("slotID");

        const parkingRecord = await ParkingRecordModel.create({
            userId,
            carID: newCar._id,
            slotID
        });

        return res.status(201).json({
            msg: "Car Recorded Successfully And Slot Updated",
            populatedCar,
            parkingRecord
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Error Adding Car",
            error
        });
    }
};

export const getCarsForUser = async (req, res) => {

    const userId = req.params.userId;

    try {

        const userSlots = await slot.find({ userId });

        const slotIds = userSlots.map(slot => slot._id);

        const userCars = await CarsModel.find({
            slotID: { $in: slotIds }
        }).populate("slotID");

        return res.status(200).json(userCars);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            msg: "Error Fetching Cars"
        });
    }
};

export const updateCar = async (req, res) => {
    const { id } = req.params;

    const { slotID, plateNumber, driverName, phoneNumber } = req.body;

    try {
        const existingCar = await CarsModel.findById(id);

        if (!existingCar) {
            return res.status(404).json({ msg: "Car Not Found" });
        }

        const oldSlotID = existingCar.slotID?.toString();
        const newSlotID = slotID;

        // ONLY if slot changes
        if (oldSlotID && oldSlotID !== newSlotID) {

            const oldSlot = await slot.findById(oldSlotID);
            const newSlot = await slot.findById(newSlotID);

            if (!newSlot) {
                return res.status(404).json({ msg: "New Slot Not Found" });
            }

            if (!newSlot.slotStatus) {
                return res.status(400).json({ msg: "Selected Slot Already Occupied" });
            }

            // free old slot
            await slot.findByIdAndUpdate(oldSlotID, {
                $set: { slotStatus: true }
            });

            // occupy new slot
            await slot.findByIdAndUpdate(newSlotID, {
                $set: { slotStatus: false }
            });
        }

        const updatedCar = await CarsModel.findByIdAndUpdate(
            id,
            {
                slotID,
                plateNumber,
                driverName,
                phoneNumber
            },
            { returnDocument: "after" }
        ).populate("slotID");

        return res.status(200).json({
            msg: "Car Record Updated Successfully",
            updatedCar
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error Updating Car" });
    }
};

export const deleteCar = async (req, res) => {

    const { id } = req.params;

    try {

        const existingCar = await CarsModel.findById(id);

        if (!existingCar) {
            return res.status(404).json({
                msg: "Car Not Found"
            });
        };

        const activeRecord = await ParkingRecordModel.findOne({
            carID: id,
            exitTime: null
        });

        if(activeRecord) {
            const exitTime = new Date();

            const durationMilliseconds = exitTime - activeRecord.entryTime;

            const durationMinutes = Math.floor(durationMilliseconds / 60000);

            activeRecord.exitTime = exitTime;

            activeRecord.duration = durationMinutes;

            await activeRecord.save();
        };

        await slot.findByIdAndUpdate(
            existingCar.slotID,
            {
                $set: {
                    slotStatus: true
                }
            }
        );

        const removedCar = await CarsModel.findByIdAndDelete(id);

        return res.status(200).json({
            msg: "Car Record Deleted Successfully",
            removedCar
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            msg: "Error Deleting Car"
        });
    }
};



// import CarsModel from "../models/carModel.js";
// import slot from "../models/slotsModel.js";


// export const addCar = async (req, res) =>{
//     const { slotID, plateNumber, driverName, phoneNumber } = req.body;

//     try {
//         const newCar = await CarsModel.create({ slotID, plateNumber, driverName, phoneNumber });
//         if(newCar){
//             const updateSlotStatus = await slot.findByIdAndUpdate({_id: slotID}, { "$set": {slotStatus: false }});

//             return res.status(201).json({msg: "Car Recorded Successfully and Slot Status Updated", newCar, updateSlotStatus });
//         }
//     } catch (error) {
//         res.status(500).json({ message: "Error adding car", error });
//     }
// }

// export const getCarsForUser = async (req, res) =>{
//     const userId = req.params.userId;
//     try {
//         const userSlots = await slot.find({ userId });
//         const slotIds = userSlots.map( slot => slot._id );
//         const userCars = await CarsModel.find({ slotID: { $in: slotIds } }).populate("slotID");
//         return res.status(200).json(userCars);
//     } catch (error) {
//         console.log(error);
//     }
// }

// export const updateCar = async (req, res) =>{
//     const { id } = req.params;
//     try {
//         const updatedCar = await CarsModel.findByIdAndUpdate(id, req.body, { new: true });
//         return res.status(200).json({ msg: "Car Record Updated Successfully", updatedCar });
//     } catch (error) {
//         console.log(error);
//     }
// };

// export const deleteCar = async (req, res) =>{
//     const { id } = req.params;
//     try{
//         const removedCar = await CarsModel.findByIdAndDelete(id);
//         return res.status(200).json({ msg: "Car Record Deleted Successfully", removedCar });
//     } catch (error) {
//         console.log(error);
//     }
// };