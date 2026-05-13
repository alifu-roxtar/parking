import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../Services/api";
import SideBar from "../../Pages/sidebar";

function Slots() {

    const { userId } = useParams();

    const [slots, setSlots] = useState([]);
    const [showAddSlotForm, setShowAddSlotForm] = useState(false);
    const [newSlotNumber, setNewSlotNumber] = useState("");

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isViewModal, setIsViewModal] = useState(false);

    const [isEditModal, setIsEditModal] = useState(false);
    const [editSlot, setEditSlot] = useState(null);
    const [editSlotNumber, setEditSlotNumber] = useState("");
    const [editSlotStatus, setEditSlotStatus] = useState(false);

    const [viewSchema, setViewSchema] = useState(false);

    // FETCH SLOTS
    useEffect(() => {

        if (!userId) return;

        const fetchSlots = async () => {

            try {

                const res = await API.get(`/slots/user/${userId}`);
                setSlots(res.data);

            } catch (error) {
                console.error("Error fetching slots:", error);
            }
        };

        fetchSlots();

    }, [userId]);

    // ADD SLOT
    const handleNewSlot = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post("/slots/add-new", {
                slotNumber: newSlotNumber,
                userId
            });

            alert(res.data.msg);

            window.location.reload();

            setNewSlotNumber("");
            setShowAddSlotForm(false);

        } catch (error) {
            console.error("Error adding slot:", error);
        }
    };

    // VIEW
    const openViewModal = (slot) => {
        setSelectedSlot(slot);
        setIsViewModal(true);
    };

    const closeViewModal = () => {
        setSelectedSlot(null);
        setIsViewModal(false);
    };

    // EDIT
    const openEditModal = (slot) => {

        setEditSlot(slot);
        setEditSlotNumber(slot.slotNumber);
        setEditSlotStatus(slot.slotStatus);
        setIsEditModal(true);

    };

    const closeEditModal = () => {
        setEditSlot(null);
        setIsEditModal(false);
    };

    const handleUpdateSlot = async (e) => {

        e.preventDefault();

        try {

            const res = await API.put(`/slots/update/${editSlot._id}`, {
                slotNumber: editSlotNumber,
                slotStatus: editSlotStatus
            });

            alert(res.data.msg);

            window.location.reload();

            closeEditModal();

        } catch (error) {
            console.error("Error updating slot:", error);
        }
    };

    // DELETE
    const handleDelete = async (slotId) => {

        const confirmDelete = window.confirm("Delete this slot?");

        if (!confirmDelete) return;

        try {

            await API.delete(`/slots/delete/${slotId}`);

            window.location.reload();

        } catch (error) {
            console.error("Error deleting slot:", error);
        }
    };

    return (

        <div>

            <SideBar />

            <div className="flex flex-col min-h-screen bg-blue-700 items-center py-10 ml-60 px-5">

                <h2 className="text-white text-3xl font-bold mb-6">
                    Parking Slots
                </h2>

                {/* ACTION BUTTONS */}

                <div className="w-full max-w-5xl flex justify-between mb-5">

                    <button
                        onClick={() => setViewSchema(true)}
                        className="bg-blue-500 hover:bg-blue-900 text-white px-5 py-2 rounded-lg shadow cursor-pointer"
                    >
                        View Schema
                    </button>

                    <button
                        onClick={() => setShowAddSlotForm(true)}
                        className="bg-green-500 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow cursor-pointer"
                    >
                        + Add Slot
                    </button>

                </div>

                {/* TABLE */}

                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">

                    <table className="w-full text-left">

                        <thead className="bg-gray-800 text-white">

                            <tr>
                                <th className="p-4 text-center">Slot</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {slots.length > 0 ? (

                                slots.map((slot) => (

                                    <tr
                                        key={slot._id}
                                        className="border-b hover:bg-gray-100 transition"
                                    >

                                        <td className="p-4 text-center">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                                                Slot {slot.slotNumber}
                                            </span>
                                        </td>

                                        <td className="p-4 text-center">

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    slot.slotStatus
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                }`}
                                            >
                                                {slot.slotStatus
                                                    ? "Available"
                                                    : "Occupied"}
                                            </span>

                                        </td>

                                        <td className="p-4 flex justify-center gap-3">

                                            <button
                                                onClick={() => openViewModal(slot)}
                                                className="bg-blue-500 hover:bg-blue-700 cursor-pointer px-4 py-1 text-white rounded"
                                            >
                                                View
                                            </button>

                                            <button
                                                onClick={() => openEditModal(slot)}
                                                className="bg-yellow-500 hover:bg-yellow-700 cursor-pointer px-4 py-1 text-white rounded"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(slot._id)}
                                                className="bg-red-500 hover:bg-red-700 cursor-pointer px-4 py-1 text-white rounded"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="3" className="p-12 text-center">

                                        <div className="flex flex-col items-center gap-4">

                                            <div className="text-6xl">
                                                🅿️
                                            </div>

                                            <h2 className="text-2xl font-bold text-gray-700">
                                                No Parking Slots Yet
                                            </h2>

                                            <p className="text-gray-500">
                                                Create your first parking slot to start managing parking.
                                            </p>

                                            <button
                                                onClick={() => setShowAddSlotForm(true)}
                                                className="bg-green-500 hover:bg-green-700 text-white px-5 py-2 rounded-lg cursor-pointer"
                                            >
                                                + Add New Slot
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                {/* VIEW SCHEMA */}

                {viewSchema && (

                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

                        <div className="bg-white p-6 rounded-2xl w-[95%] max-w-6xl max-h-[85vh] overflow-y-auto shadow-2xl">

                            <div className="flex justify-between items-center mb-6">

                                <div>

                                    <h2 className="text-3xl font-bold text-blue-600">
                                        Parking Layout
                                    </h2>

                                    <p className="text-gray-500">
                                        Visual overview of all parking slots
                                    </p>

                                </div>

                                <button
                                    onClick={() => setViewSchema(false)}
                                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                                >
                                    Close
                                </button>

                            </div>

                            {slots.length > 0 ? (

                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">

                                    {slots.map((slot) => (

                                        <div
                                            key={slot._id}
                                            className={`rounded-2xl p-5 shadow-md border transition hover:scale-105 ${
                                                slot.slotStatus
                                                    ? "bg-green-100 border-green-300"
                                                    : "bg-red-100 border-red-300"
                                            }`}
                                        >

                                            <div className="flex flex-col gap-4">

                                                <div className="flex justify-between items-center">

                                                    <h3 className="font-bold text-lg">
                                                        Slot {slot.slotNumber}
                                                    </h3>

                                                    <span
                                                        className={`text-xs px-3 py-1 rounded-full text-white ${
                                                            slot.slotStatus
                                                                ? "bg-green-500"
                                                                : "bg-red-500"
                                                        }`}
                                                    >
                                                        {slot.slotStatus
                                                            ? "Available"
                                                            : "Occupied"}
                                                    </span>

                                                </div>

                                                <div className="text-sm text-gray-700">

                                                    {slot.slotStatus
                                                        ? "Ready for parking"
                                                        : "Currently occupied"}

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            ) : (

                                <div className="flex flex-col items-center justify-center py-16 gap-4">

                                    <div className="text-7xl">
                                        🚘
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-700">
                                        No Parking Schema Available
                                    </h2>

                                    <p className="text-gray-500">
                                        Add parking slots first to generate parking layout.
                                    </p>

                                    <button
                                        onClick={() => {
                                            setViewSchema(false);
                                            setShowAddSlotForm(true);
                                        }}
                                        className="bg-green-500 hover:bg-green-700 text-white px-5 py-2 rounded-lg cursor-pointer"
                                    >
                                        + Add Parking Slot
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                )}

                {/* ADD SLOT MODAL */}

                {showAddSlotForm && (

                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

                        <div className="bg-white p-6 rounded-2xl w-95 shadow-2xl">

                            <h2 className="text-2xl font-bold text-blue-600 mb-5">
                                Add Parking Slot
                            </h2>

                            <form onSubmit={handleNewSlot} className="flex flex-col gap-4">

                                <input
                                    value={newSlotNumber}
                                    onChange={(e) => setNewSlotNumber(e.target.value)}
                                    className="border p-3 rounded-lg"
                                    placeholder="Enter Slot Number"
                                />

                                <div className="flex justify-end gap-3">

                                    <button
                                        className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                                    >
                                        Add Slot
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowAddSlotForm(false)}
                                        className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

                {/* VIEW MODAL */}

                {isViewModal && selectedSlot && (

                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

                        <div className="bg-white p-6 rounded-2xl w-95 shadow-2xl">

                            <h2 className="text-2xl font-bold text-blue-600 mb-5">
                                Slot Details
                            </h2>

                            <div className="space-y-3 text-gray-700">

                                <p>
                                    Slot Number:
                                    <b className="ml-2 text-blue-600">
                                        {selectedSlot.slotNumber}
                                    </b>
                                </p>

                                <p>
                                    Status:
                                    <b className={`ml-2 ${
                                        selectedSlot.slotStatus
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}>
                                        {selectedSlot.slotStatus
                                            ? "Available"
                                            : "Occupied"}
                                    </b>
                                </p>

                            </div>

                            <button
                                onClick={closeViewModal}
                                className="mt-6 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                )}


                {isEditModal && editSlot && (

                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

                        <div className="bg-white p-6 rounded-2xl w-95 shadow-2xl">

                            <h2 className="text-2xl font-bold text-blue-600 mb-5">
                                Edit Slot
                            </h2>

                            <form onSubmit={handleUpdateSlot} className="flex flex-col gap-4">

                                <input
                                    value={editSlotNumber}
                                    onChange={(e) => setEditSlotNumber(e.target.value)}
                                    className="border p-3 rounded-lg"
                                />

                                <select
                                    value={editSlotStatus}
                                    onChange={(e) => setEditSlotStatus(e.target.value === "true")}
                                    className="border p-3 rounded-lg"
                                >

                                    <option value="true">
                                        Available
                                    </option>

                                    <option value="false">
                                        Occupied
                                    </option>

                                </select>

                                <div className="flex justify-end gap-3">

                                    <button
                                        className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                                    >
                                        Save Changes
                                    </button>

                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );
}

export default Slots;