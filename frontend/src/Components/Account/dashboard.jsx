import SideBar from "../../Pages/sidebar";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../Services/api";
import { FaArrowRight, FaCar, FaClipboardList, FaParking } from "react-icons/fa";
import Footer from "../../Pages/footer";

const STAT_CARDS = [
  {
    key: "slots",
    label: "Parking Slots",
    sublabel: "Total slots managed",
    icon: <FaParking />,
    accent: "#3b82f6",
    accentBg: "rgba(59,130,246,0.12)",
    route: (id) => `/slots/${id}`,
  },
  {
    key: "cars",
    label: "Parked Cars",
    sublabel: "Currently in parking",
    icon: <FaCar />,
    accent: "#a855f7",
    accentBg: "rgba(168,85,247,0.12)",
    route: (id) => `/cars/${id}`,
  },
  {
    key: "records",
    label: "Parking Records",
    sublabel: "All-time reservations",
    icon: <FaClipboardList />,
    accent: "#10b981",
    accentBg: "rgba(16,185,129,0.12)",
    route: (id) => `/records/${id}`,
  },
];

function StatCard({ card, count, userId }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        cursor: "default",
        minWidth: "220px",
        flex: 1,
      }}
    >
      {/* Icon + count row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: "42px", height: "42px", borderRadius: "12px",
          background: card.accentBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", color: card.accent,
        }}>
          {card.icon}
        </div>
        <span style={{
          fontSize: "36px", fontWeight: 700, color: "#fff",
          letterSpacing: "-0.03em", lineHeight: 1,
        }}>
          {count ?? "–"}
        </span>
      </div>

      {/* Labels */}
      <div>
        <p style={{ color: "#fff", fontSize: "14px", fontWeight: 600, margin: 0 }}>{card.label}</p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: "3px 0 0" }}>{card.sublabel}</p>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

      {/* Link */}
      <Link
        to={card.route(userId)}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          color: card.accent, fontSize: "13px", fontWeight: 600,
          textDecoration: "none", transition: "gap 0.18s ease",
        }}
        onMouseEnter={e => e.currentTarget.style.gap = "10px"}
        onMouseLeave={e => e.currentTarget.style.gap = "6px"}
      >
        View details <FaArrowRight style={{ fontSize: "11px" }} />
      </Link>
    </div>
  );
}

function Dashboard() {
  const [user, setUser] = useState(null);
  const [slots, setSlots] = useState([]);
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      const res = await API.get("/users/me", { headers: { Authorization: token } });
      setUser(res.data.user);
    };
    getUser();
  }, [navigate]);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    API.get(`/slots/user/${userId}`).then(r => setSlots(r.data)).catch(console.error);
    API.get(`/cars/user/${userId}`).then(r => setCars(r.data)).catch(console.error);
    API.get(`/parking/records/${userId}`).then(r => setRecords(r.data)).catch(console.error);
  }, [userId]);

  const counts = { slots: slots.length, cars: cars.length, records: records.length };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b1120", fontFamily: "'DM Sans', sans-serif" }}>
      <SideBar />

      {/* Main content */}
      <main style={{
        marginLeft: "240px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}>
        <div style={{ flex: 1, padding: "48px 40px 32px" }}>

          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "14px",
              }}>
                <FaParking />
              </div>
              <h1 style={{
                color: "#fff", fontSize: "22px", fontWeight: 700,
                margin: 0, letterSpacing: "-0.02em",
              }}>
                Smart Parking System
              </h1>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: "12px 0 0" }}>
              Welcome back,{" "}
              <span style={{ color: "#fff", fontWeight: 600 }}>
                {user?.username ?? "…"}
              </span>
              . Here's your parking overview.
            </p>
          </div>

          {/* Section label */}
          <p style={{
            color: "rgba(255,255,255,0.2)", fontSize: "10px", fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px",
          }}>
            Overview
          </p>

          {/* Stat cards */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {STAT_CARDS.map(card => (
              <StatCard key={card.key} card={card} count={counts[card.key]} userId={userId} />
            ))}
          </div>

          {/* Subtle ambient glow */}
          <div style={{
            position: "fixed", top: "15%", left: "35%",
            width: "500px", height: "300px",
            background: "radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 0,
          }} />
        </div>

        <Footer />
      </main>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}

export default Dashboard;
