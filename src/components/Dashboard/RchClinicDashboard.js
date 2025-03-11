import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

const RchClinicDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReports(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch reports. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics
  const totalReports = reports.length;
  const recentReports = reports.filter(
    (report) => new Date(report.report_date) > new Date(new Date().setMonth(new Date().getMonth() - 1))
  ).length;
  const reportsByCategory = {
    Pregnancy: reports.filter((report) => report.report_name.includes("Pregnancy")).length,
    Sales: reports.filter((report) => report.report_name.includes("Sales")).length,
  };

  // Data for charts
  const reportCategoryData = [
    { name: "Pregnancy Reports", value: reportsByCategory.Pregnancy },
    { name: "Sales Reports", value: reportsByCategory.Sales },
  ];

  const reportDateData = reports.map((report) => ({
    name: new Date(report.report_date).toLocaleDateString(),
    count: 1, // Each report counts as 1
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <h1 className="text-xl font-bold text-gray-800 mt-5">Reports Dashboard</h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Reports Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700">Total Reports</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalReports}</p>
          <p className="text-sm text-gray-500">Total reports available</p>
        </div>

        {/* Recent Reports Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700">Recent Reports</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{recentReports}</p>
          <p className="text-sm text-gray-500">Reports from the last month</p>
        </div>

        {/* Reports by Category Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700">Reports by Category</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">{Object.values(reportsByCategory).reduce((a, b) => a + b, 0)}</p>
          <p className="text-sm text-gray-500">Categorized reports</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Reports Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Reports Over Time</h2>
          <BarChart width={500} height={300} data={reportDateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Pie Chart - Reports by Category */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Reports by Category</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={reportCategoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {reportCategoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default RchClinicDashboard;