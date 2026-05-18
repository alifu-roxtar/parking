import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../../Services/api.js";
import SideBar from "../../Pages/sidebar.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaCreditCard, FaDownload, FaPlus, FaEye, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

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
  whiteSpace: "nowrap",
};

const TD = {
  padding: "14px 16px",
  fontSize: "13px",
  color: "rgba(255,255,255,0.75)",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  verticalAlign: "middle",
};

/* ─── Status config ─── */
const STATUS_CONFIG = {
  completed: { color: "#10b981", label: "Completed" },
  pending:   { color: "#f59e0b", label: "Pending" },
  failed:    { color: "#f43f5e", label: "Failed" },
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

function DetailRow({ label, value, color = "rgba(255,255,255,0.85)" }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{label}</span>
      <span style={{ color, fontSize: "13px", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

/* ─── Main component ─── */
function PaymentRecords() {
  const { userId } = useParams();
  const [payments, setPayments] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewPayment, setViewPayment] = useState(null);
  const [editPayment, setEditPayment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add form
  const [addForm, setAddForm] = useState({ carID: "", amount: "" });
  // Edit form
  const [editForm, setEditForm] = useState({ carID: "", amount: "", status: "pending" });

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /* ── Fetchers ── */
  const fetchPayments = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await API.get(`/payments/all/${userId}`);
      setPayments(res.data);
    } catch (e) { console.error(e); }
  }, [userId]);

  const fetchCars = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await API.get(`/cars/user/${userId}`);
      setCars(res.data);
    } catch (e) { console.error(e); }
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPayments(), fetchCars()]).finally(() => setLoading(false));
  }, [fetchPayments, fetchCars]);

  /* ── Add payment ── */
  const handleAddPayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post(`/payments/create/${userId}`, { userId, ...addForm });
      await fetchPayments(); // re-fetch to get populated carID object from server
      setAddForm({ carID: "", amount: "" });
      setShowAddModal(false);
      alert(res.data.msg);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  /* ── Edit payment ── */
  const openEditModal = (payment) => {
    setEditPayment(payment);
    setEditForm({ carID: payment.carID?._id ?? "", amount: payment.amount, status: payment.status });
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.put(`/payments/update/${editPayment._id}`, editForm);
      // Patch just the changed payment in state
      setPayments(prev => prev.map(p =>
        p._id === editPayment._id
          ? { ...p, amount: editForm.amount, status: editForm.status, carID: cars.find(c => c._id === editForm.carID) ?? p.carID }
          : p
      ));
      setEditPayment(null);
      alert(res.data.msg);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  /* ── Delete payment ── */
  const handleDeletePayment = async (id) => {
    if (!confirm("Are you sure you want to delete this payment record?")) return;
    setDeletingId(id);
    try {
      await API.delete(`/payments/delete/${id}`);
      setPayments(prev => prev.filter(p => p._id !== id));
    } catch (e) { console.error(e); }
    finally { setDeletingId(null); }
  };

  /* ── Export ── */
  const exportToExcel = () => {
    const formattedData = payments.map(p => ({
      DriverName:    p.carID?.driverName  || "Car Removed",
      PlateNumber:   p.carID?.plateNumber || "N/A",
      SlotNumber:    p.carID?.slotID?.slotNumber,
      AmountPaid:    p.amount,
      PaymentStatus: p.status,
      PaymentDate:   new Date(p.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payment Records");
    saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })]), "PaymentRecords.xlsx");
  };

  /* ── Summary counts ── */
  const totalRevenue = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b1120", fontFamily: "'DM Sans', sans-serif" }}>
      <SideBar />

      <main style={{ marginLeft: "240px", flex: 1, padding: "40px 36px", display: "flex", flexDirection: "column", gap: "28px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "rgba(99,102,241,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#6366f1", fontSize: "14px",
              }}>
                <FaCreditCard />
              </div>
              <h1 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
                Payment Records
              </h1>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>
              Track and manage all parking payment transactions
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={exportToExcel}
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
              <FaDownload style={{ fontSize: "12px" }} /> Export Excel
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
              <FaPlus style={{ fontSize: "11px" }} /> Add Payment
            </button>
          </div>
        </div>

        {/* ── Summary pills ── */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { label: "Total Records",  value: payments.length,                                        color: "#6366f1" },
            { label: "Completed",      value: payments.filter(p => p.status === "completed").length,  color: "#10b981" },
            { label: "Pending",        value: payments.filter(p => p.status === "pending").length,    color: "#f59e0b" },
            { label: "Failed",         value: payments.filter(p => p.status === "failed").length,     color: "#f43f5e" },
            { label: "Total Revenue",  value: `$${totalRevenue.toLocaleString()}`,                    color: "#3b82f6" },
          ].map(s => (
            <div key={s.label} style={{
              padding: "12px 20px", borderRadius: "12px",
              background: `${s.color}11`, border: `1px solid ${s.color}33`,
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <span style={{ fontSize: "20px", fontWeight: 700, color: s.color }}>{s.value}</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Table ── */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", overflow: "hidden",
        }}>
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>Loading payments…</div>
          ) : payments.length === 0 ? (
            <div style={{ padding: "80px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <div style={{ fontSize: "48px" }}>💵</div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", fontWeight: 600, margin: 0 }}>No payment records yet</p>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", margin: 0 }}>Add a payment to get started</p>
              <button onClick={() => setShowAddModal(true)} style={{
                marginTop: "4px", padding: "10px 20px", borderRadius: "10px",
                background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
                color: "#10b981", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>
                + Add Payment Record
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Driver Name", "Plate Number", "Slot", "Amount", "Status", "Date", "Actions"].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => {
                    const statusCfg = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.pending;
                    const isPending = payment.status === "pending";
                    return (
                      <tr
                        key={payment._id}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        style={{ transition: "background 0.15s ease" }}
                      >
                        <td style={TD}>
                          {payment.carID?.driverName
                            ? <span style={{ color: "#fff", fontWeight: 500 }}>{payment.carID.driverName}</span>
                            : <span style={{ color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>Car Removed</span>}
                        </td>
                        <td style={TD}>
                          {payment.carID?.plateNumber
                            ? <Badge color="#6366f1">{payment.carID.plateNumber}</Badge>
                            : <span style={{ color: "rgba(255,255,255,0.25)" }}>N/A</span>}
                        </td>
                        <td style={TD}>
                          {payment.carID?.slotID?.slotNumber
                            ? <Badge color="#3b82f6">#{payment.carID.slotID.slotNumber}</Badge>
                            : <span style={{ color: "rgba(255,255,255,0.25)" }}>—</span>}
                        </td>
                        <td style={TD}>
                          <span style={{ color: "#10b981", fontWeight: 700 }}>${payment.amount}</span>
                        </td>
                        <td style={TD}>
                          <Badge color={statusCfg.color}>{statusCfg.label}</Badge>
                        </td>
                        <td style={{ ...TD, fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
                          {new Date(payment.createdAt).toLocaleString()}
                        </td>
                        <td style={{ ...TD }}>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            <ActionBtn onClick={() => setViewPayment(payment)} color="#3b82f6" icon={<FaEye style={{ fontSize: "11px" }} />} label="View" />
                            <ActionBtn onClick={() => openEditModal(payment)} color="#f59e0b" icon={<FaEdit style={{ fontSize: "11px" }} />} label="Edit" />
                            {isPending ? (
                              <ActionBtn color="#f59e0b" icon={null} label="Not Paid" disabled />
                            ) : (
                              <ActionBtn
                                onClick={() => handleDeletePayment(payment._id)}
                                color="#f43f5e"
                                icon={<FaTrash style={{ fontSize: "11px" }} />}
                                label={deletingId === payment._id ? "Deleting…" : "Delete"}
                                disabled={deletingId === payment._id}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ── VIEW MODAL ── */}
      {viewPayment && (
        <div style={OVERLAY} onClick={() => setViewPayment(null)}>
          <div style={MODAL} onClick={e => e.stopPropagation()}>
            <ModalHeader title="Payment Details" accent="#10b981" onClose={() => setViewPayment(null)} />
            <DetailRow label="Driver Name"    value={viewPayment.carID?.driverName  || "—"} color="#a855f7" />
            <DetailRow label="Plate Number"   value={viewPayment.carID?.plateNumber || "—"} color="#6366f1" />
            <DetailRow label="Slot Number"    value={viewPayment.carID?.slotID?.slotNumber ? `#${viewPayment.carID.slotID.slotNumber}` : "—"} color="#3b82f6" />
            <DetailRow label="Phone Number"   value={viewPayment.carID?.phoneNumber || "—"} />
            <DetailRow label="Amount Paid"    value={`$${viewPayment.amount}`} color="#10b981" />
            <DetailRow label="Payment Status" value={STATUS_CONFIG[viewPayment.status]?.label ?? viewPayment.status} color={STATUS_CONFIG[viewPayment.status]?.color} />
            <DetailRow label="Date"           value={new Date(viewPayment.createdAt).toLocaleString()} color="#f59e0b" />
            <button
              onClick={() => setViewPayment(null)}
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

      {/* ── ADD PAYMENT MODAL ── */}
      {showAddModal && (
        <div style={OVERLAY}>
          <div style={MODAL}>
            <ModalHeader title="Create Payment" accent="#10b981" onClose={() => setShowAddModal(false)} />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <FormField label="Amount ($)">
                <input
                  type="number"
                  value={addForm.amount}
                  onChange={e => setAddForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="Enter amount"
                  style={INPUT}
                />
              </FormField>
              <FormField label="Car">
                <select
                  value={addForm.carID}
                  onChange={e => setAddForm(p => ({ ...p, carID: e.target.value }))}
                  style={INPUT}
                >
                  <option value="">Select car</option>
                  {cars.map(car => (
                    <option key={car._id} value={car._id}>
                      {car.plateNumber} — {car.driverName}
                    </option>
                  ))}
                </select>
              </FormField>
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button
                  onClick={handleAddPayment}
                  disabled={submitting}
                  style={{
                    flex: 1, padding: "11px", borderRadius: "10px",
                    background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
                    color: "#10b981", fontSize: "13px", fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit",
                  }}
                >
                  {submitting ? "Adding…" : "+ Add Payment"}
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

      {/* ── EDIT PAYMENT MODAL ── */}
      {editPayment && (
        <div style={OVERLAY}>
          <div style={MODAL}>
            <ModalHeader title="Edit Payment" accent="#f59e0b" onClose={() => setEditPayment(null)} />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <FormField label="Amount ($)">
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={e => setEditForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="Amount"
                  style={INPUT}
                />
              </FormField>
              <FormField label="Status">
                <select
                  value={editForm.status}
                  onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                  style={INPUT}
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </FormField>
              <FormField label="Car">
                <select
                  value={editForm.carID}
                  onChange={e => setEditForm(p => ({ ...p, carID: e.target.value }))}
                  style={INPUT}
                >
                  {cars.map(car => (
                    <option key={car._id} value={car._id}>
                      {car.driverName} — {car.plateNumber}
                    </option>
                  ))}
                </select>
              </FormField>
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button
                  onClick={handleUpdatePayment}
                  disabled={submitting}
                  style={{
                    flex: 1, padding: "11px", borderRadius: "10px",
                    background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
                    color: "#f59e0b", fontSize: "13px", fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit",
                  }}
                >
                  {submitting ? "Saving…" : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditPayment(null)}
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

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}

export default PaymentRecords;
