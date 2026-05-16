import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../Services/api.js";
import SideBar from "../../Pages/sidebar.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



function ParkingRecords (){
    const [ records, setRecords ] = useState([]);
    const { userId } = useParams();

    useEffect(() =>{
        const fetchRecords = async ()=>{
            const res = await API.get(`/parking/records/${userId}`);
            setRecords(res.data);
        }
        fetchRecords();
    }, [userId] );

    const handleDeleteRecord = async (id) =>{
        const confirmDelete = confirm("Are you sure to delete this record ?" );
        if(!confirmDelete) return;
        try{
            const removeRecord = await API.delete(`/parking/delete/${id}`);
            console.log(removeRecord);
            window.location.reload(); 
        }catch(error){
            console.log(error);
        }
    }

    const exportToExcel = () => {

    const formattedData = records.map((record) => ({

        DriverName: record.carID?.driverName ? record.carID?.driverName : "Car Removed",

        PlateNumber: record.carID?.plateNumber ? record.carID?.plateNumber : "N/A",

        SlotNumber: record.slotID?.slotNumber,

        EntryTime: new Date(
            record.entryTime
        ).toLocaleString(),

        ExitTime: record.exitTime
            ? new Date(record.exitTime).toLocaleString()
            : "Still Parked",

        DurationMinutes: record.duration == null ? "Still In Parking"
                                         : record.duration
    }));

    // create worksheet
    const worksheet = XLSX.utils.json_to_sheet(
        formattedData
    );

    // create workbook
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Parking Records"
    );

    // generate excel buffer
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
    });

    // create blob
    const data = new Blob(
        [excelBuffer],
        // {
        //     type:
        //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
        // }
    );

    saveAs(data, "ParkingRecords.xlsx");
};

    return (
        <div>
            <SideBar />
            <div className="flex flex-col min-h-screen bg-blue-700 items-center py-10 ml-60 px-5">
                <h2 className="text-white text-3xl font-bold mb-6">
                    Parking Records For Today
                </h2>
                <div className="w-full max-w-5xl flex justify-between mb-5">

                    <button
                        onClick={exportToExcel}
                        className="bg-blue-500 hover:bg-blue-900 text-white px-5 py-3 rounded-lg shadow cursor-pointer"
                    >
                        Export Report Data
                    </button>
                </div>

                <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">

                    <table className="w-full text-left">

                        <thead className="bg-gray-800 text-white">

                            <tr>
                                <th className="p-4 text-center">Driver Name</th>
                                <th className="p-4 text-center">Plate Number</th>
                                <th className="p-4 text-center">Slot Number</th>
                                <th className="p-4 text-center">Entry Time</th>
                                <th className="p-4 text-center">Exit Time</th>
                                <th className="p-4 text-center">Duration</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>

                        </thead>

                        <tbody>

                            {records.length > 0 ? (

                                records.map((record) => (

                                    <tr
                                        key={record._id}
                                        className="border-b hover:bg-gray-100 transition"
                                    >

                                        <td className="p-4 text-center">
                                            {record.carID?.driverName ? (
                                                record.carID?.driverName
                                            ) : (
                                                <span className="text-gray-400">Car Removed</span>
                                            )}
                                        </td>

                                        <td className="p-4 text-center">
                                            {record.carID?.plateNumber ? (
                                                record.carID?.plateNumber
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                            
                                        </td>
                                            
                                        <td className="p-4 text-center">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                                                {record.slotID?.slotNumber}
                                            </span>
                                        </td>

                                        <td className="p-4 text-center">
                                            {new Date(record.entryTime).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            {record.exitTime ? new Date(record.exitTime).toLocaleString() : 'N/A'}
                                        </td>

                                        <td className="p-4 text-center">
                                            {record.duration == null ? (

                                            <span className="text-green-600 font-semibold">Still Parking</span>
                                        ) : (
                                            <span><b className="text-green-500">{record.duration}</b> Minutes</span>
                                        )}
                                        </td>

                                        <td className="p-4 flex justify-center gap-3">
                                            { record.duration == null ? (

                                            <button
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
                                            >
                                                Remove In Parking
                                            </button>
                                            ) : (

                                            <button
                                                onClick={() => handleDeleteRecord(record._id)}
                                                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
                                            >
                                                Delete Record
                                            </button>
                                            )
                                            }

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
                                                No Parking Records Data Yet
                                            </h2>
                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>
            </div>
        </div>
    )
}

export default ParkingRecords;