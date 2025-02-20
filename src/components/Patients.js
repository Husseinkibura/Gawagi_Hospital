import React, { useState } from "react";
import { Search, Plus, ChevronUp, ChevronDown, X } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Patients = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      firstName: "Godfrey",
      lastName: "Massawe",
      gender: "Male",
      address: "Sinza",
      contact: "+255673910791",
      dateAdmitted: "18-02-2025",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    address: "",
    contact: "",
    dateAdmitted: "",
  });

  const toggleModal = () => {
    setShowModal(!showModal);
    if (showModal) {
      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        address: "",
        contact: "",
        dateAdmitted: "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPatient = {
      id: patients.length + 1,
      ...formData,
    };
    setPatients([...patients, newPatient]);
    toggleModal();
    toast.success("Patient added successfully!");
  };

  const filteredPatients = patients.filter((patient) =>
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (!sortField) return 0;
    return sortOrder === "asc" ? a[sortField].localeCompare(b[sortField]) : b[sortField].localeCompare(a[sortField]);
  });

  const handleSort = (field) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const handleView = (id) => {
    const patient = patients.find((patient) => patient.id === id);
    toast.info(`Viewing details for ${patient.firstName} ${patient.lastName}`);
  };

  const handleEdit = (id) => {
    const patient = patients.find((patient) => patient.id === id);
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      gender: patient.gender,
      address: patient.address,
      contact: patient.contact,
      dateAdmitted: patient.dateAdmitted,
    });
    toggleModal();
  };

  const handleDelete = (id) => {
    setPatients(patients.filter((patient) => patient.id !== id));
    toast.error("Patient deleted successfully!");
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen mt-5">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Patient List</h2>
        <button
          onClick={toggleModal}
          className="bg-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-600 flex items-center transition-all text-sm sm:text-base"
        >
          <Plus className="mr-1 sm:mr-2" />
          Add Patient
        </button>
      </div>

      <div className="mt-4 flex gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-4 sm:p-6 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {["Patient ID", "First Name", "Last Name", "Gender", "Address", "Contact", "Date", "Action"].map((field) => (
                <th
                  key={field}
                  onClick={() => handleSort(field.toLowerCase().replace(/\s/g, "_"))}
                  className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    {field}
                    {sortField === field.toLowerCase().replace(/\s/g, "_") && (
                      <span className="ml-1 sm:ml-2">
                        {sortOrder === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{patient.id}</td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{patient.firstName}</td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{patient.lastName}</td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{patient.gender}</td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{patient.address}</td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{patient.contact}</td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{patient.dateAdmitted}</td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 flex gap-2">
                  <button
                    onClick={() => handleView(patient.id)}
                    className="bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md hover:bg-green-600 text-xs sm:text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(patient.id)}
                    className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md hover:bg-blue-600 text-xs sm:text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md hover:bg-red-600 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-800 bg-opacity-75 flex justify-center items-center z-[9999] animate-fadeIn">
          <div className="bg-white rounded-xl w-11/12 lg:w-8/12 h-[80vh] overflow-hidden shadow-lg transform transition-all duration-300 flex flex-col">
            {/* Header */}
            <div className="border-b border-stone-200 p-4 sm:p-5 flex justify-between items-center bg-gray-100">
              <h1 className="text-lg font-semibold text-stone-800">Add Patient</h1>
              <button onClick={toggleModal} className="text-stone-500 hover:text-red-600 text-2xl">
                &times;
              </button>
            </div>

            {/* Form */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter First Name"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter Last Name"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
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

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Enter Contact Number"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Date Admitted */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Admitted</label>
                  <input
                    type="date"
                    name="dateAdmitted"
                    value={formData.dateAdmitted}
                    onChange={handleInputChange}
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

export default Patients;