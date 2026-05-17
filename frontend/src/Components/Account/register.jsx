import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaCarSide,
} from "react-icons/fa";

import API from "../../Services/api";


// Validation Component
function ValidationItem({ valid, text }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {valid ? (
        <FaCheckCircle className="text-green-500" />
      ) : (
        <FaTimesCircle className="text-red-500" />
      )}

      <span
        className={`font-medium ${
          valid ? "text-green-600" : "text-gray-600"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

function Register() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Password Validation
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const isPasswordValid =
    hasMinLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSymbol;

  const handleRegister = async (e) => {

    e.preventDefault();

    if (!isPasswordValid) {
      setErrorMessage("Please create a stronger password.");
      return;
    }

    try {

      setLoading(true);

      const res = await API.post("/users/register", {
        username,
        email,
        password,
      });

      if (res) {

        alert(res.data.msg);

        setErrorMessage("");

        navigate("/login");
      }

    } catch (error) {

      console.log(error);

      setErrorMessage(
        error.response?.data?.msg || "Registration failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-purple-900 via-indigo-800 to-blue-700">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center text-white px-10 relative overflow-hidden">

        <div className="absolute w-72 h-72 bg-white/10 rounded-full top-10 left-10 blur-3xl"></div>
        <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full bottom-0 right-0 blur-3xl"></div>

        <div className="z-10 flex flex-col items-center">

          <div className="bg-white/20 p-8 rounded-full shadow-2xl mb-6 animate-bounce">
            <FaCarSide className="text-7xl text-white" />
          </div>

          <h1 className="text-6xl font-extrabold mb-4 tracking-wide">
            SmartParking
          </h1>

          <p className="text-lg text-center text-purple-100 max-w-lg leading-8">
            Smart and secure parking management platform
            designed to manage vehicles, slots, parking records,
            and payments with modern technology.
          </p>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 justify-center items-center p-5">

        <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8">

          {/* Header */}
          <div className="text-center mb-8">

            <div className="flex justify-center mb-4">

              <div className="bg-purple-100 p-4 rounded-full">
                <FaUser className="text-purple-700 text-3xl" />
              </div>

            </div>

            <h2 className="text-4xl font-extrabold text-purple-700">
              Create Account
            </h2>

            <p className="text-gray-500 mt-2">
              Join SmartParking today 🚗
            </p>

          </div>

          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-5"
          >

            {/* Username */}
            <div>

              <label className="text-gray-700 font-semibold mb-2 block">
                Username
              </label>

              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">

                <span className="px-4 text-gray-400">
                  <FaUser />
                </span>

                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full py-3 pr-4 outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

              </div>

            </div>

            {/* Email */}
            <div>

              <label className="text-gray-700 font-semibold mb-2 block">
                Email
              </label>

              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">

                <span className="px-4 text-gray-400">
                  <FaEnvelope />
                </span>

                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full py-3 pr-4 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="text-gray-700 font-semibold mb-2 block">
                Password
              </label>

              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">

                <span className="px-4 text-gray-400">
                  <FaLock />
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create strong password"
                  className="w-full py-3 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-4 text-gray-500 hover:text-purple-700 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>

            </div>

            {/* Password Rules */}
            <div className="bg-gray-100 rounded-2xl p-4 space-y-2">

              <h3 className="font-bold text-gray-700 mb-2">
                Password Requirements
              </h3>

              <ValidationItem
                valid={hasMinLength}
                text="Minimum 6 characters"
              />

              <ValidationItem
                valid={hasUpperCase}
                text="At least 1 uppercase letter"
              />

              <ValidationItem
                valid={hasLowerCase}
                text="At least 1 lowercase letter"
              />

              <ValidationItem
                valid={hasNumber}
                text="At least 1 number"
              />

              <ValidationItem
                valid={hasSymbol}
                text="At least 1 special symbol"
              />

            </div>

            {/* Error Message */}
            {errorMessage && (

              <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold animate-pulse">
                {errorMessage}
              </div>

            )}

            {/* Login Link */}
            <p className="text-center text-gray-600">

              Already have an account?{" "}

              <Link
                to="/login"
                className="text-purple-700 font-bold hover:underline"
              >
                Login
              </Link>

            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold text-lg transition-all duration-300 shadow-lg ${
                loading
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-700 hover:bg-purple-800 hover:scale-[1.02] cursor-pointer"
              }`}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Register;