import React, { useState } from "react";
import { Search} from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cashiers = () => {
  const [cashiers, setCashiers] = useState([]); // Initially empty, fetched from backend
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(5); // Default to 5 results per page
    const [formData, setFormData] = useState({
      fullname: "",
      username: "",
      password: "nk", // Default password
      email: "",
      profileImage: "",
      address: "",
      DateOfBirth: "",
      role: "Cashier", // Default role for Cashiers
    });
  
    // Fetch Cashiers from the backend
    const fetchCashiers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:5000/api/auth/cashiers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("Response status:", response.status); // Log the response status
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched cashiers:", data); // Log the fetched data
          setCashiers(data); // Update the cashiers state with the fetched data
        } else {
          const errorData = await response.json();
          console.error("Error fetching cashiers:", errorData); // Log the error details
          toast.error(errorData.message || "Failed to fetch cashiers.");
        }
      } catch (error) {
        console.error("Error:", error); // Log the error
        toast.error("An error occurred while fetching cashiers.");
      }
    };
  
    // Fetch cashiers on component mount
    React.useEffect(() => {
      fetchCashiers();
    }, []);
  
    const toggleModal = () => {
      setShowModal(!showModal);
      if (!showModal) {
        setFormData({
          fullname: "",
          username: "",
          password: "",
          email: "",
          profileImage: "",
          address: "",
          DateOfBirth: "",
          role: "",
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
      if (
        !formData.fullname ||
        !formData.username ||
        !formData.email ||
        !formData.address ||
        !formData.DateOfBirth
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:5000/api/auth/add-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const data = await response.json();
          toast.success(data.message);
          toggleModal();
          fetchCashiers(); // Refresh the cashiers list
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to add cashier.");
        }
      } catch (error) {
        toast.error("An error occurred while adding the cashier.");
        console.error("Error:", error);
      }
    };
  
    const filteredCashiers = cashiers.filter((cashier) =>
      cashier.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const sortedCashiers = [...filteredCashiers].sort((a, b) => {
      if (!sortField) return 0;
      return sortOrder === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    });
  
    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = sortedCashiers.slice(indexOfFirstUser, indexOfLastUser);
  
    const totalPages = Math.ceil(sortedCashiers.length / usersPerPage);
  
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
  
    const handleView = (id) => {
      const cashier = cashiers.find((cashier) => cashiers.id === id);
      toast.info(`Viewing details for ${cashiers.fullname}`);
    };
  
    const handleEdit = (id) => {
      const cashier = cashiers.find((cashier) => cashier.id === id);
      setFormData({
        fullname: cashier.fullname,
        username: cashier.username,
        password: cashier.password,
        email: cashier.email,
        profileImage: cashier.profileImage,
        address: cashier.address,
        DateOfBirth: cashier.DateOfBirth,
        role: cashier.role,
      });
      toggleModal();
    };
  
    const handleDelete = async (id) => {
      try {
        const response = await fetch(`/api/auth/delete-user/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (response.ok) {
          toast.success("Cashier deleted successfully!");
          fetchCashiers(); // Refresh the cashier list
        } else {
          const errorData = await response.json();
          toast.error(errorData.message);
        }
      } catch (error) {
        toast.error("An error occurred while deleting the cashier.");
      }
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-5">
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          {/* Header with Search, Filter, and Add User Button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Cashier List</h1>
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
                +Add Cashier
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DOB
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
                  {currentUsers.map((cashier, index) => (
                    <tr key={cashier.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {indexOfFirstUser + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cashier.fullname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cashier.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cashier.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cashier.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cashier.DateOfBirth}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cashier.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
      {/* View Button */}
      <button
        onClick={() => handleView(cashier.id)}
        className="flex items-center bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"
          />
        </svg>
        View
      </button>
    
      {/* Edit Button */}
      <button
        onClick={() => handleEdit(cashier.id)}
        className="flex items-center bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        Edit
      </button>
    
      {/* Delete Button */}
      <button
        onClick={() => handleDelete(cashier.id)}
        className="flex items-center bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2"
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
        Delete
      </button>
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
    
          {/* Modal for Adding/Editing cashier */}
          {showModal && (
            <div className="fixed inset-0 bg-stone-800 bg-opacity-75 flex justify-center items-center z-[9999] animate-fadeIn">
              <div className="bg-white rounded-xl w-11/12 lg:w-8/12 h-[80vh] overflow-hidden shadow-lg transform transition-all duration-300 flex flex-col">
                <div className="border-b border-stone-200 p-4 sm:p-5 flex justify-between items-center bg-gray-100">
                  <h1 className="text-lg font-semibold text-stone-800">+Add Cashier</h1>
                  <button onClick={toggleModal} className="text-stone-500 hover:text-red-600 text-2xl">
                    &times;
                  </button>
                </div>
    
                <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        placeholder="Enter Full Name"
                        className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
    
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter Email"
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

export default Cashiers;