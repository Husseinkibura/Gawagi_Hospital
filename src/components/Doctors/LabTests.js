import React, { useState, useEffect } from "react";
import { Search } from "react-bootstrap-icons";
import { CheckCircle as CompletedIcon, HourglassEmpty as PendingIcon, Visibility as ViewIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2pdf from "html2pdf.js";

// TestResults Component
const TestResults = ({ PatientId }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/tests/results/${PatientId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          console.error("Failed to fetch test results");
        }
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };

    fetchResults();
  }, [PatientId]);

  return (
    <div>
      {results.map((result, index) => (
        <div key={index}>{result}</div>
      ))}
    </div>
  );
};

// LabTests Component
const LabTests = () => {
  const [tests, setTests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [results, setResults] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [formData, setFormData] = useState({
    PatientId: "",
    patientName: "",
    symptoms: [],
    expectedDisease: "",
    checkFor: "",
    assignedBy: "Dr. Kibura",
    otherSymptoms: "",
    status: "",
    results: "",
    createdAt: new Date().toISOString().slice(0, 16),
  });

  const fetchTests = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/tests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const transformedData = data.map((test) => ({
          id: test.id,
          PatientId: test.patient_id,
          patientName: test.patient_name,
          symptoms: Array.isArray(test.symptoms) ? test.symptoms : test.symptoms ? test.symptoms.split(", ") : [],
          expectedDisease: test.expected_disease,
          checkFor: test.check_for,
          assignedBy: test.assigned_by,
          status: test.status,
          results: test.results,
          createdAt: test.created_at,
          otherSymptoms: test.other_symptoms || "",
        }));
        setTests(transformedData);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch tests.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching tests.");
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

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

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setFormData({
        PatientId: "",
        patientName: "",
        symptoms: [],
        expectedDisease: "",
        checkFor: "",
        assignedBy: "Dr. Kibura",
        otherSymptoms: "",
        status: "",
        results: "",
        createdAt: new Date().toISOString().slice(0, 16),
      });
    }
  };

  const toggleViewModal = (test) => {
    setSelectedTest(test);
    setShowViewModal(!showViewModal);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePatientIdChange = async (e) => {
    const PatientId = e.target.value;
    setFormData({ ...formData, PatientId });

    if (PatientId) {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/${PatientId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const patient = await response.json();
          setFormData((prevData) => ({
            ...prevData,
            patientName: patient.fullname,
          }));
        } else {
          setFormData((prevData) => ({
            ...prevData,
            patientName: "",
          }));
          toast.error("Patient not found.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching patient data.");
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        patientName: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          patient_id: formData.PatientId,
          patient_name: formData.patientName,
          symptoms: formData.symptoms,
          expected_disease: selectedDiseases.join(", "), // Send selected diseases
          check_for: selectedDiseases.join(", "), // Send selected diseases
          assigned_by: formData.assignedBy,
          other_symptoms: formData.otherSymptoms,
          created_at: formData.createdAt || new Date().toISOString(),
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        toggleModal();
        fetchTests();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add test.");
      }
    } catch (error) {
      toast.error("An error occurred while adding the test.");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await fetch("http://localhost:5000/api/auth/tests", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       body: JSON.stringify({
  //         patient_id: formData.PatientId,
  //         patient_name: formData.patientName,
  //         symptoms: formData.symptoms,
  //         expected_disease: formData.expectedDisease,
  //         check_for: formData.checkFor,
  //         assigned_by: formData.assignedBy,
  //         other_symptoms: formData.otherSymptoms,
  //         created_at: formData.createdAt || new Date().toISOString(),
  //       }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       toast.success(data.message);
  //       toggleModal();
  //       fetchTests();
  //     } else {
  //       const errorData = await response.json();
  //       toast.error(errorData.message || "Failed to add test.");
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred while adding the test.");
  //   }
  // };

  const handleDeleteTest = async (testId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this test?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/auth/tests/${testId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        fetchTests();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete test.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the test.");
    }
  };

  const handleUpdateResults = async (testId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/tests/${testId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          results: results,
          status: "Completed",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        fetchTests();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update test results.");
      }
    } catch (error) {
      toast.error("An error occurred while updating test results.");
    }
  };

  const filteredTests = tests.filter((test) => {
    if (!test || !test.patientName) return false;
    return test.patientName.toLowerCase().includes(searchTerm.toLowerCase());
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

  const downloadReport = () => {
    const element = document.getElementById("report-content");
    const options = {
      margin: 10,
      filename: `Patient_Report_${selectedTest.PatientId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-5">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Test Lists Overview and Results</h1>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Add Test
          </button>
        </div>
      </div>

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
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
  </tr>
</thead>
<tbody>
  {currentUsers.map((test, index) => (
    <tr key={test.id} className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1 + (currentPage - 1) * usersPerPage}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.PatientId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.patientName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(test.createdAt).toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.assignedBy}</td>
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
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
        <button
          onClick={() => toggleViewModal(test)}
          className="bg-blue-500 text-white px-2 py-1 rounded-md flex items-center gap-1 hover:bg-blue-700 transition duration-300 text-xs"
        >
          <ViewIcon className="text-white" style={{ fontSize: "14px" }} /> View
        </button>
        <button
          onClick={() => handleDeleteTest(test.id)}
          className="bg-red-500 text-white px-2 py-1 rounded-md flex items-center gap-1 hover:bg-red-700 transition duration-300 text-xs"
        >
          <DeleteIcon className="text-white" style={{ fontSize: "14px" }} /> Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>

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

      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
    <div className="bg-white rounded-lg w-11/12 md:w-8/12 lg:w-6/12 max-h-[90vh] overflow-y-auto shadow-xl">
      {/* Modal Header */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50 rounded-t-lg">
        <h1 className="text-lg font-semibold text-gray-800">Add Test</h1>
        <button
          onClick={toggleModal}
          className="text-gray-500 hover:text-red-600 text-2xl"
        >
          &times;
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
            <input
              type="text"
              name="PatientId"
              value={formData.PatientId}
              onChange={handlePatientIdChange}
              placeholder="Enter Patient ID"
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Patient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              readOnly
              placeholder="Patient Name"
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
            />
          </div>

          {/* Assigned By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned By</label>
            <input
              type="text"
              name="assignedBy"
              value={formData.assignedBy}
              onChange={handleInputChange}
              placeholder="Assigned By"
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
  <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient Symptoms</label>
  <div className="w-full p-4 border border-stone-200 rounded-lg bg-graylight-50">
    <div className="flex flex-wrap gap-4">
      {[
        "Fever", "Cough", "Headache", "Fatigue", "Nausea", "Vomiting", "Diarrhea", "Shortness of Breath", "Chest Pain", "Dizziness", "Abdominal Pain", "Sore Throat", "Runny Nose", "Muscle Pain", "Joint Pain", "Loss of Taste", "Loss of Smell", "Skin Rash", "Blurred Vision"
      ].map((symptom) => (
        <label key={symptom} className="flex items-center gap-2">
          <input
            type="checkbox"
            name={symptom}
            checked={formData.symptoms.includes(symptom)}
            onChange={(e) => {
              const { checked } = e.target;
              setFormData((prevData) => ({
                ...prevData,
                symptoms: checked
                  ? [...prevData.symptoms, symptom]
                  : prevData.symptoms.filter((s) => s !== symptom),
              }));
            }}
            className="w-4 h-4"
          />
          {symptom}
        </label>
      ))}
    </div>
  </div>
</div>

<div className="col-span-1 md:col-span-2 lg:col-span-3">
  <label className="block text-sm font-medium text-gray-700 mb-1">Other Symptoms</label>
  <input
    type="text"
    name="otherSymptoms"
    value={formData.otherSymptoms}
    onChange={handleInputChange}
    placeholder="Enter other symptoms (comma separated)"
    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Diseases</label>
  <div className="flex gap-2">
    <select
      value={formData.expectedDisease}
      onChange={(e) => setFormData({ ...formData, expectedDisease: e.target.value })}
      className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
    >
      <option value="">Select a disease</option>
      {diseases.map((disease) => (
        <option key={disease.id} value={disease.disease_name}>
          {disease.disease_name}
        </option>
      ))}
    </select>
    <button
      type="button"
      onClick={() => {
        if (formData.expectedDisease && !selectedDiseases.includes(formData.expectedDisease)) {
          setSelectedDiseases([...selectedDiseases, formData.expectedDisease]);
          setFormData((prevData) => ({
            ...prevData,
            expectedDisease: "", // Clear the dropdown after adding
            checkFor: [...selectedDiseases, formData.expectedDisease].join(", "), // Update Check For
          }));
        }
      }}
      className="px-1 py-0.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm"
    >
      +Add
    </button>
  </div>
  <div className="mt-2">
    <h3 className="text-sm font-medium text-gray-700">Selected Diseases:</h3>
    <ul className="list-disc list-inside">
      {selectedDiseases.map((disease, index) => (
        <li key={index} className="text-sm text-gray-600">
          {disease}
        </li>
      ))}
    </ul>
  </div>
</div>

          {/* Check For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check For</label>
            <input
              type="text"
              name="checkFor"
              value={selectedDiseases.join(", ")}
              readOnly
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
            />
          </div>

          {/* Created At */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
            <input
              type="datetime-local"
              name="createdAt"
              value={formData.createdAt}
              onChange={handleInputChange}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3">
            <button
              onClick={toggleModal}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

{showViewModal && selectedTest && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
    <div className="bg-white rounded-lg w-11/12 md:w-8/12 lg:w-6/12 max-h-[90vh] overflow-y-auto shadow-xl">
      {/* Modal Header */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50 rounded-t-lg">
        <h1 className="text-lg font-semibold text-gray-800">Test Summary</h1>
        <button
          onClick={() => setShowViewModal(false)}
          className="text-gray-500 hover:text-red-600 text-2xl"
        >
          &times;
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Patient Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Patient Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient ID</h3>
                <p className="text-base text-gray-900">{selectedTest.PatientId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient Name</h3>
                <p className="text-base text-gray-900">{selectedTest.patientName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assigned By</h3>
                <p className="text-base text-gray-900">{selectedTest.assignedBy}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="text-base text-gray-900">
                  {new Date(selectedTest.createdAt).toLocaleString()}
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
                  {selectedTest.symptoms.map((symptom, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {symptom}
                    </li>
                  ))}
                  {selectedTest.otherSymptoms && (
                    <li className="text-sm text-gray-600">
                      {selectedTest.otherSymptoms}
                    </li>
                  )}
                </ul>
              </div>

              {/* Expected Diseases */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Expected Diseases</h3>
                <ul className="list-disc list-inside">
                  {selectedTest.expectedDisease.split(", ").map((disease, index) => (
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
                  {selectedTest.checkFor.split(", ").map((disease, index) => (
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

              {/* Results (if completed) */}
              
              {selectedTest.status === "Completed" && (
  <div>
    <h3 className="text-sm font-medium text-gray-500">Results</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            try {
              // Attempt to parse the results field as JSON
              const parsedResults = JSON.parse(selectedTest.results);
              if (Array.isArray(parsedResults)) {
                // If parsedResults is an array, map over it
                return parsedResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{result.disease_name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{result.test_type}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{result.result}</td>
                  </tr>
                ));
              }
            } catch (error) {
              // If parsing fails, treat results as a plain string
              return (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center text-sm text-gray-500">
                    {selectedTest.results}
                  </td>
                </tr>
              );
            }
            // Fallback if results is empty or invalid
            return (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center text-sm text-gray-500">
                  No results available
                </td>
              </tr>
            );
          })()}
        </tbody>
      </table>
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default LabTests;