import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Emergency = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null); // To store the selected case for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility

  // Fetch emergency cases
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/emergency-cases");
        if (!response.ok) {
          throw new Error("Failed to fetch cases");
        }
        const data = await response.json();
        setCases(data);
      } catch (error) {
        console.error("Error fetching cases:", error);
        toast.error("Failed to fetch cases. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Handle accepting a case
  const handleAccept = async (caseId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/emergency-cases/${caseId}/accept`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to accept case");
      }
      // Update the case status in the UI
      setCases((prevCases) =>
        prevCases.map((c) =>
          c.CaseId === caseId ? { ...c, Status: "Accepted" } : c
        )
      );
      toast.success("Case accepted successfully!");
    } catch (error) {
      console.error("Error accepting case:", error);
      toast.error("Failed to accept case. Please try again.");
    }
  };

  // Handle rejecting a case
  const handleReject = async (caseId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/emergency-cases/${caseId}/reject`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to reject case");
      }
      // Update the case status in the UI
      setCases((prevCases) =>
        prevCases.map((c) =>
          c.CaseId === caseId ? { ...c, Status: "Rejected" } : c
        )
      );
      toast.success("Case rejected successfully!");
    } catch (error) {
      console.error("Error rejecting case:", error);
      toast.error("Failed to reject case. Please try again.");
    }
  };

  // Open modal with case details
  const openModal = (caseItem) => {
    setSelectedCase(caseItem);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 mt-5">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4 sm:mb-6 text-center">
        Emergency Cases
      </h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading cases...</p>
      ) : cases.length === 0 ? (
        <p className="text-center text-gray-600">No emergency cases found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cases.map((caseItem) => (
                <tr key={caseItem.CaseId} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {caseItem.CaseId}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {caseItem.patientName}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {caseItem.age}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {caseItem.mobile}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                    {caseItem.CaseDescription.length > 50
                      ? `${caseItem.CaseDescription.substring(0, 50)}...`
                      : caseItem.CaseDescription}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-semibold ${
                        caseItem.UrgencyLevel === "low"
                          ? "text-green-600"
                          : caseItem.UrgencyLevel === "medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {caseItem.UrgencyLevel}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-semibold ${
                        caseItem.Status === "Pending"
                          ? "text-yellow-600"
                          : caseItem.Status === "Accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {caseItem.Status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => openModal(caseItem)}
                        className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        View
                      </button>
                      {caseItem.Status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleAccept(caseItem.CaseId)}
                            className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(caseItem.CaseId)}
                            className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Full Description */}
      {isModalOpen && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold text-blue-800 mb-4">
              Case Description
            </h2>
            <p className="text-gray-700">{selectedCase.CaseDescription}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toastr Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Emergency;