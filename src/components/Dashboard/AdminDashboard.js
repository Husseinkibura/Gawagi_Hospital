import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Group,
  LocalHospital,
  PersonAdd,
  Science,
  LocalPharmacy,
  PointOfSale,
  Notifications as NotificationsIcon,
  TrendingUp,
  Assessment,
  Receipt,
} from "@mui/icons-material";
import { LineChart, BarChart, PieChart } from "@mui/x-charts"; // For graphs

// Mock data for payment transactions
const paymentTransactionsData = {
  weekly: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Payments (Tsh)",
        data: [120000, 190000, 300000, 500000, 200000, 300000, 450000],
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  },
  monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Payments (Tsh)",
        data: [1200000, 1900000, 3000000, 5000000, 2000000, 3000000, 4500000, 6000000, 7000000, 8000000, 9000000, 10000000],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  },
};

// Recent activities data
const recentActivities = [
  { icon: <PersonAdd className="text-blue-500" />, text: "New patient registered", time: "2 hours ago" },
  { icon: <LocalHospital className="text-green-500" />, text: "Doctor added a new prescription", time: "5 hours ago" },
  { icon: <Receipt className="text-purple-500" />, text: "New billing record created", time: "1 day ago" },
  { icon: <Science className="text-yellow-500" />, text: "Lab test results updated", time: "2 days ago" },
  { icon: <LocalPharmacy className="text-pink-500" />, text: "Pharmacy inventory updated", time: "3 days ago" },
  { icon: <PointOfSale className="text-red-500" />, text: "Cashier processed a payment", time: "4 days ago" },
];

// Reports data
const reports = [
  { role: "Doctor", count: 5, icon: <LocalHospital className="text-green-500" /> },
  { role: "Receptionist", count: 2, icon: <PersonAdd className="text-blue-500" /> },
  { role: "Pharmacist", count: 2, icon: <LocalPharmacy className="text-pink-500" /> },
  { role: "Cashier", count: 2, icon: <PointOfSale className="text-red-500" /> },
  { role: "Lab Technician", count: 2, icon: <Science className="text-yellow-500" /> },
  { role: "RCHClinic", count: 2, icon: <LocalPharmacy className="text-pink-500" /> },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Patients", value: "0", icon: <Group fontSize="large" className="text-blue-500" /> },
    { title: "Doctors", value: "0", icon: <LocalHospital fontSize="large" className="text-green-500" /> },
    { title: "Receptionists", value: "0", icon: <PersonAdd fontSize="large" className="text-purple-500" /> },
    { title: "Technicians", value: "0", icon: <Science fontSize="large" className="text-yellow-500" /> },
    { title: "Pharmacists", value: "0", icon: <LocalPharmacy fontSize="large" className="text-pink-500" /> },
    { title: "Cashiers", value: "0", icon: <PointOfSale fontSize="large" className="text-orange-500" /> },
    { title: "Drug Stocked", value: "0", icon: <Receipt fontSize="large" className="text-green-500" /> },
    { title: "Drug Expired", value: "0", icon: <TrendingUp fontSize="large" className="text-red-500" /> },
  ]);

  const [drugs, setDrugs] = useState([]);
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [recentPayments, setRecentPayments] = useState([]); // State for recent payment approvals
  const [paymentData, setPaymentData] = useState([]); // State for payment data

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data || []); // Ensure notifications is not null
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch payment data from the backend
  const fetchPaymentData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bills");
      if (!response.ok) {
        throw new Error("Failed to fetch payment data");
      }
      const data = await response.json();
      setPaymentData(data || []); // Ensure payment data is not null
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    fetchNotifications();
    fetchPaymentData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const endpoints = [
        { url: "http://localhost:5000/api/patients", key: "Total Patients" },
        { url: "http://localhost:5000/api/auth/doctors", key: "Doctors" },
        { url: "http://localhost:5000/api/auth/receptionists", key: "Receptionists" },
        { url: "http://localhost:5000/api/auth/technicians", key: "Technicians" },
        { url: "http://localhost:5000/api/auth/pharmacists", key: "Pharmacists" },
        { url: "http://localhost:5000/api/auth/cashiers", key: "Cashiers" },
        { url: "http://localhost:5000/api/drugs", key: "Drug Stocked" },
      ];

      // Fetch data from all endpoints
      const results = await Promise.all(
        endpoints.map(async (endpoint) => {
          const response = await fetch(endpoint.url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint.key}`);
          }
          const data = await response.json();
          return { key: endpoint.key, data: data || [] }; // Ensure data is not null
        })
      );

      // Update stats state with fetched data
      setStats((prevStats) =>
        prevStats.map((stat) => {
          const result = results.find((res) => res.key === stat.title);
          if (result) {
            return {
              ...stat,
              value: result.data.length || 0, // Ensure value is not null
            };
          }
          return stat;
        })
      );

      // Set drugs data
      const drugsResponse = results.find((res) => res.key === "Drug Stocked");
      if (drugsResponse) {
        setDrugs(drugsResponse.data || []); // Ensure drugs data is not null
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    }
  };

  // Calculate drug metrics
  const totalStockedDrugs = drugs.reduce((sum, drug) => sum + (drug.stock_quantity || 0), 0);
  const expiredDrugs = drugs.filter((drug) => new Date(drug.expiry_date) < new Date()).length;

  // Prepare drug usage data
  const drugUsageData = [
    { name: "Jan", usage: 100 },
    { name: "Feb", usage: 150 },
    { name: "Mar", usage: 200 },
    { name: "Apr", usage: 250 },
    { name: "May", usage: 300 },
    { name: "Jun", usage: 350 },
  ];

  // Prepare payment trend data
  const getPaymentsPerWeek = () => {
    const payments = paymentData.filter((bill) => bill.payment_status === "Paid");
    const weeklyData = Array(7).fill(0); // Initialize array for 7 days
    payments.forEach((bill) => {
      const day = new Date(bill.dateCreated).getDay(); // Get day of the week (0-6)
      weeklyData[day] += bill.totalBills || 0; // Increment total amount for the day
    });
    return weeklyData.map((amount, index) => ({
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index],
      amount: amount,
    }));
  };

  const getPaymentsPerMonth = () => {
    const payments = paymentData.filter((bill) => bill.payment_status === "Paid");
    const monthlyData = Array(12).fill(0); // Initialize array for 12 months
    payments.forEach((bill) => {
      const month = new Date(bill.dateCreated).getMonth(); // Get month (0-11)
      monthlyData[month] += bill.totalBills || 0; // Increment total amount for the month
    });
    return monthlyData.map((amount, index) => ({
      month: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ][index],
      amount: amount,
    }));
  };

  // Prepare payment status distribution data
  const getPaymentStatusDistribution = () => {
    const paidCount = paymentData.filter((bill) => bill.payment_status === "Paid").length;
    const pendingCount = paymentData.filter((bill) => bill.payment_status === "Pending").length;
    return [
      { label: "Paid", value: paidCount },
      { label: "Pending", value: pendingCount },
    ];
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen mt-5">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <a href="/" className="text-blue-500 text-sm sm:text-base">
          Home/Dashboard
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 sm:p-6 rounded-lg shadow-md text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
              stat.title === "Total Patients"
                ? "bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300"
                : stat.title === "Doctors"
                ? "bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300"
                : stat.title === "Receptionists"
                ? "bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300"
                : stat.title === "Technicians"
                ? "bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300"
                : stat.title === "Pharmacists"
                ? "bg-gradient-to-r from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300"
                : stat.title === "Cashiers"
                ? "bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300"
                : stat.title === "Drug Stocked"
                ? "bg-gradient-to-r from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300"
                : "bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300"
            }`}
          >
            <div className="flex justify-center">{stat.icon}</div>
            <h3 className="mt-2 text-sm sm:text-lg font-medium text-gray-700">{stat.title}</h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {stat.title === "Drug Stocked"
                ? totalStockedDrugs
                : stat.title === "Drug Expired"
                ? expiredDrugs
                : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Drug Usage Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart - Drug Usage */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Drug Usage Per Month</h2>
          <BarChart
            xAxis={[{ data: drugUsageData.map((d) => d.name), scaleType: "band" }]}
            series={[{ data: drugUsageData.map((d) => d.usage), label: "Drug Usage" }]}
            width={window.innerWidth < 768 ? 300 : 500}
            height={300}
          />
        </div>

        {/* Line Chart - Drug Usage Trend */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Drug Usage Trend</h2>
          <LineChart
            xAxis={[{ data: drugUsageData.map((d) => d.name), scaleType: "band" }]}
            series={[{ data: drugUsageData.map((d) => d.usage), label: "Drug Usage" }]}
            width={window.innerWidth < 768 ? 300 : 500}
            height={300}
          />
        </div>
      </div>

      {/* Payment Trends Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Weekly Payments */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Weekly Payment Trends</h2>
          <BarChart
            xAxis={[{ data: getPaymentsPerWeek().map((d) => d.day), scaleType: "band" }]}
            series={[{ data: getPaymentsPerWeek().map((d) => d.amount), label: "Payments (Tsh)" }]}
            width={window.innerWidth < 768 ? 300 : 500}
            height={300}
          />
        </div>

        {/* Monthly Payments */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Monthly Payment Trends</h2>
          <LineChart
            xAxis={[{ data: getPaymentsPerMonth().map((d) => d.month), scaleType: "band" }]}
            series={[{ data: getPaymentsPerMonth().map((d) => d.amount), label: "Payments (Tsh)" }]}
            width={window.innerWidth < 768 ? 300 : 500}
            height={300}
          />
        </div>
      </div>

      {/* Payment Status Distribution */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Payment Status Distribution</h2>
        <PieChart
          series={[
            {
              data: getPaymentStatusDistribution(),
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 5,
            },
          ]}
          width={window.innerWidth < 768 ? 300 : 400}
          height={300}
        />
      </div>

      {/* Recent Payment Approvals */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
          <NotificationsIcon className="text-blue-500 mr-2" />
          Recent Payment Approvals
        </h2>
        <div className="space-y-4">
          {recentPayments.length === 0 ? (
            <p className="text-sm text-gray-500">No recent payments found.</p>
          ) : (
            recentPayments.map((payment, index) => (
              <div key={index} className="p-4 rounded-lg bg-blue-50">
                <p className="text-sm font-medium text-gray-700">
                  Payment of Tsh {payment.total_amount} approved by {payment.assigned_by} for {payment.fullname}.
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(payment.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Reports from Staff</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {reports.map((report, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="flex justify-center">{report.icon}</div>
              <h3 className="mt-2 text-lg font-medium text-gray-700">{report.role}</h3>
              <p className="text-2xl font-bold text-gray-900">{report.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
          <ul className="space-y-4">
            {recentActivities.map((activity, index) => (
              <li key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">{activity.icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors duration-300">
              <PersonAdd fontSize="large" className="text-blue-500 mx-auto" />
              <p className="mt-2 text-sm font-medium text-gray-700">Add Patient</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors duration-300">
              <LocalHospital fontSize="large" className="text-green-500 mx-auto" />
              <p className="mt-2 text-sm font-medium text-gray-700">Add Doctor</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors duration-300">
              <Receipt fontSize="large" className="text-purple-500 mx-auto" />
              <p className="mt-2 text-sm font-medium text-gray-700">Generate Bill</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center hover:bg-yellow-100 transition-colors duration-300">
              <Assessment fontSize="large" className="text-yellow-500 mx-auto" />
              <p className="mt-2 text-sm font-medium text-gray-700">View Reports</p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default AdminDashboard;