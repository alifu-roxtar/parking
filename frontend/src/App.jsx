import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./Components/Account/register";
import Login from "./Components/Account/login";
import Dashboard from "./Components/Account/dashboard";
import Slots from "./Components/Slots/slots";
import CarsPage from "./Components/Cars/cars";
import ParkingRecord from "./Components/Parking-Records/parkingRecords";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path={'/slots/:userId'} element={<Slots />} />
          <Route path={'/cars/:userId'} element={<CarsPage />} />
          <Route path={'/records/:userId'} element={<ParkingRecord />}/>
        </Routes>
      </Router>
    </div>
  )
};

export default App;