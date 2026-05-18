import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../Services/api";
import {
  FaHome, FaCar, FaParking, FaClipboardList,
  FaCreditCard, FaSignOutAlt, FaChevronRight
} from "react-icons/fa";

const NAV_ITEMS = (id) => [
  { to: "/dashboard",      icon: <FaHome />,          label: "Dashboard",       accent: "#f59e0b" },
  { to: `/slots/${id}`,    icon: <FaParking />,        label: "Slots",           accent: "#3b82f6" },
  { to: `/cars/${id}`,     icon: <FaCar />,            label: "Cars",            accent: "#a855f7" },
  { to: `/records/${id}`,  icon: <FaClipboardList />,  label: "Parking Records", accent: "#10b981" },
  { to: `/payments/${id}`, icon: <FaCreditCard />,     label: "Payments",        accent: "#f43f5e" },
];

function NavLink({ item, active }) {
  return (
    <Link
      to={item.to}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 14px",
        borderRadius: "10px",
        textDecoration: "none",
        position: "relative",
        transition: "all 0.18s ease",
        background: active ? "rgba(255,255,255,0.07)" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.55)",
        fontWeight: active ? 600 : 400,
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255,255,255,0.55)";
        }
      }}
    >
      {/* Active indicator bar */}
      {active && (
        <span style={{
          position: "absolute",
          left: 0,
          top: "20%",
          height: "60%",
          width: "3px",
          borderRadius: "0 3px 3px 0",
          background: item.accent,
        }} />
      )}

      {/* Icon */}
      <span style={{
        fontSize: "16px",
        color: active ? item.accent : "inherit",
        transition: "color 0.18s ease",
        flexShrink: 0,
      }}>
        {item.icon}
      </span>

      {/* Label */}
      <span style={{ fontSize: "14px", letterSpacing: "0.01em", flex: 1 }}>
        {item.label}
      </span>

      {/* Chevron */}
      {active && (
        <FaChevronRight style={{ fontSize: "10px", opacity: 0.5 }} />
      )}
    </Link>
  );
}

function SideBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        const res = await API.get("/users/me", { headers: { Authorization: token } });
        setUser(res.data.user);
      } catch {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    navigate("/login");
  };

  const avatar = user?.username?.charAt(0).toUpperCase() ?? "";
  const navItems = NAV_ITEMS(user?.id);

  return (
    <aside style={{
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      width: "240px",
      background: "linear-gradient(180deg, #0f172a 0%, #0c1628 100%)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'DM Sans', sans-serif",
      zIndex: 100,
    }}>

      {/* ── Logo ── */}
      <div style={{ padding: "28px 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2px" }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "8px",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: 800, color: "#fff",
            flexShrink: 0,
          }}>S</div>
          <span style={{ color: "#fff", fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em" }}>SPS</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "4px", paddingLeft: "40px", letterSpacing: "0.04em" }}>
          Smart Parking System
        </p>
      </div>

      {/* ── User card ── */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "15px", fontWeight: 700, color: "#fff",
            flexShrink: 0, border: "2px solid rgba(16,185,129,0.3)",
          }}>
            {avatar}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.username ?? "Loading…"}
            </p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email ?? ""}
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto" }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px", paddingLeft: "14px" }}>
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            item={item}
            active={location.pathname === item.to || location.pathname.startsWith(item.to + "/")}
          />
        ))}
      </nav>

      {/* ── Logout ── */}
      <div style={{ padding: "16px 10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "11px 14px",
            borderRadius: "10px",
            border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.4)",
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.18s ease",
            textAlign: "left",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(244,63,94,0.1)";
            e.currentTarget.style.color = "#f43f5e";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(255,255,255,0.4)";
          }}
        >
          <FaSignOutAlt style={{ fontSize: "15px", flexShrink: 0 }} />
          <span style={{ fontWeight: 500 }}>Log Out</span>
        </button>
      </div>

      {/* Google font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </aside>
  );
}

export default SideBar;
