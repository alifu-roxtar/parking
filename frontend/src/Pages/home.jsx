import { Link } from "react-router-dom";
import {
  FaCar,
  FaParking,
  FaMoneyBillWave,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-blue-700 to-blue-500 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5">
        
        <div className="flex items-center gap-3">
          <img
            src="/favicon.png"
            alt="logo"
            className="w-12 h-12 rounded-full"
          />

          <h1 className="text-3xl font-bold">
            Smart Parking
          </h1>
        </div>

        <div className="flex gap-4">
          
          <Link
            to="/login"
            className="border border-white px-5 py-2 rounded-lg hover:bg-white hover:text-blue-700 transition"
          >
            Login
          </Link>

          <Link
            to="/"
            className="bg-white text-blue-700 px-5 py-2 rounded-lg hover:bg-blue-100 transition font-semibold"
          >
            Register
          </Link>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center px-6 py-20">

        <img
          src="/favicon.png"
          alt="parking logo"
          className="w-40 h-40 mb-8 drop-shadow-2xl"
        />

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl">
          Smart Parking Management System
        </h1>

        <p className="mt-6 text-lg text-blue-100 max-w-2xl leading-8">
          Manage parking slots, cars, payments, and parking records
          easily with a modern and intelligent parking solution.
        </p>

        <div className="flex gap-5 mt-10 flex-wrap justify-center">

          <Link
            to="/"
            className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-blue-100 transition"
          >
            Get Started
            <FaArrowRight />
          </Link>

          <Link
            to="/login"
            className="border border-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-700 transition"
          >
            Login Account
          </Link>

        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-4 gap-6 px-10 pb-20">

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <FaParking className="text-4xl mb-4 text-yellow-300" />

          <h2 className="text-2xl font-bold mb-3">
            Parking Slots
          </h2>

          <p className="text-blue-100">
            Manage available and occupied parking slots easily.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <FaCar className="text-4xl mb-4 text-green-300" />

          <h2 className="text-2xl font-bold mb-3">
            Car Management
          </h2>

          <p className="text-blue-100">
            Register and track all parked vehicles in real time.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <FaMoneyBillWave className="text-4xl mb-4 text-pink-300" />

          <h2 className="text-2xl font-bold mb-3">
            Payments
          </h2>

          <p className="text-blue-100">
            Store and manage payment records securely.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <FaClock className="text-4xl mb-4 text-red-300" />

          <h2 className="text-2xl font-bold mb-3">
            Parking Records
          </h2>

          <p className="text-blue-100">
            Track entry time, exit time, and parking duration.
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 py-6 text-center text-blue-100">
        © {new Date().getFullYear()} Smart Parking System • Developed by Roxtar 🚗
      </footer>

    </div>
  );
}

export default LandingPage;