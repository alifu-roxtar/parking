import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../Services/api";
import {
  FaEnvelope,
  FaLock,
  FaParking,
  FaSpinner,
} from "react-icons/fa";
import logo from "../../assets/Images/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await API.post("/users/login", {
        email,
        password,
      });

      if (res) {
        alert(res.data.msg);

        localStorage.setItem("token", res.data.token);

        // save logged in user
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        setErrorMessage("");

        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);

      setErrorMessage(
        error.response?.data?.msg || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-blue-900 via-blue-700 to-blue-500">

      {/* Left Section */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center text-white p-10">

        <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl">

          <div className="flex justify-center mb-6">
            <div className="bg-white p-5 rounded-full shadow-lg">
              <FaParking className="text-6xl text-blue-700" />
            </div>
          </div>

          <h1 className="text-5xl font-extrabold text-center leading-tight">
            Smart Parking
          </h1>

          <p className="mt-6 text-lg text-center text-blue-100 leading-8">
            Manage parking slots, cars, parking records,
            and payments easily with a modern smart system.
          </p>

        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

          <div className="text-center mb-8">

            <div className="flex justify-center mb-4">
              <img
                src={logo}
                alt="logo"
                className="w-20 h-20"
              />
            </div>

            <h2 className="text-4xl font-bold text-blue-700">
              Welcome Back 👋
            </h2>

            <p className="text-gray-500 mt-2">
              Login to continue to Smart Parking
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-5"
          >

            {/* Email */}
            <div className="relative">

              <FaEnvelope className="absolute top-4 left-4 text-gray-400" />

              <input
                type="email"
                placeholder="Enter Email"
                className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            {/* Password */}
            <div className="relative">

              <FaLock className="absolute top-4 left-4 text-gray-400" />

              <input
                type="password"
                placeholder="Enter Password"
                className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>

            {/* Error */}
            {errorMessage && (
              <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {errorMessage}
              </div>
            )}

            {/* Register Link */}
            <p className="text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-700 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`flex justify-center items-center gap-3 py-3 rounded-xl text-white font-bold transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800 cursor-pointer"
              }`}
            >

              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}

            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;