import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const ReceptionDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      try {
        const [patientsResponse, appointmentsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/patients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/appointments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPatients(patientsResponse.data);
        setAppointments(appointmentsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics
  const totalPatients = patients.length;
  const admittedToday = patients.filter((patient) => {
    const createdAt = new Date(patient.createdAt);
    const today = new Date();
    return (
      createdAt.getDate() === today.getDate() &&
      createdAt.getMonth() === today.getMonth() &&
      createdAt.getFullYear() === today.getFullYear()
    );
  }).length;

  const totalAppointments = appointments.length;
  const scheduledAppointments = appointments.filter(
    (appointment) => appointment.status === "Scheduled"
  ).length;
  const doneAppointments = appointments.filter(
    (appointment) => appointment.status === "Done"
  ).length;
  const expiredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    return appointmentDate < today && appointment.status !== "Done";
  }).length;
  const rejectedAppointments = appointments.filter(
    (appointment) => appointment.status === "Rejected"
  ).length;

  // Data for charts
  const appointmentStatusData = [
    { name: "Scheduled", value: scheduledAppointments },
    { name: "Done", value: doneAppointments },
    { name: "Expired", value: expiredAppointments },
    { name: "Rejected", value: rejectedAppointments },
  ];

  const appointmentTrendData = [
    { name: "Jan", appointments: 10 },
    { name: "Feb", appointments: 15 },
    { name: "Mar", appointments: 8 },
    { name: "Apr", appointments: 12 },
    { name: "May", appointments: 20 },
    { name: "Jun", appointments: 18 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <h1 className="text-xl font-bold text-gray-800 mt-5">Receptionist Dashboard</h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Patients Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300">
          <h2 className="text-xl font-semibold text-gray-700">Total Patients</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalPatients}</p>
          <p className="text-sm text-gray-500">Total registered patients</p>
        </div>

        {/* Admitted Patients Today Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300">
          <h2 className="text-xl font-semibold text-gray-700">Admitted Today</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{admittedToday}</p>
          <p className="text-sm text-gray-500">Patients admitted today</p>
        </div>

        {/* Total Appointments Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300">
          <h2 className="text-xl font-semibold text-gray-700">Total Appointments</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">{totalAppointments}</p>
          <p className="text-sm text-gray-500">Total appointments</p>
        </div>

        {/* Scheduled Appointments Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300">
          <h2 className="text-xl font-semibold text-gray-700">Scheduled Appointments</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{scheduledAppointments}</p>
          <p className="text-sm text-gray-500">Upcoming appointments</p>
        </div>

        {/* Done Appointments Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300">
          <h2 className="text-xl font-semibold text-gray-700">Done Appointments</h2>
          <p className="text-3xl font-bold text-teal-600 mt-2">{doneAppointments}</p>
          <p className="text-sm text-gray-500">Completed appointments</p>
        </div>

        {/* Expired Appointments Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300">
          <h2 className="text-xl font-semibold text-gray-700">Expired Appointments</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">{expiredAppointments}</p>
          <p className="text-sm text-gray-500">Expired appointments</p>
        </div>

        {/* Rejected Appointments Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300">
          <h2 className="text-xl font-semibold text-gray-700">Rejected Appointments</h2>
          <p className="text-3xl font-bold text-orange-600 mt-2">{rejectedAppointments}</p>
          <p className="text-sm text-gray-500">Rejected appointments</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Appointment Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Appointment Status</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={appointmentStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {appointmentStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Line Chart - Appointment Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Appointment Trends</h2>
          <LineChart width={500} height={300} data={appointmentTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="appointments" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;