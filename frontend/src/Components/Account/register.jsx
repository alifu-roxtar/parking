import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../Services/api";

function Register() {
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) =>{
        e.preventDefault();
        try {
            const res = await API.post("/users/register", { username, email, password });

            if(res) {
                alert(res.data.msg);
                setErrorMessage("");
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response?.data?.msg);
        }
    };

    return (
        <div className="flex h-screen bg-white/70 justify-center items-center">
            <div className="p-8 bg-white rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Register Here To SmartParking.</h2>
                <form action="" onSubmit={handleRegister} className="mt-4 flex flex-col gap-4">
                    <input type="text" 
                    placeholder="Username"
                    className="border border-gray-300 rounded px-2 py-3 outline-0"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required/>

                    <input type="email" 
                    placeholder="Email"
                    className="border border-gray-300 rounded px-2 py-3 outline-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required/>

                    <input type="password" 
                    placeholder="Password"
                    className="border border-gray-300 rounded px-2 py-3 outline-0"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
                    {errorMessage && <p className="text-red-500 text-xl font-semibold">{errorMessage}</p>}
                    <p className="text-center text-gray-600">
                        Already have an account? <Link to="/login" className="text-purple-700 hover:underline">Login</Link>
                    </p>
                    <button type="submit" className="bg-purple-700 text-white py-2 cursor-pointer px-4 rounded-md hover:bg-purple-800">
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
};

export default Register;