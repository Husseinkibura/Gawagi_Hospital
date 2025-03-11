import React, { useState, useEffect } from "react";
import { Search } from "react-bootstrap-icons";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom"; // Import useLocation to check the current URL

const Reports = () => {
  const location = useLocation(); // Get the current URL path
  const isAdminView = location.pathname === "/admin/reports"; // Check if the URL is for admin view

  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage, setReportsPerPage] = useState(5);
  const [formData, setFormData] = useState({
    reportName: "",
    reportFile: null,
    reportDate: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, reportFile: file });
    }
  };

  const fetchReports = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedReports = data.map((report) => ({
          id: report.id,
          reportName: report.report_name,
          reportFile: report.report_file,
          reportDate: report.report_date,
        }));
        setReports(formattedReports);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch reports.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching reports.");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) =>
    report.reportName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleReportsPerPageChange = (e) => {
    setReportsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setFormData({
        reportName: "",
        reportFile: null,
        reportDate: "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the current date and time
    const now = new Date();
    const reportDate = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const reportTime = now.toTimeString().split(" ")[0]; // Format: HH:MM:SS

    const formDataToSend = new FormData();
    formDataToSend.append("reportName", formData.reportName);
    formDataToSend.append("reportFile", formData.reportFile);
    formDataToSend.append("reportDate", reportDate); // Automatically set the date
    formDataToSend.append("reportTime", reportTime); // Automatically set the time

    const url = formData.id
      ? `http://localhost:5000/api/reports/${formData.id}`
      : "http://localhost:5000/api/reports";

    try {
      const response = await fetch(url, {
        method: formData.id ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        toggleModal();
        fetchReports(); // Refresh the list of reports
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update/add report.");
      }
    } catch (error) {
      toast.error("An error occurred while updating/adding the report.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        toast.success("Report deleted successfully!");
        fetchReports();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the report.");
    }
  };

  const handleEdit = (id) => {
    const report = reports.find((report) => report.id === id);
    setFormData({
      id: report.id,
      reportName: report.reportName,
      reportFile: report.reportFile,
      reportDate: report.reportDate,
    });
    toggleModal();
  };

  const handleView = (reportFile) => {
    window.open(`http://localhost:5000/uploads/${reportFile}`, "_blank");
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-5">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Report List</h1>
        {/* Hide the Upload Button for Admin View */}
        {!isAdminView && (
          <div className="flex items-center space-x-4">
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
            <button
              onClick={toggleModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Upload Report
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                {/* Hide Actions Column for Admin View */}
                {!isAdminView && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report, index) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indexOfFirstReport + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reportName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.reportFile && (
                      <a
                        href={`http://localhost:5000/uploads/${report.reportFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View Report
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reportDate}</td>
                  {/* Hide Actions Buttons for Admin View */}
                  {!isAdminView && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                      <button
                        onClick={() => handleView(report.reportFile)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(report.id)}
                        className="text-green-500 hover:text-green-700 transition-colors"
                      >
                        <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Results per page:</span>
            <select
              value={reportsPerPage}
              onChange={handleReportsPerPageChange}
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
      {/* Hide Modal for Admin View */}
      {!isAdminView && showModal && (
        <div className="fixed inset-0 bg-stone-800 bg-opacity-75 flex justify-center items-center z-[9999] animate-fadeIn">
          <div className="bg-white rounded-xl w-11/12 lg:w-8/12 h-[80vh] overflow-hidden shadow-lg transform transition-all duration-300 flex flex-col">
            <div className="border-b border-stone-200 p-4 sm:p-5 flex justify-between items-center bg-gray-100">
              <h1 className="text-lg font-semibold text-stone-800">Upload Report</h1>
              <button onClick={toggleModal} className="text-stone-500 hover:text-red-600 text-2xl">
                &times;
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                  <input
                    type="text"
                    name="reportName"
                    value={formData.reportName}
                    onChange={handleInputChange}
                    placeholder="Enter Report Name"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report File</label>
                  <input
                    type="file"
                    name="reportFile"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
                <div className="col-span-1 lg:col-span-2 mt-4 sm:mt-6 flex gap-0.5">
                  <button
                    onClick={toggleModal}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;