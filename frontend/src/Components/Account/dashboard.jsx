import SideBar from "../../Pages/sidebar";
import Cards from "../../Pages/cards";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../Services/api";
import { FaArrowRight, FaCar, FaClipboardList, FaParking } from "react-icons/fa";

function Dashboard(){
    const [ user, setUser ] = useState([]);
    const [slots, setSlots] = useState([]);
    const [ cars, setCars ] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        const getUser = async () =>{
            const token = localStorage.getItem('token');

            if(!token) navigate('/login');

            const res = await API.get('/users/me', { headers: { Authorization: token }});

            setUser(res.data.user);
        }
        getUser();
    }, [navigate]);

    const userId = user.id;

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

    return(
        <div>
            <SideBar />
            <div className="flex h-screen m-auto bg-blue-700">
                <div className="flex flex-col ml-80 mt-20 gap-5">
                    <h1 className="text-4xl text-white font-bold"><b> <FaParking className="inline mr-2"/>Smart Parking Management System</b></h1>
                    <h3 className="font-semibold text-lg text-white/70 p-3">Welcome, <b className="text-white capitalize">{user.username}</b> !</h3>
                    <div className="grid-cols-3 gap-6 flex">
                        <Cards>
                          <Link to={`/slots/${user.id}`} className="text-white font-bold text-xl m-3"><FaParking className="inline mr-1 text-red-900"/>Parkin Slots</Link>
                          <span className="text-center text-lg m-1 text-gray-300">Manage all parking slots availbale in your parking easily.</span>
                          <div className="flex mt-2 flex-row gap-5">
                             <p className="m-auto flex text-sm h-6 w-6 bg-blue-500 rounded-full text-white border justify-center">{slots.length}</p>
                             <span className="-ml-12.5 text-sm text-white">Current Parking Slots.</span>
                             <Link to={`/slots/${user.id}`} className="text-end inline m-auto text-white text-sm hover:scale-95 transition-all duration-200">View <FaArrowRight className="inline text-sm" /></Link>
                          </div>
                       </Cards>
                       <Cards>
                          <Link to={`/cars/${user.id}`} className="text-white font-bold text-xl m-3"><FaCar className="inline mr-1 text-yellow-500"/>Parked Cars</Link>
                          <span className="text-center text-lg m-1 text-gray-300">Control cars parked in your parking effeciently.</span>
                          <div className="flex mt-2 flex-row gap-5">
                             <p className="m-auto flex text-sm h-6 w-6 bg-blue-500 rounded-full text-white border justify-center">{cars.length}</p>
                             <span className="-ml-12.5 text-sm text-white">Cars in parking.</span>
                             <Link to={`/cars/${user.id}`} className="text-end inline m-auto text-white text-sm hover:scale-95 transition-all duration-200">View <FaArrowRight className="inline text-sm" /></Link>
                          </div>
                       </Cards>
                       <Cards>
                          <Link to={`/`} className="text-white font-bold text-xl m-3"><FaClipboardList className="inline text-xl mr-1 text-green-500"/>Payments Records</Link>
                          <span className="text-center text-lg m-1 text-gray-300">Track & Manage All Payment Transactions Performed.</span>
                          <div className="flex mt-2 flex-row gap-5">
                             <p className="m-auto flex text-sm h-6 w-6 bg-blue-500 rounded-full text-white border justify-center">4</p>
                             <span className="-ml-12.5 text-sm text-white">Successful Payments.</span>
                             <Link className="text-end inline m-auto text-white text-sm hover:scale-95 transition-all duration-200">View <FaArrowRight className="inline text-sm" /></Link>
                          </div>
                       </Cards>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Dashboard;