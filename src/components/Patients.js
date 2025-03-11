import React, { useState, useEffect } from "react";
import { Search} from "react-bootstrap-icons";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format, parseISO } from "date-fns";

const formatDateTime = (dateString) => {
  const date = parseISO(dateString); // Parse the ISO string
  return format(date, "do MMM yyyy HH:mm"); // Format as "21st Feb 2025 04:06"
};

// Function to calculate age
const calculateAge = (dob) => {
  if (!dob) return 0; // Ensure it returns an integer, defaulting to 0 if invalid
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const Patient = () => {
  const [patients, setPatients] = useState([]); // Initially empty, fetched from backend
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5); // Default to 5 results per page
  const [formData, setFormData] = useState({
    PatientId: "",
    fullname: "",
    username: "",
    password: "",
    mobile: "",
    profileImage: "",
    address: "",
    age: "",
    DateOfBirth: "",
    role: "Patient", // Default role for Patient
  });

// Fetch patients from the backend
const fetchPatients = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("No token found. Please log in.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/patients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response status:", response.status); // Log the response status
    if (response.ok) {
      const data = await response.json();
      console.log("Fetched patients:", data); // Log the fetched data
      setPatients(data); // Update the patients state with the fetched data
    } else {
      const errorData = await response.json();
      console.error("Error fetching patients:", errorData); // Log the error details
      toast.error(errorData.message || "Failed to fetch patients.");
    }
  } catch (error) {
    console.error("Error:", error); // Log the error
    toast.error("An error occurred while fetching patients.");
  }
};

// Fetch patients on component mount
useEffect(() => {
  fetchPatients();
}, []);

// Fetch patients on component mount
useEffect(() => {
  fetchPatients();
}, []);


  // const fetchPatients = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/patients");
  //     if (response.ok) {
  //       const data = await response.json();
  //       setPatients(data); // Update the patients state with the fetched data
  //     } else {
  //       const errorData = await response.json();
  //       toast.error(errorData.message || "Failed to fetch patients.");
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred while fetching patients.");
  //   }
  // };

  // Fetch patients on component mount
  // useEffect(() => {
  //   fetchPatients();
  // }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setFormData({
        PatientId: "",
        fullname: "",
        username: "",
        password: "",
        mobile: "",
        profileImage: "",
        address: "",
        age: "",
        DateOfBirth: "",
        role: "Patient",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate required fields
    const { fullname, username, password, mobile, DateOfBirth } = formData;
    if (!fullname || !username || !password || !mobile || !DateOfBirth) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    // Calculate age from DateOfBirth and update form data
    const age = calculateAge(DateOfBirth);
    const updatedFormData = { ...formData, age };
  
    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedFormData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add patient.");
      }
  
      const data = await response.json();
      toast.success("Patient added successfully! 🎉"); // Toastr message
      toggleModal();
      fetchPatients(); // Refresh the patient list
    } catch (error) {
      toast.error(error.message || "An error occurred while adding the patient.");
      console.error("Error:", error);
    }
  };  




  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validate required fields
  //   if (
  //     !formData.fullname ||
  //     !formData.username ||
  //     !formData.password ||
  //     !formData.mobile ||
  //     !formData.DateOfBirth
  //   ) {
  //     toast.error("Please fill out all required fields.");
  //     return;
  //   }

  //   // Calculate age from DateOfBirth
  //   const age = calculateAge(formData.DateOfBirth);

  //   // Prepare the form data, including the calculated age
  //   const updatedFormData = {
  //     ...formData,
  //     age: age, // Add the calculated age
  //   };

  //   try {
  //     const method = formData.PatientId ? "PUT" : "POST";
  //     const url = formData.PatientId
  //       ? `http://localhost:5000/api/patients/${formData.PatientId}`
  //       : "http://localhost:5000/api/patients";

  //     const response = await fetch(url, {
  //       method,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(updatedFormData),
  //     });

  //     if (response.ok) {
  //       toast.success(`Patient ${formData.PatientId ? "updated" : "added"} successfully!`);
  //       fetchPatients(); // Refresh the patient list
  //       toggleModal(); // Close the modal
  //     } else {
  //       const errorData = await response.json();
  //       toast.error(errorData.message || "Failed to process the request.");
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred while processing the request.");
  //   }
  // };

  const handleEdit = async (PatientId) => {
    const patient = patients.find((p) => p.PatientId === PatientId);
    if (patient) {
      setFormData(patient);
      setShowModal(true);
    }
  };

  const handleDelete = async (PatientId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${PatientId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Patient deleted successfully!");
        fetchPatients(); // Refresh the patient list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete the patient.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the patient.");
    }
  };

  const handleView = (PatientId) => {
    const patient = patients.find((p) => p.PatientId === PatientId);
    if (patient) {
      toast.info(`Viewing details for ${patient.fullname}`);
      // You can expand this to show more details in a modal or another page
    }
  };

  // Filter, sort, and pagination logic remains the same
  const filteredPatients = patients.filter((patient) =>
    patient.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (!sortField) return 0;
    return sortOrder === "asc"
      ? a[sortField].localeCompare(b[sortField])
      : b[sortField].localeCompare(a[sortField]);
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedPatients.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(sortedPatients.length / usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when changing results per page
  };

  const handleSort = (field) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-5">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {/* Header with Search, Filter, and Add User Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Patient List</h1>
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
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Banned">Banned</option>
          </select>

          {/* Add User Button */}
          <button
            onClick={toggleModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Register Patient
          </button>
        </div>
      </div>

      {/* Table with Light Gray Background */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
          <thead>
  <tr className="border-b">
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      S.No.
    </th>
    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
      Patient ID
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Patient Name
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Username
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Mobile
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Address
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Age
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Created At
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Role
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Actions
    </th>
  </tr>
</thead>
<tbody>
  {currentUsers.map((patient, index) => (
    <tr key={patient.PatientId} className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {indexOfFirstUser + index + 1}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {patient.PatientId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {patient.fullname}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {patient.username}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {patient.mobile}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {patient.address}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {patient.age}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDateTime(patient.createdAt)} {/* Use the formatted datetime */}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {patient.role}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
  {/* View Button with Tooltip */}
  <div className="relative group">
    <button
      onClick={() => handleView(patient.PatientId)}
      className="text-blue-500 hover:text-blue-700 transition-colors"
    >
      <FaEye className="w-4 h-4 sm:w-5 sm:h-5" /> {/* Smaller on small screens */}
    </button>
    <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      View
    </span>
  </div>

  {/* Edit Button with Tooltip */}
  <div className="relative group">
    <button
      onClick={() => handleEdit(patient.PatientId)}
      className="text-green-500 hover:text-green-700 transition-colors"
    >
      <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" /> {/* Smaller on small screens */}
    </button>
    <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      Edit
    </span>
  </div>

  {/* Delete Button with Tooltip */}
  <div className="relative group">
    <button
      onClick={() => handleDelete(patient.PatientId)}
      className="text-red-500 hover:text-red-700 transition-colors"
    >
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5" // Smaller on small screens
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
    <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      Delete
    </span>
  </div>
</td>
    </tr>
  ))}
</tbody>
          </table>
        </div>

        {/* Pagination and Results Per Page */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          {/* Results Per Page Dropdown */}
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

          {/* Pagination */}
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

      {/* Modal for Adding/Editing Patients */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-800 bg-opacity-75 flex justify-center items-center z-[9999] animate-fadeIn">
          <div className="bg-white rounded-xl w-11/12 lg:w-8/12 h-[80vh] overflow-hidden shadow-lg transform transition-all duration-300 flex flex-col">
            <div className="border-b border-stone-200 p-4 sm:p-5 flex justify-between items-center bg-gray-100">
              <h1 className="text-lg font-semibold text-stone-800">Register New Patient</h1>
              <button onClick={toggleModal} className="text-stone-500 hover:text-red-600 text-2xl">
                &times;
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Patient ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                  <input
                    type="text"
                    name="PatientId"
                    value={formData.PatientId}
                    onChange={handleInputChange}
                    placeholder="Enter Patient ID"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-ba"
                  />
                </div>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    placeholder="Enter Full Name"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-ba"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter Username"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter Password"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter Mobile"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter Address"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="DateOfBirth"
                    value={formData.DateOfBirth}
                    onChange={handleInputChange}
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="Enter Role"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Submit Button */}
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

export default Patient;