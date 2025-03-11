import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaFileInvoice, FaMoneyBillWave, FaHistory, FaUser } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"; // For charts

const CashierDashboard = () => {
  const [bills, setBills] = useState([]); // State for bills
  const [patients, setPatients] = useState([]); // State for patients
  const [selectedBill, setSelectedBill] = useState(null); // State for selected bill
  const [showInvoiceModal, setShowInvoiceModal] = useState(false); // State for invoice modal
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch bills from the backend
  const fetchBills = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bills");
      if (!response.ok) {
        throw new Error("Failed to fetch bills");
      }
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error("Failed to fetch bills");
    }
  };

  // Fetch patients from the backend
  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/patients");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients");
    }
  };

  // Approve payment for a bill
  const approvePayment = async (billId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bills/${billId}/approve-payment`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to approve payment");
      }
      const data = await response.json();
      toast.success("Payment approved successfully!");
      fetchBills(); // Refresh the bills list
    } catch (error) {
      console.error("Error approving payment:", error);
      toast.error("Failed to approve payment");
    }
  };

  // Generate invoice for a bill
  const generateInvoice = (bill) => {
    setSelectedBill(bill);
    setShowInvoiceModal(true);
  };

  // Fetch bills and patients on component mount
  useEffect(() => {
    fetchBills();
    fetchPatients();
  }, []);

  // Calculate total pending bills
  const totalPendingBills = bills.filter((bill) => bill.payment_status === "Pending").length;

  // Calculate total transactions approved today
  const totalTransactionsApprovedToday = bills
    .filter((bill) => {
      if (!bill.dateCreated) return false; // Skip if dateCreated is missing or invalid
      const today = new Date().toISOString().split("T")[0];
      const billDate = new Date(bill.dateCreated).toISOString().split("T")[0];
      return bill.payment_status === "Paid" && billDate === today;
    })
    .length;

  // Prepare data for charts (payments per week and month)
  const getPaymentsPerWeek = () => {
    const payments = bills.filter((bill) => bill.payment_status === "Paid");
    const weeklyData = Array(7).fill(0); // Initialize array for 7 days
    payments.forEach((bill) => {
      const day = new Date(bill.dateCreated).getDay(); // Get day of the week (0-6)
      weeklyData[day] += 1; // Increment count for the day
    });
    return weeklyData.map((count, index) => ({
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index],
      payments: count,
    }));
  };

  const getPaymentsPerMonth = () => {
    const payments = bills.filter((bill) => bill.payment_status === "Paid");
    const monthlyData = Array(12).fill(0); // Initialize array for 12 months
    payments.forEach((bill) => {
      const month = new Date(bill.dateCreated).getMonth(); // Get month (0-11)
      monthlyData[month] += 1; // Increment count for the month
    });
    return monthlyData.map((count, index) => ({
      month: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ][index],
      payments: count,
    }));
  };

  // Limit the table to 5 items
  const displayedBills = bills.slice(0, 5);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1 className="text-2xl font-bold text-gray-800 mt-5">Cashier Dashboard</h1>
      <p className="text-gray-600">Welcome, Cashier!</p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {/* Total Patients Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300">
          <div className="flex justify-center">
            <FaUser className="text-blue-500 text-3xl" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-700">Total Patients</h3>
          <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
        </div>

        {/* Total Pending Bills Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300">
          <div className="flex justify-center">
            <FaFileInvoice className="text-yellow-500 text-3xl" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-700">Pending Bills</h3>
          <p className="text-2xl font-bold text-gray-900">{totalPendingBills}</p>
        </div>

        {/* Total Transactions Approved Today Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300">
          <div className="flex justify-center">
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-700">Approved Today</h3>
          <p className="text-2xl font-bold text-gray-900">{totalTransactionsApprovedToday}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payments Per Week Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Payments Per Week</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getPaymentsPerWeek()}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="payments" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payments Per Month Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Payments Per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getPaymentsPerMonth()}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="payments" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bills Table */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Bills</h2>
          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedBills.map((bill, index) => (
                    <tr key={bill.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.fullname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tsh {bill.totalBills}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            bill.payment_status === "Paid"
                              ? "bg-green-400 text-white"
                              : "bg-yellow-400 text-white"
                          }`}
                        >
                          {bill.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => approvePayment(bill.id)}
                            disabled={bill.payment_status === "Paid"}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-green-300 flex items-center text-sm"
                          >
                            <FaCheckCircle className="mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => generateInvoice(bill)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center text-sm"
                          >
                            <FaFileInvoice className="mr-1" />
                            Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Invoice</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                <p className="text-sm text-gray-500">{selectedBill.fullname}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <p className="text-sm text-gray-500">Tsh {selectedBill.totalBills}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="text-sm text-gray-500">{selectedBill.payment_status}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.success("Invoice generated successfully!");
                  setShowInvoiceModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaHistory className="text-blue-500 mr-2" />
          Recent Activities
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <FaMoneyBillWave className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Payment of Tsh 27000 approved for Ashura Juma</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </li>
          <li className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <FaFileInvoice className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Invoice generated for John Doe</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CashierDashboard;