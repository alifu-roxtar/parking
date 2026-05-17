import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../Services/api";

import { FaHome, FaCar, FaParking, FaClipboardList, FaCreditCard, FaSignOutAlt } from "react-icons/fa";

function SideBar() {
    const [ user, setUser ] = useState(null);
    const navigate = useNavigate();

    useEffect(() =>{
        const fetchUser = async () =>{
            try {
                const token = localStorage.getItem("token");
                if(!token) {
                    navigate("/login");
                    return;
                }
                const res = await API.get("/users/me", { headers: { Authorization: token } });
                setUser(res.data.user);
            } catch (error) {
                console.error(error);
                navigate("/login");
            }
        };
        fetchUser();
    }, [navigate]);

    const avatar = user ? user.username.charAt(0).toUpperCase() : "";

    const handleLogout = () =>{
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if(!confirmLogout) return;
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (

    <div className="fixed h-screen w-70 bg-blue-900 gap-4">
        <div className="flex mt-8 p-2 ml-3 flex-col">
            <h1 className="text-white text-4xl font-bold mb-2">SPS</h1>
            <span className="text-sm font-semibold text-gray-400 mb-3 -mt-1.25">Smart Parking System.</span>
            <h1 className="text-blue-500 text-2xl">Hello, <span className="text-2xl font-bold text-white/80">{user?.username}</span></h1>
            <div className="mt-4 p-3 flex">
                <span className="h-15 w-15 text-white border-2 rounded-full flex bg-green-600 text-2xl font-bold justify-center items-center">{avatar}</span>
                <p className="mt-5 ml-2 text-gray-400 text-xl font-semibold">{user?.username}</p><br /><br />
            </div>
            <div>
                <p className="ml-1 text-gray-400 text-xl font-semibold">{user?.email}</p>
            </div>
            <div className="flex flex-col gap-4 mt-10">
                  <Link to={'/dashboard'} className="text-white text-2xl font-semibold hover:scale-105 transition-all duration-200"><FaHome className="inline mr-2 text-amber-600" />Home</Link>
                  <Link to={`/slots/${user?.id}`} className="text-white text-2xl font-semibold hover:scale-105 transition-all duration-200"><FaParking className="inline mr-2 text-red-900" />Slots</Link>
                  <Link to={`/cars/${user?.id}`} className="text-white text-2xl font-semibold hover:scale-105 transition-all duration-200"><FaCar className="inline mr-2 text-purple-500" />Cars</Link>
                  <Link to={`/records/${user?.id}`} className="text-white text-2xl font-semibold hover:scale-105 transition-all duration-200"><FaClipboardList className="inline mr-2 text-yellow-300" />Parking Records</Link>
                  <Link to={`/payments/${user?.id}`} className="text-white text-2xl font-semibold hover:scale-105 transition-all duration-200"><FaCreditCard className="inline mr-2 text-green-400" />Payments</Link>

              </div>
              <div className="mt-15 ml-5">
                <button onClick={handleLogout} className="text-white hover:scale-105 text-lg font-semibold group h-12 bg-amber-950 px-4 rounded-3xl cursor-pointer">Log Out<FaSignOutAlt className="inline ml-2 group-hover:rotate-180 transition-transform duration-150" /></button>
              </div>
        </div>
    </div>

    )

}

export default SideBar;