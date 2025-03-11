import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmergencyCases = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "", // Add patientName to the form data
    caseDescription: "",
    urgencyLevel: "Low",
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fetch patient details when Patient ID is entered
  const fetchPatientDetails = async (patientId) => {
    if (!patientId) return; // Skip if patientId is empty
    try {
      const response = await fetch(
        `http://localhost:5000/api/patients/${patientId}`
      );
      if (!response.ok) {
        throw new Error("Patient not found");
      }
      const data = await response.json();
      // Update the patientName field with the fetched data
      setFormData((prevData) => ({
        ...prevData,
        patientName: data.fullname || data.name, // Use the appropriate field from the API
      }));
    } catch (error) {
      console.error("Error fetching patient details:", error);
      toast.error("Patient not found. Please check the Patient ID.");
      setFormData((prevData) => ({
        ...prevData,
        patientName: "", // Clear patientName if patient is not found
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/emergency-cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to submit case");
      }
      // Show success toast
      toast.success("Emergency case submitted successfully!");
      // Reset form data
      setFormData({
        patientId: "",
        patientName: "",
        caseDescription: "",
        urgencyLevel: "Low",
      });
    } catch (error) {
      console.error("Error submitting case:", error);
      // Show error toast
      toast.error("Failed to submit case. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-xl font-bold text-blue-800 mb-6 text-center">
          Submit Emergency Case
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient ID Field */}
          <div>
            <label
              htmlFor="patientId"
              className="block text-sm font-medium text-gray-700"
            >
              Patient ID
            </label>
            <input
              type="text"
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={(e) => {
                handleChange(e);
                fetchPatientDetails(e.target.value); // Fetch patient details when Patient ID changes
              }}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Patient Name Field */}
          <div>
            <label
              htmlFor="patientName"
              className="block text-sm font-medium text-gray-700"
            >
              Patient Name
            </label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              readOnly // Make the field read-only
            />
          </div>

          {/* Case Description Field */}
          <div>
            <label
              htmlFor="caseDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Case Description
            </label>
            <textarea
              id="caseDescription"
              name="caseDescription"
              value={formData.caseDescription}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Urgency Level Field */}
          <div>
            <label
              htmlFor="urgencyLevel"
              className="block text-sm font-medium text-gray-700"
            >
              Urgency Level
            </label>
            <select
              id="urgencyLevel"
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Case"}
            </button>
          </div>
        </form>
      </div>

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

export default EmergencyCases;