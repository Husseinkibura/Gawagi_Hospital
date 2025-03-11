import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [emergencyCases, setEmergencyCases] = useState([]);
  const [tests, setTests] = useState([]);
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
        const [patientsResponse, appointmentsResponse, emergencyCasesResponse, testsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/patients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/appointments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/emergency-cases", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/auth/tests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPatients(patientsResponse.data);
        setAppointments(appointmentsResponse.data);
        setEmergencyCases(emergencyCasesResponse.data);
        setTests(testsResponse.data);
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
  const totalAppointments = appointments.length;
  const totalEmergencyCases = emergencyCases.length;
  const totalTests = tests.length;

  // Data for charts
  const topDiseasesData = tests
    .map((test) => test.expected_disease)
    .reduce((acc, disease) => {
      acc[disease] = (acc[disease] || 0) + 1;
      return acc;
    }, {});
  const topDiseasesChartData = Object.keys(topDiseasesData)
    .map((disease) => ({
      name: disease,
      count: topDiseasesData[disease],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 diseases

  const testResultsData = tests.reduce(
    (acc, test) => {
      if (test.results && test.results.includes("+ve")) acc.positive++;
      else if (test.results && test.results.includes("-ve")) acc.negative++;
      return acc;
    },
    { positive: 0, negative: 0 }
  );

  const testResultsChartData = [
    { name: "Positive", value: testResultsData.positive },
    { name: "Negative", value: testResultsData.negative },
  ];

  const appointmentsOverTime = appointments.reduce((acc, appointment) => {
    const date = new Date(appointment.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const appointmentsOverTimeChartData = Object.keys(appointmentsOverTime).map((date) => ({
    name: date,
    count: appointmentsOverTime[date],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <h1 className="text-xl font-bold text-gray-800 mt-5">Doctor Dashboard</h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Patients Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300">
          <h2 className="text-xl font-semibold text-gray-700">Total Patients</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalPatients}</p>
          <p className="text-sm text-gray-500">Total patients registered</p>
        </div>

        {/* Total Appointments Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300">
          <h2 className="text-xl font-semibold text-gray-700">Total Appointments</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{totalAppointments}</p>
          <p className="text-sm text-gray-500">Total appointments scheduled</p>
        </div>

        {/* Total Emergency Cases Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300">
          <h2 className="text-xl font-semibold text-gray-700">Emergency Cases</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">{totalEmergencyCases}</p>
          <p className="text-sm text-gray-500">Total emergency cases</p>
        </div>

        {/* Total Lab Tests Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300">
          <h2 className="text-xl font-semibold text-gray-700">Total Lab Tests</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">{totalTests}</p>
          <p className="text-sm text-gray-500">Total lab tests conducted</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Top Diseases */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Top 10 Diseases</h2>
          <BarChart width={500} height={300} data={topDiseasesChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Pie Chart - Test Results */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Test Results</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={testResultsChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {testResultsChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Line Chart - Appointments Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Appointments Over Time</h2>
          <LineChart width={500} height={300} data={appointmentsOverTimeChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;