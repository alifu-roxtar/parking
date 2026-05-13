import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../Services/api";

function Login() {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) =>{
        e.preventDefault();
        try {
            const res = await API.post("/users/login", { email, password });

            if(res) {
                alert(res.data.msg);
                localStorage.setItem("token", res.data.token);
                setErrorMessage("");
                navigate("/dashboard");
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response?.data?.msg);
        }
    };

    return (
        <div className="flex h-screen bg-white/70 justify-center items-center">
            <div className="p-8 bg-white rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Login To SmartParking.</h2>
                <form action="" onSubmit={handleLogin} className="mt-4 flex flex-col gap-4">
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
                        Don't have an account? <Link to="/" className="text-blue-700 hover:underline">Register</Link>
                    </p>
                    <button type="submit" className="bg-blue-700 text-white py-2 cursor-pointer px-4 rounded-md hover:bg-blue-800">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
};

export default Login;