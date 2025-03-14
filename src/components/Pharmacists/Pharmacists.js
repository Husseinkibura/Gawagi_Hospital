import React, { useState } from "react";
import { Search} from "react-bootstrap-icons";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Pharmacists = () => {
  const [pharmacists, setPharmacists] = useState([]); // Initially empty, fetched from backend
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
      role: "Pharmacist", // Default role for pharmacists
      age: "", // Add age field
      Contract: null, // Add Contract field
      Salary: "", // Add Salary field
    });

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, Contract: file });
      }
    };
  
    // Fetch pharmacists from the backend
    const fetchPharmacists = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:5000/api/auth/pharmacists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("Response status:", response.status); // Log the response status
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched pharmacists:", data); // Log the fetched data
          setPharmacists(data); // Update the pharmacists state with the fetched data
        } else {
          const errorData = await response.json();
          console.error("Error fetching pharmacists:", errorData); // Log the error details
          toast.error(errorData.message || "Failed to fetch pharmacists.");
        }
      } catch (error) {
        console.error("Error:", error); // Log the error
        toast.error("An error occurred while fetching pharmacists.");
      }
    };
  
    // Fetch pharmacists on component mount
    React.useEffect(() => {
      fetchPharmacists();
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
          role: "Pharmacist",
          age: "", // Reset age field
          Contract: null, // Reset Contract field
          Salary: "", // Reset Salary field
        });
      }
    };
  

    const handleInputChange = (e) => {
      const { name, value } = e.target;
    
      if (name === "DateOfBirth") {
        // Calculate age from DateOfBirth
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
    
        // Adjust age if the birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
    
        setFormData({ ...formData, DateOfBirth: value, age: age.toString() });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };
  
     const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formDataToSend = new FormData();
        formDataToSend.append("fullname", formData.fullname);
        formDataToSend.append("username", formData.username);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("profileImage", formData.profileImage);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("DateOfBirth", formData.DateOfBirth);
        formDataToSend.append("role", formData.role);
        formDataToSend.append("age", formData.age);
        formDataToSend.append("Salary", parseFloat(formData.Salary));
        if (formData.Contract) {
          formDataToSend.append("Contract", formData.Contract);
        }
      
        const url = formData.id
          ? `http://localhost:5000/api/auth/update-user/${formData.id}`
          : "http://localhost:5000/api/auth/add-user";
      
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
            fetchPharmacists(); // Refresh the list of pharmacist
          } else {
            const errorData = await response.json();
            toast.error(errorData.message || "Failed to update/add pharmacist.");
          }
        } catch (error) {
          toast.error("An error occurred while updating/adding the pharmacist.");
        }
      };
  
    const filteredPharmacists = pharmacists.filter((pharmacist) =>
      pharmacist.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const sortedPharmacists = [...filteredPharmacists].sort((a, b) => {
      if (!sortField) return 0;
      return sortOrder === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    });

    const handleDelete = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/delete-user/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
    
        if (response.ok) {
          toast.success("Pharmacist deleted successfully!");
          fetchPharmacists(); // Refresh the list of pharmacists
        } else {
          const errorData = await response.json();
          toast.error(errorData.message);
        }
      } catch (error) {
        toast.error("An error occurred while deleting the pharmacist.");
      }
    };

    const handleEdit = (id) => {
      const pharmacist = pharmacists.find((pharmacist) => pharmacist.id === id);
      setFormData({
        id: pharmacist.id,
        fullname: pharmacist.fullname,
        username: pharmacist.username,
        password: pharmacist.password,
        email: pharmacist.email,
        profileImage: pharmacist.profileImage,
        address: pharmacist.address,
        DateOfBirth: pharmacist.DateOfBirth,
        role: pharmacist.role,
        age: pharmacist.age,
        Contract: pharmacist.Contract,
        Salary: pharmacist.Salary,
      });
      toggleModal();
    };
  
    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = sortedPharmacists.slice(indexOfFirstUser, indexOfLastUser);
  
    const totalPages = Math.ceil(sortedPharmacists.length / usersPerPage);
  
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
      const pharmacist = pharmacists.find((pharmacist) => pharmacist.id === id);
      toast.info(`Viewing details for ${pharmacists.fullname}`);
    };


    return (
      <div className="p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md mt-5">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {/* Header with Search and Add Disease Button */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-xl font-bold whitespace-nowrap">Pharmacist List</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <span className="absolute inset-y-0 left-0 pl-2 flex items-center">
                <Search className="w-4 h-4 text-gray-400" />
              </span>
            </div>
            <button
              onClick={toggleModal}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm whitespace-nowrap"
            >
              +Add Pharmacist
            </button>
          </div>
        </div>

  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((pharmacist, index) => (
            <tr key={pharmacist.id} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indexOfFirstUser + index + 1}</td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pharmacist.fullname}</td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pharmacist.username}</td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pharmacist.email}</td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pharmacist.address}</td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pharmacist.Salary}</td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pharmacist.Contract && (
                  <a
                    href={`http://localhost:5000/uploads/${pharmacist.Contract}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Contract
                  </a>
                )}
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pharmacist.age}</td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pharmacist.role}</td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                {/* Edit Button */}
                <div className="relative group">
                  <button
                    onClick={() => handleEdit(pharmacist.id)}
                    className="text-green-500 hover:text-green-700 transition-colors"
                  >
                    <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Edit
                  </span>
                </div>
                {/* Delete Button */}
                <div className="relative group">
                  <button
                    onClick={() => handleDelete(pharmacist.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
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
    {/* Pagination */}
    <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 border-t border-gray-200">
      <div className="flex items-center space-x-2 mb-4 sm:mb-0">
        <span className="text-sm text-gray-500">Results per page:</span>
        <select
          value={usersPerPage}
          onChange={handleUsersPerPageChange}
          className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>
      <div className="flex space-x-2">
        {/* Pagination buttons */}
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

                {showModal && (
                    <div className="fixed inset-0 bg-stone-800 bg-opacity-75 flex justify-center items-center z-[9999] animate-fadeIn">
                      <div className="bg-white rounded-xl w-11/12 lg:w-8/12 h-[80vh] overflow-hidden shadow-lg transform transition-all duration-300 flex flex-col">
                        <div className="border-b border-stone-200 p-4 sm:p-5 flex justify-between items-center bg-gray-100">
                          <h1 className="text-lg font-semibold text-stone-800">+Add Pharmacist</h1>
                          <button onClick={toggleModal} className="text-stone-500 hover:text-red-600 text-2xl">
                            &times;
                          </button>
                        </div>
                        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
                          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              readOnly // Make the age field read-only
              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-gray-100"
            />
          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                            <input
                              type="number"
                              name="Salary"
                              value={formData.Salary}
                              onChange={handleInputChange}
                              placeholder="Enter Salary"
                              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contract</label>
                            <input
                              type="file"
                              name="Contract"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            />
                          </div>
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

export default Pharmacists;