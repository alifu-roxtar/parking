import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../Services/api.js";
import SideBar from "../../Pages/sidebar.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function PaymentRecords() {
  const [payments, setPayments] = useState([]);
  const { userId } = useParams();
  const [cars, setCars] = useState([]);

  const [showAddCarModal, setShowCarModal] = useState(false);

  const [selectedCar, setSelectedCar] = useState(null);
  const [isVeiwModalOpen, setViewModalOpen] = useState(false);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editPayment, setEditPayment] = useState(null);

  const [editCarID, setEditCarID] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const [carID, setCarID] = useState("");
  const [amount, setAmount] = useState("");
//   const [status, setStatus] = useState("");

  const openViewModal = (car) => {
    setSelectedCar(car);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedCar(null);
    setViewModalOpen(false);
  };

  const openEditModal = (payment) => {
    setEditPayment(payment);
    setEditCarID(payment.carID?._id);
    setEditStatus(payment.status);
    setEditAmount(payment.amount);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditPayment(null);
    setEditModalOpen(false);
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();

    try {
      const resp = await API.put(`/payments/update/${editPayment._id}`, {
        carID: editCarID,
        amount: editAmount,
        status: editStatus,
      });

      alert(resp.data.msg);

      closeEditModal();

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNewCar = async (e) => {
    e.preventDefault();

    try {
      const newPay = await API.post(`/payments/create/${userId}`, {
        userId: userId,
        carID,
        amount,
      });

      alert(newPay.data.msg);

      setShowCarModal(false);

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      const res = await API.get(`/payments/all/${userId}`);
      setPayments(res.data);
    };
    fetchPayments();
  }, [userId]);

  const handleDeleteRecord = async (id) => {
    const confirmDelete = confirm("Are you sure to delete this record ?");
    if (!confirmDelete) return;
    try {
      const removeRecord = await API.delete(`/payments/delete/${id}`);
      console.log(removeRecord);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userId) {
      return;
    }

    const getCars = async () => {
      try {
        const res = await API.get(`/cars/user/${userId}`);
        setCars(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getCars();
  }, [userId]);

  const exportToExcel = () => {
    const formattedData = payments.map((payment) => ({
      DriverName: payment.carID?.driverName
        ? payment.carID?.driverName
        : "Car Removed",

      PlateNumber: payment.carID?.plateNumber
        ? payment.carID?.plateNumber
        : "N/A",

      SlotNumber: payment.carID?.slotID?.slotNumber,

      AmountPaid: payment.amount,

      PaymentStatus: payment.status,
      PaymentDate: payment.createdAt,
    }));

    // create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // create workbook
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Payment Records");

    // generate excel buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // create blob
    const data = new Blob(
      [excelBuffer],
      // {
      //     type:
      //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
      // }
    );

    saveAs(data, "PaymentRecords.xlsx");
  };

  return (
    <div>
      <SideBar />
      <div className="flex flex-col min-h-screen bg-blue-700 items-center py-10 ml-60 px-5">
        <h2 className="text-white text-3xl font-bold mb-6">
          Payments Records For Cars Parked Today
        </h2>
        <div className="w-full max-w-5xl flex justify-between mb-5">
          <button
            onClick={exportToExcel}
            className="bg-blue-500 hover:bg-blue-900 text-white px-5 py-2 rounded-lg shadow cursor-pointer"
          >
            Export Report Data
          </button>

          <button
            onClick={() => setShowCarModal(true)}
            className="bg-green-500 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow cursor-pointer"
          >
            + Add New Payment Record
          </button>
        </div>
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4 text-center">Driver Name</th>
                <th className="p-4 text-center">Plate Number</th>
                <th className="p-4 text-center">Slot Number</th>
                <th className="p-4 text-center">Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Payment Date</th>
                <th colSpan={3} className="p-4 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-4 text-center">
                      {payment.carID?.driverName ? (
                        payment.carID?.driverName
                      ) : (
                        <span className="text-gray-400">Car Removed</span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      {payment.carID?.plateNumber ? (
                        payment.carID?.plateNumber
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                        {payment.carID?.slotID?.slotNumber}
                      </span>
                    </td>

                    <td className="p-4 text-center">{payment.amount} $</td>
                    <td className="p-4 text-center">
                      {payment.status === "completed" ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                          Completed
                        </span>
                      ) : payment.status === "pending" ? (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                          Pending
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                          Failed
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => openViewModal(payment)}
                        className="bg-blue-600 m-2 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(payment)}
                        className="bg-yellow-600 m-2 cursor-pointer hover:bg-yellow-700 text-white px-4 py-2 rounded"
                      >
                        Edit
                      </button>
                      {payment.status == "pending" ? (
                        <button className="bg-yellow-600 cursor-not-allowed hover:bg-green-700 text-white px-4 py-2 rounded">
                          Not Paid Yet
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteRecord(payment._id)}
                          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-16 text-center">
                    <div className="ml-30 flex flex-col items-center gap-4">
                      <div className="text-6xl">💵</div>

                      <h2 className="text-2xl font-bold text-gray-700">
                        No Payment Records Data Yet
                      </h2>
                      <button
                        onClick={() => setShowCarModal(true)}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        Add Payment Record
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isVeiwModalOpen && selectedCar && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl">
              <h2 className="text-2xl text-green-500 font-bold mb-5">
                Car Payment Details
              </h2>

              <div className="space-y-3 text-gray-700">
                <p>
                  Plate Number:
                  <b className="text-blue-500 ml-2">
                    {selectedCar.carID?.plateNumber}
                  </b>
                </p>

                <p>
                  Driver Name:
                  <b className="text-purple-700 ml-2">
                    {selectedCar.carID?.driverName}
                  </b>
                </p>

                <p>
                  Slot Number:
                  <b className="text-green-600 ml-2">
                    {selectedCar.carID?.slotID?.slotNumber}
                  </b>
                </p>
                <p>
                  Phone Number:
                  <b className="text-gray-800 ml-2">
                    {selectedCar.carID?.phoneNumber}
                  </b>
                </p>

                <p>
                  Amount Paid:
                  <b className="text-yellow-600 ml-2">{selectedCar.amount}</b>
                </p>
                <p>
                  Payment Status:
                  <b className="text-blue-600 ml-2">{selectedCar.status}</b>
                </p>
              </div>

              <button
                onClick={closeViewModal}
                className="mt-6 bg-gray-600 hover:bg-gray-800 text-white px-5 py-2 rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showAddCarModal && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl w-105 shadow-2xl">
              <h2 className="text-2xl font-bold text-blue-500 mb-5">
                Create Payment
              </h2>

              <form onSubmit={handleAddNewCar} className="flex flex-col gap-4">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount To Pay"
                  className="border p-3 rounded-lg"
                />

                <select
                  className="p-3 border rounded-lg"
                  value={carID}
                  onChange={(e) => setCarID(e.target.value)}
                >
                  <option value="">Select Car To Pay For</option>

                  {cars.map((car) => (
                    <option key={car._id} value={car._id}>
                      Car {car.plateNumber} - Driver {car.driverName}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    + Add Payment
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCarModal(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditModalOpen && editPayment && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl w-105 shadow-2xl">
              <h2 className="text-2xl font-bold text-yellow-600 mb-5">
                Edit Payment
              </h2>

              <form
                onSubmit={handleUpdatePayment}
                className="flex flex-col gap-4"
              >
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  placeholder="Amount"
                  className="border p-3 rounded-lg"
                />

                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="border p-3 rounded-lg"
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>

                <select
                  value={editCarID}
                  onChange={(e) => setEditCarID(e.target.value)}
                  className="border p-3 rounded-lg"
                >
                  {cars.map((car) => (
                    <option key={car._id} value={car._id}>
                      {car.driverName} - {car.plateNumber}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentRecords;
