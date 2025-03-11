import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const PharmacyDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [drugs, setDrugs] = useState([]);
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
        const [prescriptionsResponse, drugsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/prescriptions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/drugs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPrescriptions(prescriptionsResponse.data);
        setDrugs(drugsResponse.data);
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
  const totalPrescriptions = prescriptions.length;
  const totalDrugStock = drugs.reduce((sum, drug) => sum + drug.stock_quantity, 0);
  const expiredDrugs = drugs.filter((drug) => new Date(drug.expiry_date) < new Date()).length;
  const physicalCount = drugs.length;

  // Data for charts
  const drugPriceData = drugs.map((drug) => ({
    name: drug.name,
    price: parseFloat(drug.price),
  }));

  const drugUsageData = [
    { name: "Jan", usage: 400 },
    { name: "Feb", usage: 300 },
    { name: "Mar", usage: 200 },
    { name: "Apr", usage: 500 },
    { name: "May", usage: 600 },
    { name: "Jun", usage: 700 },
  ];

  const drugCategoryData = [
    { name: "Pain Reliever", value: drugs.filter((drug) => drug.category === "Pain reliever").length },
    { name: "Analgesic", value: drugs.filter((drug) => drug.category === "Analgesic").length },
    { name: "Antibiotic", value: drugs.filter((drug) => drug.category === "Antibiotic").length },
    { name: "Hematology", value: drugs.filter((drug) => drug.category === "Hematology").length },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <h1 className="text-xl font-bold text-gray-800 mt-5">Pharmacist Dashboard</h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Drug Stock Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300">
          <h2 className="text-xl font-semibold text-gray-700">Drug Stock</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalDrugStock}</p>
          <p className="text-sm text-gray-500">Total drugs in stock</p>
        </div>

        {/* Total Prescriptions Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300">
          <h2 className="text-xl font-semibold text-gray-700">Total Prescriptions</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{totalPrescriptions}</p>
          <p className="text-sm text-gray-500">Prescriptions issued</p>
        </div>

        {/* Expired Drugs Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300">
          <h2 className="text-xl font-semibold text-gray-700">Expired Drugs</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">{expiredDrugs}</p>
          <p className="text-sm text-gray-500">Expired drugs in stock</p>
        </div>

        {/* Physical Count Card */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300">
          <h2 className="text-xl font-semibold text-gray-700">Physical Count</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">{physicalCount}</p>
          <p className="text-sm text-gray-500">Total drug types</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Drug Prices */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Drug Prices</h2>
          <BarChart width={500} height={300} data={drugPriceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="price" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Line Chart - Drug Usage Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Drug Usage Over Time</h2>
          <LineChart width={500} height={300} data={drugUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="usage" stroke="#82ca9d" />
          </LineChart>
        </div>

        {/* Pie Chart - Drug Categories */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Drug Categories</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={drugCategoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {drugCategoryData.map((entry, index) => (
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

export default PharmacyDashboard;