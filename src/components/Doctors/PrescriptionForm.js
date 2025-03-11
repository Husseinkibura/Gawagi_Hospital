import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrescriptionForm = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    patientAge: "",
    patientContact: "",
    diseases: [],
    results: [],
    testTypes: [],
    medicationName: "",
    dosage: "",
    frequency: "",
    duration: "",
    quantity: "",
    testPrice: "",
    medicationPrice: "",
  });

  const [prescriptions, setPrescriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diseases, setDiseases] = useState([]); // State to store diseases data

  // Fetch diseases data on component mount
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/diseases");
        setDiseases(response.data);
      } catch (error) {
        console.error("Error fetching diseases:", error);
        toast.error("Failed to fetch diseases data.");
      }
    };
    fetchDiseases();
  }, []);

  // Fetch prescriptions on component mount
  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/prescriptions");
        setPrescriptions(response.data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        toast.error("Failed to fetch prescriptions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Automatically fill test price when test type is selected
    if (name === "testTypes") {
      const selectedTest = diseases.find((disease) => disease.test_type === value);
      if (selectedTest) {
        setFormData((prevData) => ({
          ...prevData,
          testPrice: selectedTest.price,
        }));
      }
    }

    // Automatically fill medication price when medication name is entered
    if (name === "medicationName") {
      const selectedMedication = diseases.find((disease) => disease.drug_name === value);
      if (selectedMedication) {
        setFormData((prevData) => ({
          ...prevData,
          medicationPrice: selectedMedication.drug_price,
        }));
      }
    }
  };

  // Handle patient ID blur to fetch patient details
  const handlePatientIdBlur = async () => {
    if (formData.patientId) {
      try {
        // Fetch patient details
        const patientResponse = await axios.get(`http://localhost:5000/api/patients/${formData.patientId}`);
        const patient = patientResponse.data;
        setFormData((prevData) => ({
          ...prevData,
          patientName: patient.fullname,
          patientAge: patient.age,
          patientContact: patient.mobile,
        }));

        // Fetch test results
        const testResultsResponse = await axios.get(`http://localhost:5000/api/prescriptions/test-results/${formData.patientId}`);
        const testResults = testResultsResponse.data;
        setFormData((prevData) => ({
          ...prevData,
          results: testResults,
        }));

        // Fetch test types
        const testTypesResponse = await axios.get(`http://localhost:5000/api/prescriptions/test-types/${formData.patientId}`);
        const testTypes = testTypesResponse.data;
        setFormData((prevData) => ({
          ...prevData,
          testTypes: testTypes,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Patient, test results, or test types not found. Please check the Patient ID.");
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.patientId ||
      !formData.medicationName ||
      !formData.dosage ||
      !formData.frequency ||
      !formData.duration ||
      !formData.quantity ||
      !formData.testPrice ||
      !formData.medicationPrice
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/prescriptions", formData);
      if (response.data.prescriptionId) {
        setPrescriptions([...prescriptions, formData]);
        setFormData({
          patientId: "",
          patientName: "",
          patientAge: "",
          patientContact: "",
          diseases: [],
          results: [],
          testTypes: [],
          medicationName: "",
          dosage: "",
          frequency: "",
          duration: "",
          quantity: "",
          testPrice: "",
          medicationPrice: "",
        });
        toast.success("Prescription submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting prescription:", error);
      toast.error(error.response?.data?.message || "Failed to submit prescription. Please try again.");
    }
  };

  // Handle viewing prescription details
  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  // Handle updating payment status
  const handleUpdatePaymentStatus = async (prescriptionId, paymentStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/prescriptions/${prescriptionId}/payment-status`, {
        paymentStatus,
      });
      if (response.status === 200) {
        toast.success("Payment status updated successfully!");
        const updatedPrescriptions = prescriptions.map((prescription) =>
          prescription.prescriptionId === prescriptionId
            ? { ...prescription, payment_status: paymentStatus, status: paymentStatus === 'Paid' ? 'Completed' : 'Pending' }
            : prescription
        );
        setPrescriptions(updatedPrescriptions);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6 mt-5">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-blue-600">Prescription Form</h1>
          <p className="text-gray-600">Enter patient details and prescription information</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Patient Details Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                  Patient ID
                </label>
                <input
                  type="number"
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  onBlur={handlePatientIdBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Patient ID"
                  required
                />
              </div>
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Patient Name"
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700">
                  Patient Age
                </label>
                <input
                  type="number"
                  id="patientAge"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Patient Age"
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="patientContact" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="patientContact"
                  name="patientContact"
                  value={formData.patientContact}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contact Number"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Test Details Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="results" className="block text-sm font-medium text-gray-700">
                  Results
                </label>
                <input
                  type="text"
                  id="results"
                  name="results"
                  value={formData.results.join(", ")}
                  onChange={(e) => setFormData({ ...formData, results: e.target.value.split(", ") })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter results (comma separated)"
                />
              </div>
              <div>
                <label htmlFor="testTypes" className="block text-sm font-medium text-gray-700">
                  Test Types
                </label>
                <select
                  id="testTypes"
                  name="testTypes"
                  value={formData.testTypes}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Test Type</option>
                  {diseases.map((disease) => (
                    <option key={disease.id} value={disease.test_type}>
                      {disease.test_type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="testPrice" className="block text-sm font-medium text-gray-700">
                  Test Price
                </label>
                <input
                  type="number"
                  id="testPrice"
                  name="testPrice"
                  value={formData.testPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Test Price"
                  required
                />
              </div>
              <div>
                <label htmlFor="medicationName" className="block text-sm font-medium text-gray-700">
                  Medication Name
                </label>
                <select
                  id="medicationName"
                  name="medicationName"
                  value={formData.medicationName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Medication</option>
                  {diseases.map((disease) => (
                    <option key={disease.id} value={disease.drug_name}>
                      {disease.drug_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="medicationPrice" className="block text-sm font-medium text-gray-700">
                  Medication Price
                </label>
                <input
                  type="number"
                  id="medicationPrice"
                  name="medicationPrice"
                  value={formData.medicationPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Medication Price"
                  required
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter quantity"
                  required
                />
              </div>
              <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
                  Dosage
                </label>
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter dosage"
                  required
                />
              </div>
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                  Frequency
                </label>
                <input
                  type="text"
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter frequency"
                  required
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter duration (e.g., 7 days)"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Prescription
            </button>
          </div>
        </form>

        {/* Submitted Prescriptions Table */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Submitted Prescriptions</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">Patient ID</th>
                    <th className="px-4 py-2 border">Patient Name</th>
                    <th className="px-4 py-2 border">Age</th>
                    <th className="px-4 py-2 border">Contact Number</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{prescription.patientId}</td>
                      <td className="px-4 py-2 border">{prescription.patientName}</td>
                      <td className="px-4 py-2 border">{prescription.patientAge}</td>
                      <td className="px-4 py-2 border">{prescription.patientContact}</td>
                      <td className="px-4 py-2 border">{prescription.status}</td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => handleViewDetails(prescription)}
                          className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Viewing Prescription Details */}
        {showModal && selectedPrescription && (
  <div className="fixed inset-0 bg-stone-800 bg-opacity-75 flex justify-center items-center z-[9999] animate-fadeIn">
    <div className="bg-white rounded-xl w-11/12 lg:w-8/12 h-[80vh] overflow-hidden shadow-lg transform transition-all duration-300 flex flex-col">
      {/* Modal Header */}
      <div className="border-b border-stone-200 p-4 sm:p-5 flex justify-between items-center bg-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Patient Report</h2>
        <button
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-red-600 text-2xl"
        >
          &times;
        </button>
      </div>

      {/* Modal Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Patient Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Patient Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600"><strong>Name:</strong> {selectedPrescription.patientName}</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>Age:</strong> {selectedPrescription.patientAge}</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>Contact:</strong> {selectedPrescription.patientContact}</p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Results</h3>
          <ul className="space-y-2">
            {Array.isArray(selectedPrescription.results) ? (
              selectedPrescription.results.map((result, index) => (
                <li key={index} className="bg-white p-3 rounded-md shadow-xs">
                  <span className="text-gray-600">{index + 1}. {result}</span>
                </li>
              ))
            ) : (
              <li className="bg-white p-3 rounded-md shadow-xs">
                <span className="text-gray-600">No results available.</span>
              </li>
            )}
          </ul>
        </div>

        {/* Test Types Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Test Types</h3>
          <ul className="space-y-2">
            {Array.isArray(selectedPrescription.testTypes) ? (
              selectedPrescription.testTypes.map((testType, index) => (
                <li key={index} className="bg-white p-3 rounded-md shadow-xs">
                  <span className="text-gray-600">{index + 1}. {testType}</span>
                </li>
              ))
            ) : (
              <li className="bg-white p-3 rounded-md shadow-xs">
                <span className="text-gray-600">No test types available.</span>
              </li>
            )}
          </ul>
        </div>

        {/* Medication Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Medication Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600"><strong>Medication:</strong> {selectedPrescription.medicationName}</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>Dosage:</strong> {selectedPrescription.dosage}</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>Frequency:</strong> {selectedPrescription.frequency}</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>Duration:</strong> {selectedPrescription.duration}</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>Quantity:</strong> {selectedPrescription.quantity}</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>Test Price:</strong> ${selectedPrescription.testPrice}</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>Medication Price:</strong> ${selectedPrescription.medicationPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default PrescriptionForm;