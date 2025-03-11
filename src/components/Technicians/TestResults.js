import React, { useState, useEffect } from "react";
import { Search } from "react-bootstrap-icons";
import { CheckCircle as CompletedIcon, HourglassEmpty as PendingIcon, Visibility as ViewIcon, Edit as EditIcon } from "@mui/icons-material";
import { FaPlus } from "react-icons/fa"; // Import FaPlus from react-icons/fa
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2pdf from "html2pdf.js"; // For PDF generation

const TestResult = () => {
  // State Management
  const [tests, setTests] = useState([]); // Tests assigned to the technician
  const [showViewModal, setShowViewModal] = useState(false); // View test details modal
  const [showUpdateModal, setShowUpdateModal] = useState(false); // Update test results modal
  const [selectedTest, setSelectedTest] = useState(null); // Selected test for viewing/updating
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering tests
  const [currentPage, setCurrentPage] = useState(1); // Pagination: current page
  const [usersPerPage, setUsersPerPage] = useState(5); // Pagination: items per page
  const [results, setResults] = useState([]); // Test results input (initialized as an array)
  const [filter, setFilter] = useState("All"); // Filter option: All, Pending, Completed
  const [diseases, setDiseases] = useState([]); // List of diseases

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
        console.log("Fetched tests:", data); // Log the fetched data
        setTests(data); // Update the state
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch tests.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching tests.");
    }
  };

  // Fetch Diseases from API
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/diseases", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDiseases(data); // Set the fetched diseases
        } else {
          toast.error("Failed to fetch diseases.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching diseases.");
      }
    };

    fetchDiseases();
  }, []);

  // Handle Update Test Results
  const handleUpdateResults = async () => {
    if (!Array.isArray(results)) {
      toast.error("Results must be an array.");
      return;
    }

    if (results.some((result) => !result.disease_name || !result.result)) {
      toast.error("Please fill in all disease results before submitting.");
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
          results: results.map((result) => ({
            disease_name: result.disease_name,
            test_type: result.test_type,
            result: result.result,
          })),
          status: "Completed", // Automatically mark as completed when results are updated
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        fetchTests(); // Refresh the list of tests
        setResults([]); // Clear the results input
        setShowUpdateModal(false); // Close the update modal
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update test results.");
      }
    } catch (error) {
      toast.error("An error occurred while updating test results.");
    }
  };

  // Toggle View Modal
  const toggleViewModal = (test) => {
    setSelectedTest(test);
    setShowViewModal(!showViewModal);
  };

  // Filter and Pagination Logic
  const filteredTests = tests.filter((test) => {
    // Filter by search term
    if (!test || !test.patient_name) return false;
    const matchesSearchTerm = test.patient_name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    if (filter === "All") {
      return matchesSearchTerm;
    } else {
      return matchesSearchTerm && test.status === filter;
    }
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

  useEffect(() => {
    fetchTests(); // Fetch tests when the component mounts
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-5">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Assigned Tests</h1>
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                    <button
                      onClick={() => toggleViewModal(test)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md flex items-center gap-1 hover:bg-blue-700 transition duration-300 text-xs"
                    >
                      <ViewIcon className="text-white" style={{ fontSize: "14px" }} /> View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTest(test);
                        setShowUpdateModal(true);
                      }}
                      className="bg-green-500 text-white px-2 py-1 rounded-md flex items-center gap-1 hover:bg-green-700 transition duration-300 text-xs"
                    >
                      <EditIcon className="text-white" style={{ fontSize: '14px' }} /> Update Results
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                  <div className="space-y-4">
                    {/* Symptoms */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Symptoms</h3>
                      <ul className="list-disc list-inside">
                        {Array.isArray(selectedTest.symptoms)
                          ? selectedTest.symptoms.map((symptom, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                {symptom}
                              </li>
                            ))
                          : selectedTest.symptoms.split(", ").map((symptom, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                {symptom}
                              </li>
                            ))}
                      </ul>
                    </div>

                    {/* Expected Diseases */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Expected Diseases</h3>
                      <ul className="list-disc list-inside">
                        {selectedTest.expected_disease.split(", ").map((disease, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {disease}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Check For */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Check For</h3>
                      <ul className="list-disc list-inside">
                        {selectedTest.check_for.split(", ").map((disease, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {disease}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Status */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <p className="text-sm text-gray-900">
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
          <div className="bg-white rounded-xl w-11/12 lg:w-6/12 max-h-[90vh] overflow-y-auto shadow-lg transform transition-all duration-300 flex flex-col">
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
                {/* Disease Selection and Results */}
                {results.map((result, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex gap-2">
                      <select
                        value={result.disease_name}
                        onChange={(e) => {
                          const updatedResults = [...results];
                          updatedResults[index].disease_name = e.target.value;
                          updatedResults[index].test_type = diseases.find(
                            (disease) => disease.disease_name === e.target.value
                          )?.test_type || "";
                          setResults(updatedResults);
                        }}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Select a disease</option>
                        {diseases.map((disease) => (
                          <option key={disease.id} value={disease.disease_name}>
                            {disease.disease_name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={result.result}
                        onChange={(e) => {
                          const updatedResults = [...results];
                          updatedResults[index].result = e.target.value;
                          setResults(updatedResults);
                        }}
                        className="w-24 h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Result</option>
                        <option value="+ve">+ve</option>
                        <option value="-ve">-ve</option>
                      </select>
                      <button
                        onClick={() => {
                          const updatedResults = results.filter((_, i) => i !== index);
                          setResults(updatedResults);
                        }}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                      <input
                        type="text"
                        value={result.test_type}
                        readOnly
                        className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
                      />
                    </div>
                  </div>
                ))}

                {/* Add New Disease Result */}
                <button
                  onClick={() => {
                    setResults([...results, { disease_name: "", test_type: "", result: "" }]);
                  }}
                  className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm flex items-center gap-1"
                >
                  <FaPlus className="w-4 h-4" /> Add Disease Result
                </button>

                {/* Submit Button */}
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
    </div>
  );
};

export default TestResult;