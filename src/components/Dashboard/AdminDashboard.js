import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  TrendingUp,
  Group,
  AttachMoney,
  Assessment,
  PersonAdd,
  LocalHospital,
  Receipt,
  Science,
  LocalPharmacy,
  PointOfSale,
} from "@mui/icons-material";

import { LineChart, BarChart } from "@mui/x-charts"; // For graphs
import { faker } from "@faker-js/faker"; // For mock data

// Recent activities data
const recentActivities = [
  { icon: <PersonAdd className="text-blue-500" />, text: "New patient registered", time: "2 hours ago" },
  { icon: <LocalHospital className="text-green-500" />, text: "Doctor added a new prescription", time: "5 hours ago" },
  { icon: <Receipt className="text-purple-500" />, text: "New billing record created", time: "1 day ago" },
  { icon: <Science className="text-yellow-500" />, text: "Lab test results updated", time: "2 days ago" },
  { icon: <LocalPharmacy className="text-pink-500" />, text: "Pharmacy inventory updated", time: "3 days ago" },
  { icon: <PointOfSale className="text-red-500" />, text: "Cashier processed a payment", time: "4 days ago" },
];

// Mock data for graphs
const patientAdmissionsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Patients Admitted",
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: "rgba(75, 192, 192, 1)",
      fill: false,
    },
  ],
};

const cashierTransactionsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Transactions",
      data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      borderColor: "rgba(153, 102, 255, 1)",
      borderWidth: 1,
    },
  ],
};

// Reports data
const reports = [
  { role: "Doctor", count: 120, icon: <LocalHospital className="text-green-500" /> },
  { role: "Receptionist", count: 45, icon: <PersonAdd className="text-blue-500" /> },
  { role: "Pharmacist", count: 30, icon: <LocalPharmacy className="text-pink-500" /> },
  { role: "Cashier", count: 25, icon: <PointOfSale className="text-red-500" /> },
  { role: "Lab Technician", count: 15, icon: <Science className="text-yellow-500" /> },
];

const AdminDashboard = () => {
  
  const [stats, setStats] = useState([
    { title: "Total Patients", value: "Loading...", icon: <Group fontSize="large" className="text-blue-500" /> },
    { title: "Doctors", value: "Loading...", icon: <LocalHospital fontSize="large" className="text-green-500" /> },
    { title: "Receptionists", value: "Loading...", icon: <PersonAdd fontSize="large" className="text-purple-500" /> },
    { title: "Technicians", value: "Loading...", icon: <Science fontSize="large" className="text-yellow-500" /> },
    { title: "Pharmacists", value: "Loading...", icon: <LocalPharmacy fontSize="large" className="text-pink-500" /> },
    { title: "Cashiers", value: "Loading...", icon: <PointOfSale fontSize="large" className="text-orange-500" /> },
    { title: "Drug Stocked", value: "28", icon: <Receipt fontSize="large" className="text-green-500" /> },
    { title: "Drug Expired", value: "28", icon: <TrendingUp fontSize="large" className="text-red-500" /> },
  ]);

const fetchData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("No token found. Please log in.");
    return;
  }

  try {
    const endpoints = [
      { url: "http://localhost:5000/api/auth/doctors", key: "Doctors" },
      { url: "http://localhost:5000/api/auth/receptionists", key: "Receptionists" },
      { url: "http://localhost:5000/api/auth/pharmacists", key: "Pharmacists" },
      { url: "http://localhost:5000/api/auth/cashiers", key: "Cashiers" },
      { url: "http://localhost:5000/api/auth/technicians", key: "Technicians" },
    ];
    
    const responses = await Promise.all(
      endpoints.map(endpoint => 
        fetch(endpoint.url, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => res.json())
          .then(data => ({ key: endpoint.key, value: data.length }))
      )
    );

    const newStats = stats.map(stat => {
      const match = responses.find(response => response.key === stat.title);
      return match ? { ...stat, value: match.value } : stat;
    });

    setStats(newStats);
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error("An error occurred while fetching data.");
  }
};

useEffect(() => {
  fetchData();
}, []);


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mt-5">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <a href="/" className="text-blue-500">
          Home/Dashboard
        </a>
      </div>
      <br />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-center">{stat.icon}</div>
            <h3 className="mt-2 text-lg font-medium text-gray-700">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Patients Admitted Development */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Patients Admitted Development</h2>
          <LineChart
            xAxis={[{ data: patientAdmissionsData.labels, scaleType: "band" }]}
            series={[
              {
                data: patientAdmissionsData.datasets[0].data,
                label: patientAdmissionsData.datasets[0].label,
              },
            ]}
            width={500}
            height={300}
          />
        </div>

        {/* Cashier Transactions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Cashier Transactions</h2>
          <BarChart
            xAxis={[{ data: cashierTransactionsData.labels, scaleType: "band" }]}
            series={[
              {
                data: cashierTransactionsData.datasets[0].data,
                label: cashierTransactionsData.datasets[0].label,
              },
            ]}
            width={500}
            height={300}
          />
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
    </div>
  );
};

export default AdminDashboard;