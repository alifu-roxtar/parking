import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../../Services/api.js";
import SideBar from "../../Pages/sidebar.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaClipboardList, FaDownload, FaTrash, FaClock } from "react-icons/fa";

const TH_STYLE = {
  padding: "12px 16px",
  color: "rgba(255,255,255,0.45)",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  textAlign: "left",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  whiteSpace: "nowrap",
};

const TD_STYLE = {
  padding: "14px 16px",
  fontSize: "13px",
  color: "rgba(255,255,255,0.75)",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  verticalAlign: "middle",
};

function Badge({ children, color = "#3b82f6" }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: 600,
      background: `${color}22`,
      color,
      border: `1px solid ${color}44`,
    }}>
      {children}
    </span>
  );
}

function ParkingRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { userId } = useParams();

  const fetchRecords = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await API.get(`/parking/records/${userId}`);
      setRecords(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleDeleteRecord = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    setDeletingId(id);
    try {
      await API.delete(`/parking/delete/${id}`);
      // Remove from state directly — no reload needed
      setRecords(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const exportToExcel = () => {
    const formattedData = records.map((record) => ({
      DriverName: record.carID?.driverName || "Car Removed",
      PlateNumber: record.carID?.plateNumber || "N/A",
      SlotNumber: record.slotID?.slotNumber,
      EntryTime: new Date(record.entryTime).toLocaleString(),
      ExitTime: record.exitTime ? new Date(record.exitTime).toLocaleString() : "Still Parked",
      DurationMinutes: record.duration == null ? "Still In Parking" : record.duration,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Parking Records");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "ParkingRecords.xlsx");
  };

  const stillParking = records.filter(r => r.duration == null).length;
  const completed = records.filter(r => r.duration != null).length;

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
                background: "rgba(16,185,129,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#10b981", fontSize: "14px",
              }}>
                <FaClipboardList />
              </div>
              <h1 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
                Parking Records
              </h1>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>
              All parking sessions for your lot
            </p>
          </div>

          <button
            onClick={exportToExcel}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 18px", borderRadius: "10px",
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
              color: "#3b82f6", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", transition: "all 0.18s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.15)"; }}
          >
            <FaDownload style={{ fontSize: "12px" }} /> Export to Excel
          </button>
        </div>

        {/* Summary pills */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { label: "Total Records", value: records.length, color: "#3b82f6" },
            { label: "Still Parking", value: stillParking, color: "#f59e0b" },
            { label: "Completed", value: completed, color: "#10b981" },
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
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          overflow: "hidden",
        }}>
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
              Loading records…
            </div>
          ) : records.length === 0 ? (
            <div style={{ padding: "80px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "48px" }}>🚗</div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", fontWeight: 600, margin: 0 }}>No parking records yet</p>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", margin: 0 }}>Records will appear here once cars start parking</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Driver Name", "Plate Number", "Slot", "Entry Time", "Exit Time", "Duration", "Action"].map(h => (
                      <th key={h} style={TH_STYLE}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => {
                    const isParking = record.duration == null;
                    return (
                      <tr
                        key={record._id}
                        style={{ transition: "background 0.15s ease" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={TD_STYLE}>
                          {record.carID?.driverName
                            ? <span style={{ color: "#fff", fontWeight: 500 }}>{record.carID.driverName}</span>
                            : <span style={{ color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>Car Removed</span>}
                        </td>

                        <td style={TD_STYLE}>
                          {record.carID?.plateNumber
                            ? <Badge color="#6366f1">{record.carID.plateNumber}</Badge>
                            : <span style={{ color: "rgba(255,255,255,0.25)" }}>N/A</span>}
                        </td>

                        <td style={TD_STYLE}>
                          <Badge color="#3b82f6">#{record.slotID?.slotNumber}</Badge>
                        </td>

                        <td style={{ ...TD_STYLE, fontSize: "12px" }}>
                          {new Date(record.entryTime).toLocaleString()}
                        </td>

                        <td style={{ ...TD_STYLE, fontSize: "12px" }}>
                          {record.exitTime
                            ? new Date(record.exitTime).toLocaleString()
                            : <span style={{ color: "rgba(255,255,255,0.25)" }}>—</span>}
                        </td>

                        <td style={TD_STYLE}>
                          {isParking
                            ? <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f59e0b", fontSize: "12px", fontWeight: 600 }}>
                                <FaClock style={{ fontSize: "10px" }} /> Still Parking
                              </span>
                            : <span style={{ color: "#10b981", fontWeight: 600 }}>{record.duration} <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>min</span></span>}
                        </td>

                        <td style={TD_STYLE}>
                          {isParking ? (
                            <button
                              disabled
                              title="Exit car first before deleting"
                              style={{
                                padding: "7px 14px", borderRadius: "8px", fontSize: "12px",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.25)",
                                cursor: "not-allowed",
                              }}
                            >
                              In Parking
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteRecord(record._id)}
                              disabled={deletingId === record._id}
                              style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 500,
                                background: deletingId === record._id ? "rgba(244,63,94,0.05)" : "rgba(244,63,94,0.1)",
                                border: "1px solid rgba(244,63,94,0.25)",
                                color: "#f43f5e", cursor: deletingId === record._id ? "not-allowed" : "pointer",
                                transition: "all 0.18s ease",
                              }}
                              onMouseEnter={e => { if (deletingId !== record._id) e.currentTarget.style.background = "rgba(244,63,94,0.2)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "rgba(244,63,94,0.1)"; }}
                            >
                              <FaTrash style={{ fontSize: "11px" }} />
                              {deletingId === record._id ? "Deleting…" : "Delete"}
                            </button>
                          )}
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

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}

export default ParkingRecords;
