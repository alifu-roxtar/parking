import slot from "../models/slotsModel.js";

export const createSlot = async (req, res) => {
    const { userId, slotNumber } = req.body;

    try {
        const newSlot = await slot.create({ userId, slotNumber });
        res.status(201).json({msg:"Slot created successfully", slot: newSlot});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getSlotsForUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const slots = await slot.find({ userId });
        res.status(200).json(slots);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateSlotStatus = async (req, res) => {
    const { slotId } = req.params;

    try {
        const updatedSlot = await slot.findByIdAndUpdate(slotId, req.body, { new: true });
        res.status(200).json({msg:"Slot status updated successfully", slot: updatedSlot});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};  

export const deleteSlot = async (req, res) => {
    const { slotId } = req.params;

    try {
        const deletedSlot = await slot.findByIdAndDelete(slotId);
        res.status(200).json({msg:"Slot deleted successfully"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};