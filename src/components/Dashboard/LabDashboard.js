import React, { useState, useEffect } from "react";
import { Search } from "react-bootstrap-icons";
import { CheckCircle as CompletedIcon, HourglassEmpty as PendingIcon, HourglassEmpty, CheckCircle, Science,
  Build, // Maintenance
  ReportProblem, // Broken
  Edit,
  Delete,
  Notifications
 } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import html2pdf from "html2pdf.js"; // For PDF generation

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const LabDashboard = () => {
  // State Management for Tests
  const [tests, setTests] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [results, setResults] = useState("");
  const [filter, setFilter] = useState("All");

  // State Management for Equipment
  const [equipmentList, setEquipmentList] = useState([]);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    status: "Available",
  });
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEquipmentId, setEditingEquipmentId] = useState(null);

  // Fetch Tests Assigned to Technician
  const fetchTests = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/technician/tests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTests(data);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch tests.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching tests.");
    }
  };

  // Fetch Equipment from Backend
  const fetchEquipment = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/equipment");
      if (!response.ok) {
        throw new Error("Failed to fetch equipment");
      }
      const data = await response.json();
      setEquipmentList(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add or Update Equipment
  const handleAddOrUpdateEquipment = async () => {
    if (!newEquipment.name.trim()) {
      toast.error("Please enter equipment name.");
      return;
    }

    try {
      const url = isEditing
        ? `http://localhost:5000/api/equipment/${editingEquipmentId}`
        : "http://localhost:5000/api/equipment";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEquipment),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "add"} equipment`);
      }

      toast.success(`Equipment ${isEditing ? "updated" : "added"} successfully!`);
      setNewEquipment({ name: "", status: "Available" });
      setShowAddEquipmentModal(false);
      setIsEditing(false);
      setEditingEquipmentId(null);
      fetchEquipment(); // Refresh the equipment list
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete Equipment
  const handleDeleteEquipment = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/equipment/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete equipment");
      }

      toast.success("Equipment deleted successfully!");
      fetchEquipment(); // Refresh the equipment list
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Open Edit Modal for Equipment
  const handleEditEquipment = (equipment) => {
    setNewEquipment({
      name: equipment.name,
      status: equipment.status,
    });
    setIsEditing(true);
    setEditingEquipmentId(equipment.id);
    setShowAddEquipmentModal(true);
  };

  // Handle Update Test Results
  const handleUpdateResults = async () => {
    if (!results) {
      toast.error("Please enter test results before updating.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/tests/${selectedTest.id}/results`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          results: results,
          status: "Completed", // Automatically mark as completed when results are updated
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        fetchTests(); // Refresh the list of tests
        setResults(""); // Clear the results input
        setShowUpdateModal(false); // Close the update modal
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update test results.");
      }
    } catch (error) {
      toast.error("An error occurred while updating test results.");
    }
  };

  // Filter and Pagination Logic for Tests
  const filteredTests = tests.filter((test) => {
    if (!test || !test.patient_name) return false;
    const matchesSearchTerm = test.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
    return filter === "All" ? matchesSearchTerm : matchesSearchTerm && test.status === filter;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredTests.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredTests.length / usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Download Report as PDF
  const downloadReport = () => {
    const element = document.getElementById("report-content");
    const options = {
      margin: 10,
      filename: `Patient_Report_${selectedTest.patient_id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };

  // Chart Data
  const testStatusData = {
    labels: ["Pending", "Completed"],
    datasets: [
      {
        label: "Test Status",
        data: [
          tests.filter((test) => test.status === "Pending").length,
          tests.filter((test) => test.status === "Completed").length,
        ],
        backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(75, 192, 192, 0.5)"],
        borderWidth: 1,
      },
    ],
  };

  const handleNotifyAdmin = async (equipmentId, equipmentName) => {
    const message = `Equipment "${equipmentName}" requires attention. Status: ${equipmentList.find(eq => eq.id === equipmentId).status}.`;
  
    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipment_id: equipmentId,
          message: message,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send notification");
      }
  
      toast.success("Admin notified successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const testsPerMonthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Tests Per Month",
        data: [50, 70, 60, 90, 100, 110, 130],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Fetch Data on Component Mount
  useEffect(() => {
    fetchTests();
    fetchEquipment();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-5">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1 className="text-xl font-bold mb-6">Technician Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Tests */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300">
          <div className="flex items-center gap-2 mb-1">
            <Science className="text-blue-500 text-xl" />
            <h3 className="text-md font-semibold">Total Tests</h3>
          </div>
          <p className="text-2xl font-bold">{tests.length}</p>
        </div>

        {/* Pending Tests */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300">
          <div className="flex items-center gap-2 mb-1">
            <HourglassEmpty className="text-yellow-500 text-xl" />
            <h3 className="text-md font-semibold">Pending Tests</h3>
          </div>
          <p className="text-2xl font-bold">{tests.filter((test) => test.status === "Pending").length}</p>
        </div>

        {/* Completed Tests */}
        <div className="p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="text-green-500 text-xl" />
            <h3 className="text-md font-semibold">Completed Tests</h3>
          </div>
          <p className="text-2xl font-bold">{tests.filter((test) => test.status === "Completed").length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-md font-semibold mb-4">Test Status Distribution</h3>
          <Pie data={testStatusData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-md font-semibold mb-4">Tests Per Month</h3>
          <Bar data={testsPerMonthData} />
        </div>
      </div>

      {/* Laboratory Equipment */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Science className="text-blue-500 text-xl" />
            <h3 className="text-md font-semibold">Laboratory Equipment</h3>
          </div>
          <button
            onClick={() => {
              setShowAddEquipmentModal(true);
              setIsEditing(false);
              setNewEquipment({ name: "", status: "Available" });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Equipment
          </button>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { status: "Available", color: "bg-green-100", icon: <CheckCircle className="text-green-500" /> },
            { status: "In Use", color: "bg-yellow-100", icon: <HourglassEmpty className="text-yellow-500" /> },
            { status: "Maintenance", color: "bg-blue-100", icon: <Build className="text-blue-500" /> },
            { status: "Broken", color: "bg-red-100", icon: <ReportProblem className="text-red-500" /> }
          ].map(({ status, color, icon }) => (
            <div key={status} className={`p-4 rounded-lg flex items-center gap-2 ${color}`}>
              {icon}
              <div>
                <h3 className="text-sm font-semibold">{status}</h3>
                <p className="text-2xl font-bold">
                  {equipmentList.filter((eq) => eq.status === status).length}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Equipment Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipmentList.map((equipment) => (
                <tr key={equipment.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                    <Science className="text-gray-500" /> {/* Icon beside name */}
                    {equipment.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        equipment.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : equipment.status === "In Use"
                          ? "bg-yellow-100 text-yellow-800"
                          : equipment.status === "Maintenance"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {equipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-3">
                    {/* Action buttons with tooltips */}
                    <button
                      onClick={() => handleEditEquipment(equipment)}
                      className="text-blue-500 hover:text-blue-700 relative group"
                    >
                      <Edit />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                        Edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteEquipment(equipment.id)}
                      className="text-red-500 hover:text-red-700 relative group"
                    >
                      <Delete />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                        Delete
                      </span>
                    </button>
                    <button
                      onClick={() => handleNotifyAdmin(equipment.id, equipment.name)}
                      className="text-purple-500 hover:text-purple-700 relative group"
                    >
                      <Notifications />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                        Notify Admin
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Reports */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-md font-semibold">Test Reports</h3>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="w-5 h-5 text-gray-400" />
              </span>
            </div>

            {/* Filter Dropdown */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Test Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptoms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Disease</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check For</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((test, index) => (
                <tr key={test.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.patient_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.patient_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {test.symptoms}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.expected_disease}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.check_for}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(test.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.assigned_by}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        test.status === "Completed"
                          ? "bg-green-400 text-white"
                          : test.status === "Pending"
                          ? "bg-yellow-400 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {test.status === "Completed" && <CompletedIcon fontSize="small" />}
                      {test.status === "Pending" && <PendingIcon fontSize="small" />}
                      {test.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {test.results}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => {
                        setSelectedTest(test);
                        setShowViewModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTest(test);
                        setShowUpdateModal(true);
                      }}
                      className="text-green-500 hover:text-green-700 ml-2"
                    >
                      Update Results
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Results per page:</span>
            <select
              value={usersPerPage}
              onChange={handleUsersPerPageChange}
              className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              1
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              &lt;
            </button>
            <span className="px-3 py-1 bg-white text-gray-700 rounded-lg">
              {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              &gt;
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {totalPages}
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedTest && (
        <div className="fixed inset-0 bg-stone-800 bg-opacity-75 flex justify-center items-center z-[9999] animate-fadeIn">
          <div className="bg-white rounded-xl w-11/12 lg:w-8/12 max-h-[90vh] overflow-y-auto shadow-lg transform transition-all duration-300 flex flex-col">
            <div className="border-b border-stone-200 p-4 sm:p-5 flex justify-between items-center bg-gray-100">
              <h1 className="text-lg font-semibold text-stone-800">Patient Diagnosis Report</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={downloadReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Download Report
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-stone-500 hover:text-red-600 text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6" id="report-content">
              <div className="space-y-6">
                {/* Patient Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Patient Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Patient ID</h3>
                      <p className="text-base text-gray-900">{selectedTest.patient_id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Patient Name</h3>
                      <p className="text-base text-gray-900">{selectedTest.patient_name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Assigned By</h3>
                      <p className="text-base text-gray-900">{selectedTest.assigned_by}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date</h3>
                      <p className="text-base text-gray-900">
                        {new Date(selectedTest.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Test Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Test Summary</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Symptoms</h3>
                      <p className="text-base text-gray-900">
                        {selectedTest.symptoms}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Expected Disease</h3>
                      <p className="text-base text-gray-900">{selectedTest.expected_disease}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Check For</h3>
                      <p className="text-base text-gray-900">{selectedTest.check_for}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <p className="text-base text-gray-900">
                        <span
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            selectedTest.status === "Completed"
                              ? "bg-green-400 text-white"
                              : selectedTest.status === "Pending"
                              ? "bg-yellow-400 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedTest.status === "Completed" && <CompletedIcon fontSize="small" />}
                          {selectedTest.status === "Pending" && <PendingIcon fontSize="small" />}
                          {selectedTest.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Test Results</h2>
                  <p className="text-base text-gray-900">{selectedTest.results}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Results Modal */}
      {showUpdateModal && selectedTest && (
        <div className="fixed inset-0 bg-stone-800 bg-opacity-75 flex justify-center items-center z-[9999] animate-fadeIn">
          <div className="bg-white rounded-xl w-11/12 lg:w-4/12 max-h-[90vh] overflow-y-auto shadow-lg transform transition-all duration-300 flex flex-col">
            <div className="border-b border-stone-200 p-4 sm:p-5 flex justify-between items-center bg-gray-100">
              <h1 className="text-lg font-semibold text-stone-800">Update Test Results</h1>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-stone-500 hover:text-red-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Results</label>
                  <textarea
                    value={results}
                    onChange={(e) => setResults(e.target.value)}
                    placeholder="Enter test results"
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateResults}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ml-2"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Equipment Modal */}
      {showAddEquipmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/3 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {isEditing ? "Edit Equipment" : "Add New Equipment"}
              </h2>
              <button
                onClick={() => setShowAddEquipmentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment Name
                </label>
                <input
                  type="text"
                  value={newEquipment.name}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, name: e.target.value })
                  }
                  placeholder="Enter equipment name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newEquipment.status}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="In Use">In Use</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Broken">Broken</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddEquipmentModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrUpdateEquipment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {isEditing ? "Update Equipment" : "Add Equipment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabDashboard;