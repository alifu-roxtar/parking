import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../Services/api.js";
import SideBar from "../../Pages/sidebar.jsx";

function CarsPage() {

    const [ cars, setCars ] = useState([]);
    const [ slots, setSlots ] = useState([]);
    const { userId } = useParams();

    const [ showAddCarModal, setShowCarModal ] = useState(false);
    const [ showSchemaModal, setShowSchemaModal ] = useState(false);

    const [ selectedCar, setSelectedCar ] = useState(null);
    const [ isVeiwModalOpen, setViewModalOpen ] = useState(false);

    const [ isEditModalOpen, setEditModalOpen ] = useState(false);
    const [ editCar, setEditCar ] = useState(null);

    const [ editPlateNumber, setEditPlateNumber ] = useState("");
    const [ editDriverName, setEditDriverName ] = useState("");
    const [ editPhoneNumber, setEditPhoneNumber ] = useState("");
    const [ editSlotID, setEditSlotID ] = useState("");

    const [ plateNumber, setPlateNumber ] = useState("");
    const [ driverName, setDriverName ] = useState("");
    const [ phoneNumber, setPhoneNumber ] = useState("");
    const [ slotID, setSlotID ] = useState("");

    const openViewModal = (car) =>{
        setSelectedCar(car);
        setViewModalOpen(true);
    };

    const closeViewModal = () =>{
        setSelectedCar(null);
        setViewModalOpen(false);
    };

    const openEditModal = (car) =>{
        setEditCar(car);
        setEditPlateNumber(car.plateNumber);
        setEditDriverName(car.driverName);
        setEditPhoneNumber(car.phoneNumber);
        setEditSlotID(car.slotID?._id);
        setEditModalOpen(true);
    };

    const closeEditModal = () =>{
        setEditCar(null);
        setEditModalOpen(false);
    };

    const handleUpdateCar = async (e) =>{
        e.preventDefault();

        try {

            const resp = await API.put(`/cars/update/${editCar._id}`, {
                plateNumber: editPlateNumber,
                driverName: editDriverName,
                phoneNumber: editPhoneNumber,
                slotID: editSlotID
            });

            alert(resp.data.msg);

            closeEditModal();

            window.location.reload();

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() =>{

        if(!userId){
            return;
        }

        const getCars = async () =>{

            try {

                const res = await API.get(`/cars/user/${userId}`);
                setCars(res.data);

            } catch (error) {
                console.log(error);
            }
        };

        getCars();

    }, [ userId ]);

    useEffect(() => {

        if(!userId){
            return;
        }

        const fetchSlots = async () =>{

            try {

                const result = await API.get(`/slots/user/${userId}`);
                setSlots(result.data);

            } catch (error) {
                console.error(error);
            }
        };

        fetchSlots();

    }, [ userId ]);

    const handleAddNewCar = async (e) =>{
        e.preventDefault();

        try {

            const newCar = await API.post("/cars/add-car", {
                userId,
                slotID,
                plateNumber,
                driverName,
                phoneNumber
            });

            alert(newCar.data.msg);

            setShowCarModal(false);

            window.location.reload();

        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) =>{

        const confirmDelete = window.confirm("Are you sure you want to delete this car record?");

        if(!confirmDelete){
            return;
        }

        try {

            const res = await API.delete(`/cars/delete/${id}`);

            alert(res.data.msg);

            window.location.reload();

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>

            <SideBar />

            <div className="flex flex-col min-h-screen bg-blue-700 items-center py-10 ml-60 px-5">

                <h2 className="text-white text-3xl font-bold mb-6">
                    Parking Cars List
                </h2>

                <div className="w-full max-w-5xl flex justify-between mb-5">

                    <button
                        onClick={() => setShowSchemaModal(true)}
                        className="bg-blue-500 hover:bg-blue-900 text-white px-5 py-2 rounded-lg shadow cursor-pointer"
                    >
                        View Parking Schema
                    </button>

                    <button
                        onClick={() => setShowCarModal(true)}
                        className="bg-green-500 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow cursor-pointer"
                    >
                        + Add New Car
                    </button>

                </div>

                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">

                    <table className="w-full text-left">

                        <thead className="bg-gray-800 text-white">

                            <tr>
                                <th className="p-4 text-center">Driver Name</th>
                                <th className="p-4 text-center">Plate Number</th>
                                <th className="p-4 text-center">Slot Number</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {cars.length > 0 ? (

                                cars.map((car) => (

                                    <tr
                                        key={car._id}
                                        className="border-b hover:bg-gray-100 transition"
                                    >

                                        <td className="p-4 text-center">
                                            {car.driverName}
                                        </td>

                                        <td className="p-4 text-center">
                                            {car.plateNumber}
                                        </td>

                                        <td className="p-4 text-center">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                                                {car.slotID?.slotNumber}
                                            </span>
                                        </td>

                                        <td className="p-4 flex justify-center gap-3">

                                            <button
                                                onClick={() => openViewModal(car)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded cursor-pointer"
                                            >
                                                View
                                            </button>

                                            <button
                                                onClick={() => openEditModal(car)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-1 rounded cursor-pointer"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(car._id)}
                                                className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded cursor-pointer"
                                            >
                                                Remove
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="4" className="p-12 text-center">

                                        <div className="flex flex-col items-center gap-4">

                                            <div className="text-6xl">
                                                🚗
                                            </div>

                                            <h2 className="text-2xl font-bold text-gray-700">
                                                No Cars In Parking Yet
                                            </h2>

                                            <p className="text-gray-500">
                                                Start by adding the first parked car
                                            </p>

                                            <button
                                                onClick={() => setShowCarModal(true)}
                                                className="bg-green-500 hover:bg-green-700 text-white px-5 py-2 rounded-lg cursor-pointer"
                                            >
                                                + Add New Car
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                {/* VIEW MODAL */}

                { isVeiwModalOpen && selectedCar && (

                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

                        <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl">

                            <h2 className="text-2xl text-green-500 font-bold mb-5">
                                Car Parking Details
                            </h2>

                            <div className="space-y-3 text-gray-700">

                                <p>
                                    Plate Number:
                                    <b className="text-blue-500 ml-2">
                                        {selectedCar.plateNumber}
                                    </b>
                                </p>

                                <p>
                                    Driver Name:
                                    <b className="text-purple-700 ml-2">
                                        {selectedCar.driverName}
                                    </b>
                                </p>

                                <p>
                                    Phone Number:
                                    <b className="text-gray-800 ml-2">
                                        {selectedCar.phoneNumber}
                                    </b>
                                </p>

                                <p>
                                    Slot Number:
                                    <b className="text-green-600 ml-2">
                                        {selectedCar.slotID?.slotNumber}
                                    </b>
                                </p>

                                <p>
                                    Entry Time:
                                    <b className="text-yellow-600 ml-2">
                                        {new Date(selectedCar.entryTime).toLocaleString()}
                                    </b>
                                </p>

                            </div>

                            <button
                                onClick={closeViewModal}
                                className="mt-6 bg-gray-600 hover:bg-gray-800 text-white px-5 py-2 rounded cursor-pointer"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                )}

                {/* EDIT MODAL */}

                { isEditModalOpen && editCar && (

                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

                        <div className="bg-white p-6 rounded-2xl w-105 shadow-2xl">

                            <h2 className="text-2xl font-bold text-blue-500 mb-5">
                                Edit Car Parking Details
                            </h2>

                            <form onSubmit={handleUpdateCar} className="flex flex-col gap-4">

                                <input
                                    type="text"
                                    value={editPlateNumber}
                                    onChange={(e) => setEditPlateNumber(e.target.value)}
                                    placeholder="Plate Number"
                                    className="border p-3 rounded-lg"
                                />

                                <input
                                    type="text"
                                    value={editDriverName}
                                    onChange={(e) => setEditDriverName(e.target.value)}
                                    placeholder="Driver Name"
                                    className="border p-3 rounded-lg"
                                />

                                <input
                                    type="number"
                                    value={editPhoneNumber}
                                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                                    placeholder="Phone Number"
                                    className="border p-3 rounded-lg"
                                />

                                <select
                                    className="p-3 cursor-not-allowed border rounded-lg"
                                    value={editSlotID}
                                >

                                    {slots
                                        .map((slot) => (

                                            <option key={slot._id} value={slot._id}>
                                                Slot {slot.slotNumber} - Occupied
                                            </option>

                                        ))
                                    }

                                </select>

                                <div className="flex justify-end gap-3">

                                    <button
                                        type="submit"
                                        className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                                    >
                                        Update
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

                {showAddCarModal && (

                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

                        <div className="bg-white p-6 rounded-2xl w-105 shadow-2xl">

                            <h2 className="text-2xl font-bold text-blue-500 mb-5">
                                Add New Car
                            </h2>

                            <form onSubmit={handleAddNewCar} className="flex flex-col gap-4">

                                <input
                                    type="text"
                                    value={driverName}
                                    onChange={(e) => setDriverName(e.target.value)}
                                    placeholder="Driver Name"
                                    className="border p-3 rounded-lg"
                                />

                                <input
                                    type="text"
                                    value={plateNumber}
                                    onChange={(e) => setPlateNumber(e.target.value)}
                                    placeholder="Plate Number"
                                    className="border p-3 rounded-lg"
                                />

                                <input
                                    type="number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Phone Number"
                                    className="border p-3 rounded-lg"
                                />

                                <select
                                    className="p-3 border rounded-lg"
                                    value={slotID}
                                    onChange={(e) => setSlotID(e.target.value)}
                                >

                                    <option value="">
                                        Select Available Slot
                                    </option>

                                    {slots
                                        .filter((slot) => slot.slotStatus === true)
                                        .map((slot) => (

                                            <option key={slot._id} value={slot._id}>
                                                Slot {slot.slotNumber} - Available
                                            </option>

                                        ))
                                    }

                                </select>

                                <div className="flex justify-end gap-3">

                                    <button
                                        type="submit"
                                        className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                                    >
                                        + Add Car
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowCarModal(false)}
                                        className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

                {/* PARKING SCHEMA MODAL */}

                {showSchemaModal && (

                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

                        <div className="bg-white rounded-2xl p-6 w-[95%] max-w-6xl shadow-2xl">

                            <div className="flex justify-between items-center mb-6">

                                <div>

                                    <h2 className="text-3xl font-bold text-blue-600">
                                        Parking Schema
                                    </h2>

                                    <p className="text-gray-500">
                                        Visual overview of all parking slots
                                    </p>

                                </div>

                                <button
                                    onClick={() => setShowSchemaModal(false)}
                                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                                >
                                    Close
                                </button>

                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">

                                {slots.map((slot) => {

                                    const parkedCar = cars.find(
                                        (car) => car.slotID?._id === slot._id
                                    );

                                    return (

                                        <div
                                            key={slot._id}
                                            className={`rounded-2xl p-5 border shadow-md transition hover:scale-105 ${
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

                                                {!slot.slotStatus && parkedCar && (

                                                    <div className="space-y-2 text-sm">

                                                        <p>
                                                            Driver:
                                                            <span className="font-semibold ml-1">
                                                                {parkedCar.driverName}
                                                            </span>
                                                        </p>

                                                        <p>
                                                            Plate:
                                                            <span className="font-semibold text-blue-600 ml-1">
                                                                {parkedCar.plateNumber}
                                                            </span>
                                                        </p>

                                                    </div>

                                                )}

                                                {slot.slotStatus && (

                                                    <p className="text-gray-600 text-sm">
                                                        Empty parking slot
                                                    </p>

                                                )}

                                            </div>

                                        </div>

                                    );
                                })}

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default CarsPage;