import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../../Services/api.js";
import SideBar from "../../Pages/sidebar.jsx";
import { FaCar, FaEye, FaEdit, FaTrash, FaPlus, FaTimes, FaParking } from "react-icons/fa";

/* ─── Shared styles ─── */
const OVERLAY = {
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(4px)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 50,
};

const MODAL = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "18px",
  padding: "28px",
  width: "100%",
  maxWidth: "420px",
  boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
};

const INPUT = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const TH = {
  padding: "12px 16px",
  color: "rgba(255,255,255,0.4)",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  textAlign: "left",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const TD = {
  padding: "14px 16px",
  fontSize: "13px",
  color: "rgba(255,255,255,0.75)",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  verticalAlign: "middle",
};

function Badge({ children, color = "#3b82f6" }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: "20px",
      fontSize: "12px", fontWeight: 600,
      background: `${color}22`, color, border: `1px solid ${color}44`,
    }}>
      {children}
    </span>
  );
}

function ActionBtn({ onClick, color, icon, label, disabled }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: "5px",
        padding: "7px 13px", borderRadius: "8px", fontSize: "12px", fontWeight: 500,
        background: hovered ? `${color}33` : `${color}18`,
        border: `1px solid ${color}44`,
        color, cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.15s ease", opacity: disabled ? 0.5 : 1,
        fontFamily: "inherit",
      }}
    >
      {icon} {label}
    </button>
  );
}

function ModalHeader({ title, accent = "#3b82f6", onClose }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
      <h2 style={{ color: accent, fontSize: "17px", fontWeight: 700, margin: 0 }}>{title}</h2>
      <button onClick={onClose} style={{
        background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.5)",
        width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px",
      }}><FaTimes /></button>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

/* ─── Main component ─── */
function CarsPage() {
  const { userId } = useParams();

  const [cars, setCars] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [viewCar, setViewCar] = useState(null);
  const [editCar, setEditCar] = useState(null);

  // Add form
  const [addForm, setAddForm] = useState({ plateNumber: "", driverName: "", phoneNumber: "", slotID: "" });
  // Edit form
  const [editForm, setEditForm] = useState({ plateNumber: "", driverName: "", phoneNumber: "", slotID: "" });

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /* ── Fetch helpers ── */
  const fetchCars = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await API.get(`/cars/user/${userId}`);
      setCars(res.data);
    } catch (e) { console.error(e); }
  }, [userId]);

  const fetchSlots = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await API.get(`/slots/user/${userId}`);
      setSlots(res.data);
    } catch (e) { console.error(e); }
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCars(), fetchSlots()]).finally(() => setLoading(false));
  }, [fetchCars, fetchSlots]);

  /* ── Add car ── */
  const handleAddCar = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post("/cars/add-car", { userId, ...addForm });
      // Optimistically update both cars and slot status without reload
      await Promise.all([fetchCars(), fetchSlots()]);
      setAddForm({ plateNumber: "", driverName: "", phoneNumber: "", slotID: "" });
      setShowAddModal(false);
      alert(res.data.msg);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  /* ── Edit car ── */
  const openEditModal = (car) => {
    setEditCar(car);
    setEditForm({
      plateNumber: car.plateNumber,
      driverName: car.driverName,
      phoneNumber: car.phoneNumber,
      slotID: car.slotID?._id ?? "",
    });
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.put(`/cars/update/${editCar._id}`, editForm);
      // Update just that car in state — no reload
      setCars(prev => prev.map(c => c._id === editCar._id ? { ...c, ...editForm, slotID: slots.find(s => s._id === editForm.slotID) ?? c.slotID } : c));
      setEditCar(null);
      alert(res.data.msg);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  /* ── Delete car ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this car?")) return;
    setDeletingId(id);
    try {
      const res = await API.delete(`/cars/delete/${id}`);
      setCars(prev => prev.filter(c => c._id !== id));
      // Refresh slots so freed slot shows as available again
      await fetchSlots();
      alert(res.data.msg);
    } catch (e) { console.error(e); }
    finally { setDeletingId(null); }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b1120", fontFamily: "'DM Sans', sans-serif" }}>
      <SideBar />

      <main style={{ marginLeft: "240px", flex: 1, padding: "40px 36px", display: "flex", flexDirection: "column", gap: "28px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "rgba(168,85,247,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#a855f7", fontSize: "14px",
              }}>
                <FaCar />
              </div>
              <h1 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
                Parked Cars
              </h1>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>
              Manage all cars currently in your parking lot
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowSchemaModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 16px", borderRadius: "10px",
                background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
                color: "#3b82f6", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                transition: "all 0.18s ease", fontFamily: "inherit",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.22)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(59,130,246,0.12)"}
            >
              <FaParking style={{ fontSize: "12px" }} /> Parking Schema
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 16px", borderRadius: "10px",
                background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
                color: "#10b981", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                transition: "all 0.18s ease", fontFamily: "inherit",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.22)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.12)"}
            >
              <FaPlus style={{ fontSize: "11px" }} /> Add New Car
            </button>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { label: "Total Cars", value: cars.length, color: "#a855f7" },
            { label: "Available Slots", value: slots.filter(s => s.slotStatus).length, color: "#10b981" },
            { label: "Occupied Slots", value: slots.filter(s => !s.slotStatus).length, color: "#f43f5e" },
          ].map(s => (
            <div key={s.label} style={{
              padding: "12px 20px", borderRadius: "12px",
              background: `${s.color}11`, border: `1px solid ${s.color}33`,
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <span style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", overflow: "hidden",
        }}>
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>Loading cars…</div>
          ) : cars.length === 0 ? (
            <div style={{ padding: "80px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <div style={{ fontSize: "48px" }}>🚗</div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", fontWeight: 600, margin: 0 }}>No cars in parking yet</p>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", margin: 0 }}>Start by adding the first parked car</p>
              <button onClick={() => setShowAddModal(true)} style={{
                marginTop: "4px", padding: "10px 20px", borderRadius: "10px",
                background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
                color: "#10b981", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>
                + Add New Car
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Driver Name", "Plate Number", "Slot", "Actions"].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cars.map(car => (
                    <tr
                      key={car._id}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      style={{ transition: "background 0.15s ease" }}
                    >
                      <td style={TD}>
                        <span style={{ color: "#fff", fontWeight: 500 }}>{car.driverName}</span>
                      </td>
                      <td style={TD}>
                        <Badge color="#6366f1">{car.plateNumber}</Badge>
                      </td>
                      <td style={TD}>
                        <Badge color="#3b82f6">#{car.slotID?.slotNumber}</Badge>
                      </td>
                      <td style={{ ...TD, display: "flex", gap: "8px" }}>
                        <ActionBtn onClick={() => setViewCar(car)} color="#3b82f6" icon={<FaEye style={{ fontSize: "11px" }} />} label="View" />
                        <ActionBtn onClick={() => openEditModal(car)} color="#f59e0b" icon={<FaEdit style={{ fontSize: "11px" }} />} label="Edit" />
                        <ActionBtn
                          onClick={() => handleDelete(car._id)}
                          color="#f43f5e"
                          icon={<FaTrash style={{ fontSize: "11px" }} />}
                          label={deletingId === car._id ? "Removing…" : "Remove"}
                          disabled={deletingId === car._id}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ── VIEW MODAL ── */}
      {viewCar && (
        <div style={OVERLAY} onClick={closeViewModal => setViewCar(null)}>
          <div style={MODAL} onClick={e => e.stopPropagation()}>
            <ModalHeader title="Car Details" accent="#10b981" onClose={() => setViewCar(null)} />
            {[
              { label: "Plate Number", value: viewCar.plateNumber, color: "#6366f1" },
              { label: "Driver Name",  value: viewCar.driverName,  color: "#a855f7" },
              { label: "Phone Number", value: viewCar.phoneNumber, color: "#fff" },
              { label: "Slot",         value: `#${viewCar.slotID?.slotNumber}`, color: "#3b82f6" },
              { label: "Entry Time",   value: new Date(viewCar.entryTime).toLocaleString(), color: "#f59e0b" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{label}</span>
                <span style={{ color, fontSize: "13px", fontWeight: 600 }}>{value}</span>
              </div>
            ))}
            <button
              onClick={() => setViewCar(null)}
              style={{
                marginTop: "20px", width: "100%", padding: "11px",
                borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)",
                fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editCar && (
        <div style={OVERLAY}>
          <div style={MODAL}>
            <ModalHeader title="Edit Car Details" accent="#f59e0b" onClose={() => setEditCar(null)} />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "Plate Number", key: "plateNumber", type: "text" },
                { label: "Driver Name",  key: "driverName",  type: "text" },
                { label: "Phone Number", key: "phoneNumber", type: "number" },
              ].map(({ label, key, type }) => (
                <FormField key={key} label={label}>
                  <input
                    type={type}
                    value={editForm[key]}
                    onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                    style={INPUT}
                  />
                </FormField>
              ))}
              <FormField label="Slot">
                <select value={editForm.slotID} disabled style={{ ...INPUT, cursor: "not-allowed", opacity: 0.5 }}>
                  {slots.map(s => (
                    <option key={s._id} value={s._id}>Slot {s.slotNumber} — Occupied</option>
                  ))}
                </select>
              </FormField>
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button
                  onClick={handleUpdateCar}
                  disabled={submitting}
                  style={{
                    flex: 1, padding: "11px", borderRadius: "10px",
                    background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
                    color: "#10b981", fontSize: "13px", fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit",
                  }}
                >
                  {submitting ? "Saving…" : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditCar(null)}
                  style={{
                    flex: 1, padding: "11px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD CAR MODAL ── */}
      {showAddModal && (
        <div style={OVERLAY}>
          <div style={MODAL}>
            <ModalHeader title="Add New Car" accent="#10b981" onClose={() => setShowAddModal(false)} />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "Driver Name",  key: "driverName",  type: "text" },
                { label: "Plate Number", key: "plateNumber", type: "text" },
                { label: "Phone Number", key: "phoneNumber", type: "number" },
              ].map(({ label, key, type }) => (
                <FormField key={key} label={label}>
                  <input
                    type={type}
                    value={addForm[key]}
                    onChange={e => setAddForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={label}
                    style={INPUT}
                  />
                </FormField>
              ))}
              <FormField label="Available Slot">
                <select
                  value={addForm.slotID}
                  onChange={e => setAddForm(p => ({ ...p, slotID: e.target.value }))}
                  style={INPUT}
                >
                  <option value="">Select a slot</option>
                  {slots.filter(s => s.slotStatus).map(s => (
                    <option key={s._id} value={s._id}>Slot {s.slotNumber} — Available</option>
                  ))}
                </select>
              </FormField>
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button
                  onClick={handleAddCar}
                  disabled={submitting}
                  style={{
                    flex: 1, padding: "11px", borderRadius: "10px",
                    background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
                    color: "#10b981", fontSize: "13px", fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit",
                  }}
                >
                  {submitting ? "Adding…" : "+ Add Car"}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1, padding: "11px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SCHEMA MODAL ── */}
      {showSchemaModal && (
        <div style={OVERLAY}>
          <div style={{
            ...MODAL,
            maxWidth: "860px",
            maxHeight: "85vh",
            overflowY: "auto",
          }}>
            <ModalHeader title="Parking Schema" accent="#3b82f6" onClose={() => setShowSchemaModal(false)} />
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginTop: "-14px", marginBottom: "20px" }}>
              Visual overview of all parking slots
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "12px",
            }}>
              {slots.map(slot => {
                const parkedCar = cars.find(c => c.slotID?._id === slot._id);
                const available = slot.slotStatus;
                const color = available ? "#10b981" : "#f43f5e";
                return (
                  <div key={slot._id} style={{
                    borderRadius: "14px",
                    padding: "16px",
                    background: `${color}0d`,
                    border: `1px solid ${color}33`,
                    display: "flex", flexDirection: "column", gap: "10px",
                    transition: "transform 0.15s ease",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "none"}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>#{slot.slotNumber}</span>
                      <span style={{
                        fontSize: "10px", padding: "2px 8px", borderRadius: "20px",
                        background: `${color}22`, color, fontWeight: 600,
                      }}>
                        {available ? "Free" : "Taken"}
                      </span>
                    </div>
                    {!available && parkedCar ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: 500 }}>{parkedCar.driverName}</span>
                        <span style={{ color: "#6366f1", fontSize: "11px", fontWeight: 600 }}>{parkedCar.plateNumber}</span>
                      </div>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>Empty slot</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}

export default CarsPage;
