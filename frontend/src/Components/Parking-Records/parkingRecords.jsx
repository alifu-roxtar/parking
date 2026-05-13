import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../Services/api.js";
import SideBar from "../../Pages/sidebar.jsx";


function ParkingRecords (){
    return (
        <div>
            <SideBar />
            <div className="flex flex-col min-h-screen bg-blue-700 items-center py-10 ml-60 px-5">
                <h2 className="text-white text-3xl font-bold mb-6">
                    Parking Records For Today
                </h2>
                <div className="w-full max-w-5xl flex justify-between mb-5">

                    <button
                        className="bg-blue-500 hover:bg-blue-900 text-white px-5 py-3 rounded-lg shadow cursor-pointer"
                    >
                        Export Report Data
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ParkingRecords;