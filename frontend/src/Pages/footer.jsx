import {
  FaInstagram,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCar,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white -mt-82 ml-30 border-t border-gray-700">
      
      <div className="max-w-7xl mx-auto px-8 py-6 grid md:grid-cols-3 gap-10">

        {/* System Info */}
        <div>
          <div className="flex items-center gap-3 ml-20 mb-4">
            <FaCar className="text-3xl text-blue-400" />

            <h2 className="text-2xl font-bold text-blue-400">
              Smart Parking System
            </h2>
          </div>

          <p className="text-gray-300 ml-25 mt-10 leading-7">
            A smart parking management system that helps users manage
            parking slots, cars, parking records, and payments easily
            and efficiently.
          </p>
        </div>

        {/* Quick Links */}
        <div className="ml-30">
          <h2 className="text-xl font-bold text-blue-400 mb-4">
            Quick Links
          </h2>

          <ul className="space-y-3 text-gray-300">
            <li className="hover:text-blue-400 cursor-pointer transition">
              Dashboard
            </li>

            <li className="hover:text-blue-400 cursor-pointer transition">
              Parking Slots
            </li>

            <li className="hover:text-blue-400 cursor-pointer transition">
              Cars
            </li>

            <li className="hover:text-blue-400 cursor-pointer transition">
              Parking Records
            </li>

            <li className="hover:text-blue-400 cursor-pointer transition">
              Payments
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="ml-10">
          <h2 className="text-xl font-bold text-blue-400 mb-4">
            Contact Me
          </h2>

          <div className="space-y-4 text-gray-300">

            <p className="flex items-center gap-3">
              <FaInstagram className="text-pink-500" />
              @alifu_roxtar_09
            </p>

            <p className="flex items-center gap-3">
              <FaGithub className="text-white" />
              alifu-roxtar
            </p>

            <p className="flex items-center gap-3">
              <FaEnvelope className="text-red-400" />
              shejaalifu@gmail.com
            </p>

            <p className="flex items-center gap-3">
              <FaPhone className="text-green-400" />
              0796850192
            </p>

            <p className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-yellow-400" />
              Kigali - Kicukiro
            </p>

          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Smart Parking System | Developed by
        <span className="text-blue-400 font-semibold ml-2">
          Roxtar
        </span>
      </div>
    </footer>
  );
}

export default Footer;