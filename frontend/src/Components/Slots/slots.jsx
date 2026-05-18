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
            setNewSlotNumber("");
            setShowAddSlotForm(false);

            const refreshed = await API.get(`/slots/user/${userId}`);
            setSlots(refreshed.data);

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
            closeEditModal();

            const refreshed = await API.get(`/slots/user/${userId}`);
            setSlots(refreshed.data);

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

            const refreshed = await API.get(`/slots/user/${userId}`);
            setSlots(refreshed.data);

        } catch (error) {
            console.error("Error deleting slot:", error);
        }
    };

    // DERIVED STATS
    const totalSlots = slots.length;
    const availableSlots = slots.filter(s => s.slotStatus).length;
    const occupiedSlots = slots.filter(s => !s.slotStatus).length;

    return (

        <div className="flex min-h-screen bg-[#0f172a]">

            <SideBar />

            <div className="flex-1 ml-60 p-8 overflow-y-auto">

                {/* PAGE HEADER */}
                <div className="mb-8">

                    <h1 className="text-2xl font-bold text-white">
                        Parking Slots
                    </h1>

                    <p className="text-slate-400 mt-1 text-sm">
                        Manage and monitor all parking slots in your facility
                    </p>

                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

                    {/* Total Slots */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-400">
                                    Total Slots
                                </p>

                                <p className="text-3xl font-bold text-white mt-1">
                                    {totalSlots}
                                </p>

                            </div>

                            <div className="h-12 w-12 bg-blue-500/15 rounded-lg flex items-center justify-center">

                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>

                            </div>

                        </div>

                    </div>

                    {/* Available Slots */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-400">
                                    Available Slots
                                </p>

                                <p className="text-3xl font-bold text-emerald-400 mt-1">
                                    {availableSlots}
                                </p>

                            </div>

                            <div className="h-12 w-12 bg-emerald-500/15 rounded-lg flex items-center justify-center">

                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>

                            </div>

                        </div>

                    </div>

                    {/* Occupied Slots */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-400">
                                    Occupied Slots
                                </p>

                                <p className="text-3xl font-bold text-red-400 mt-1">
                                    {occupiedSlots}
                                </p>

                            </div>

                            <div className="h-12 w-12 bg-red-500/15 rounded-lg flex items-center justify-center">

                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ACTION BAR */}
                <div className="flex items-center justify-between mb-5">

                    <div className="flex items-center gap-2">

                        <div className="h-7 w-1 bg-blue-500 rounded-full"></div>

                        <h2 className="text-lg font-semibold text-white">
                            All Slots
                        </h2>

                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => setViewSchema(true)}
                            className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                            </svg>
                            View Layout
                        </button>

                        <button
                            onClick={() => setShowAddSlotForm(true)}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Slot
                        </button>

                    </div>

                </div>

                {/* TABLE CARD */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">

                    <table className="w-full text-left">

                        <thead>

                            <tr className="bg-slate-900/50 border-b border-slate-700">

                                <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                                    Slot
                                </th>

                                <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                                    Status
                                </th>

                                <th className="px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-700/50">

                            {slots.length > 0 ? (

                                slots.map((slot) => (

                                    <tr
                                        key={slot._id}
                                        className="hover:bg-slate-700/30 transition-colors"
                                    >

                                        <td className="px-6 py-4 text-center">

                                            <span className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-md text-sm font-semibold">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Slot {slot.slotNumber}
                                            </span>

                                        </td>

                                        <td className="px-6 py-4 text-center">

                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    slot.slotStatus
                                                        ? "bg-emerald-500/15 text-emerald-400"
                                                        : "bg-red-500/15 text-red-400"
                                                }`}
                                            >

                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${
                                                        slot.slotStatus
                                                            ? "bg-emerald-400"
                                                            : "bg-red-400"
                                                    }`}
                                                ></span>

                                                {slot.slotStatus
                                                    ? "Available"
                                                    : "Occupied"}

                                            </span>

                                        </td>

                                        <td className="px-6 py-4">

                                            <div className="flex justify-center gap-2">

                                                <button
                                                    onClick={() => openViewModal(slot)}
                                                    className="inline-flex items-center gap-1 text-blue-400 hover:bg-blue-500/10 px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    View
                                                </button>

                                                <button
                                                    onClick={() => openEditModal(slot)}
                                                    className="inline-flex items-center gap-1 text-amber-400 hover:bg-amber-500/10 px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(slot._id)}
                                                    className="inline-flex items-center gap-1 text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="3" className="px-6 py-20">

                                        <div className="flex flex-col items-center gap-4">

                                            <div className="h-20 w-20 bg-slate-700/50 rounded-full flex items-center justify-center">

                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>

                                            </div>

                                            <div className="text-center">

                                                <h3 className="text-lg font-semibold text-slate-300">
                                                    No parking slots yet
                                                </h3>

                                                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                                                    Start by adding the first parking slot to your facility
                                                </p>

                                            </div>

                                            <button
                                                onClick={() => setShowAddSlotForm(true)}
                                                className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add New Slot
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                {/* =================== MODALS =================== */}

                {/* VIEW SCHEMA MODAL */}

                {viewSchema && (

                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">

                        <div className="bg-slate-800 rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-700">

                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-700">

                                <div>

                                    <h2 className="text-xl font-bold text-white">
                                        Parking Layout
                                    </h2>

                                    <p className="text-sm text-slate-400 mt-0.5">
                                        Visual overview of all parking slots
                                    </p>

                                </div>

                                <button
                                    onClick={() => setViewSchema(false)}
                                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                            </div>

                            {/* Modal Body */}
                            <div className="p-6">

                                {slots.length > 0 ? (

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

                                        {slots.map((slot) => (

                                            <div
                                                key={slot._id}
                                                className={`rounded-xl p-4 border transition-all hover:scale-[1.03] hover:shadow-lg ${
                                                    slot.slotStatus
                                                        ? "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50"
                                                        : "bg-red-500/10 border-red-500/30 hover:border-red-500/50"
                                                }`}
                                            >

                                                <div className="flex flex-col gap-3">

                                                    <div className="flex items-center justify-between">

                                                        <h3 className="font-bold text-white">
                                                            Slot {slot.slotNumber}
                                                        </h3>

                                                        <span
                                                            className={`h-2.5 w-2.5 rounded-full ${
                                                                slot.slotStatus
                                                                    ? "bg-emerald-400"
                                                                    : "bg-red-400"
                                                            }`}
                                                        ></span>

                                                    </div>

                                                    <span
                                                        className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${
                                                            slot.slotStatus
                                                                ? "bg-emerald-500/15 text-emerald-400"
                                                                : "bg-red-500/15 text-red-400"
                                                        }`}
                                                    >
                                                        {slot.slotStatus
                                                            ? "Available"
                                                            : "Occupied"}
                                                    </span>

                                                    <p className="text-xs text-slate-400">
                                                        {slot.slotStatus
                                                            ? "Ready for parking"
                                                            : "Currently occupied"}
                                                    </p>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                ) : (

                                    <div className="flex flex-col items-center justify-center py-16 gap-4">

                                        <div className="h-20 w-20 bg-slate-700/50 rounded-full flex items-center justify-center">

                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                            </svg>

                                        </div>

                                        <div className="text-center">

                                            <h3 className="text-lg font-semibold text-slate-300">
                                                No Layout Available
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-1">
                                                Add parking slots first to see the layout.
                                            </p>

                                        </div>

                                        <button
                                            onClick={() => {
                                                setViewSchema(false);
                                                setShowAddSlotForm(true);
                                            }}
                                            className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add Parking Slot
                                        </button>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                )}

                {/* ADD SLOT MODAL */}

                {showAddSlotForm && (

                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">

                        <div className="bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-slate-700">

                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-700">

                                <div>

                                    <h2 className="text-lg font-bold text-white">
                                        Add Parking Slot
                                    </h2>

                                    <p className="text-sm text-slate-400 mt-0.5">
                                        Create a new slot in your facility
                                    </p>

                                </div>

                                <button
                                    onClick={() => setShowAddSlotForm(false)}
                                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleNewSlot} className="p-6">

                                <div className="space-y-4">

                                    <div>

                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                            Slot Number
                                        </label>

                                        <input
                                            value={newSlotNumber}
                                            onChange={(e) => setNewSlotNumber(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                            placeholder="e.g. A1, B2, C3"
                                            required
                                        />

                                    </div>

                                </div>

                                {/* Modal Footer */}
                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">

                                    <button
                                        type="button"
                                        onClick={() => setShowAddSlotForm(false)}
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                                    >
                                        Add Slot
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

                {/* VIEW MODAL */}

                {isViewModal && selectedSlot && (

                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">

                        <div className="bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-slate-700">

                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-700">

                                <h2 className="text-lg font-bold text-white">
                                    Slot Details
                                </h2>

                                <button
                                    onClick={closeViewModal}
                                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-5">

                                {/* Slot Visual Card */}
                                <div className={`rounded-xl p-5 border-2 ${
                                    selectedSlot.slotStatus
                                        ? "bg-emerald-500/10 border-emerald-500/30"
                                        : "bg-red-500/10 border-red-500/30"
                                }`}>

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-sm text-slate-400">
                                                Slot Number
                                            </p>

                                            <p className="text-2xl font-bold text-white mt-0.5">
                                                {selectedSlot.slotNumber}
                                            </p>

                                        </div>

                                        <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                                            selectedSlot.slotStatus
                                                ? "bg-emerald-500/20"
                                                : "bg-red-500/20"
                                        }`}>

                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 ${
                                                selectedSlot.slotStatus
                                                    ? "text-emerald-400"
                                                    : "text-red-400"
                                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>

                                        </div>

                                    </div>

                                </div>

                                {/* Status Detail */}
                                <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4 border border-slate-700">

                                    <span className="text-sm font-medium text-slate-400">
                                        Current Status
                                    </span>

                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                            selectedSlot.slotStatus
                                                ? "bg-emerald-500/15 text-emerald-400"
                                                : "bg-red-500/15 text-red-400"
                                        }`}
                                    >

                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                selectedSlot.slotStatus
                                                    ? "bg-emerald-400"
                                                    : "bg-red-400"
                                            }`}
                                        ></span>

                                        {selectedSlot.slotStatus
                                            ? "Available"
                                            : "Occupied"}

                                    </span>

                                </div>

                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end p-6 pt-0">

                                <button
                                    onClick={closeViewModal}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition cursor-pointer"
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                )}

                {/* EDIT MODAL */}

                {isEditModal && editSlot && (

                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">

                        <div className="bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-slate-700">

                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-700">

                                <div>

                                    <h2 className="text-lg font-bold text-white">
                                        Edit Slot
                                    </h2>

                                    <p className="text-sm text-slate-400 mt-0.5">
                                        Update slot information
                                    </p>

                                </div>

                                <button
                                    onClick={closeEditModal}
                                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleUpdateSlot} className="p-6">

                                <div className="space-y-4">

                                    <div>

                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                            Slot Number
                                        </label>

                                        <input
                                            value={editSlotNumber}
                                            onChange={(e) => setEditSlotNumber(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                            required
                                        />

                                    </div>

                                    <div>

                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                            Status
                                        </label>

                                        <select
                                            value={editSlotStatus}
                                            onChange={(e) => setEditSlotStatus(e.target.value === "true")}
                                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                                        >

                                            <option value="true">
                                                Available
                                            </option>

                                            <option value="false">
                                                Occupied
                                            </option>

                                        </select>

                                    </div>

                                </div>

                                {/* Modal Footer */}
                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">

                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                                    >
                                        Save Changes
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
