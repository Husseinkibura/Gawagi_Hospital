import React, { useState, useEffect } from "react";
import { Search } from "react-bootstrap-icons";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Drug = () => {
  const [drugs, setDrugs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [drugsPerPage, setDrugsPerPage] = useState(5);
  const [formData, setFormData] = useState({
    name: "",
    brand_name: "",
    category: "",
    price: "",
    expiry_date: "",
    created_at: "",
    generic_name: "",
    description: "",
    dosage_form: "",
    stock_quantity: "",
    strength: "",
    manufacturer: "",
    side_effects: "",
    updated_at: "",
  });

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setFormData({
        name: "",
        brand_name: "",
        category: "",
        price: "",
        expiry_date: "",
        created_at: "",
        generic_name: "",
        description: "",
        dosage_form: "",
        stock_quantity: "",
        strength: "",
        manufacturer: "",
        side_effects: "",
        updated_at: "",
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
      !formData.name ||
      !formData.brand_name ||
      !formData.category ||
      !formData.price ||
      !formData.expiry_date ||
      !formData.stock_quantity
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      const url = formData.id
        ? `http://localhost:5000/api/drugs/${formData.id}`
        : "http://localhost:5000/api/drugs";

      const method = formData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        toggleModal();
        fetchDrugs();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save drug.");
      }
    } catch (error) {
      toast.error("An error occurred while saving the drug.");
      console.error("Error:", error);
    }
  };

  const fetchDrugs = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/drugs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDrugs(data);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch drugs.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching drugs.");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const filteredDrugs = drugs.filter((drug) =>
    drug.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDrugs = [...filteredDrugs].sort((a, b) => {
    if (!sortField) return 0;
    return sortOrder === "asc"
      ? a[sortField].localeCompare(b[sortField])
      : b[sortField].localeCompare(a[sortField]);
  });

  // Pagination Logic
  const indexOfLastDrug = currentPage * drugsPerPage;
  const indexOfFirstDrug = indexOfLastDrug - drugsPerPage;
  const currentDrugs = sortedDrugs.slice(indexOfFirstDrug, indexOfLastDrug);

  const totalPages = Math.ceil(sortedDrugs.length / drugsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDrugsPerPageChange = (e) => {
    setDrugsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const handleView = (id) => {
    const drug = drugs.find((drug) => drug.id === id);
    if (drug) {
      toast.info(`Viewing details for ${drug.name}`);
    } else {
      toast.error("Drug not found.");
    }
  };

  const handleEdit = (id) => {
    const drug = drugs.find((drug) => drug.id === id);
    if (drug) {
      setFormData({
        ...drug,
        expiry_date: drug.expiry_date.split("T")[0],
      });
      toggleModal();
    } else {
      toast.error("Drug not found.");
    }
  };

  const handleDelete = async (id) => {
    if (!id || isNaN(id)) {
      toast.error("Invalid Drug ID");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/drugs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Drug deleted successfully!");
        fetchDrugs();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete drug.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the drug.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md mt-5">
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          {/* Header with Search and Add Disease Button */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h1 className="text-xl font-bold whitespace-nowrap">Drug List</h1>
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
                  +Add Drug
                </button>
              </div>
            </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDrugs.map((drug, index) => (
                <tr key={drug.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drug.name}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drug.brand_name}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drug.category}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drug.stock_quantity}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drug.price}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drug.expiry_date}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drug.created_at}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                    {/* View Button */}
                    <button
                      onClick={() => handleView(drug.id)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(drug.id)}
                      className="text-green-500 hover:text-green-700 transition-colors"
                    >
                      <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(drug.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
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
              value={drugsPerPage}
              onChange={handleDrugsPerPageChange}
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

      {/* Modal for Adding/Editing Drug */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-800 bg-opacity-75 flex justify-center items-center z-[9999] animate-fadeIn">
          <div className="bg-white rounded-xl w-11/12 lg:w-8/12 h-[80vh] overflow-hidden shadow-lg transform transition-all duration-300 flex flex-col">
            <div className="border-b border-stone-200 p-4 sm:p-5 flex justify-between items-center bg-gray-100">
              <h1 className="text-lg font-semibold text-stone-800">
                {formData.id ? "Edit Drug" : "+Add Drug"}
              </h1>
              <button onClick={toggleModal} className="text-stone-500 hover:text-red-600 text-2xl">
                &times;
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Form fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drug Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter Drug Name"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    name="brand_name"
                    value={formData.brand_name}
                    onChange={handleInputChange}
                    placeholder="Enter Brand Name"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Enter Category"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                
          </div>          

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter Price"
              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleInputChange}
              placeholder="Enter Quantity"
              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleInputChange}
              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Created At */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
            <input
              type="datetime-local"
              name="created_at"
              value={formData.created_at}
              onChange={handleInputChange}
              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Generic Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
            <input
              type="text"
              name="generic_name"
              value={formData.generic_name}
              onChange={handleInputChange}
              placeholder="Enter Generic Name"
              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter Description"
              className="w-full h-24 sm:h-32 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Dosage Form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form</label>
            <input
              type="text"
              name="dosage_form"
              value={formData.dosage_form}
              onChange={handleInputChange}
              placeholder="Enter Dosage Form"
              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Strength */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
            <input
              type="text"
              name="strength"
              value={formData.strength}
              onChange={handleInputChange}
              placeholder="Enter Strength"
              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Manufacturer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              placeholder="Enter Manufacturer"
              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Side Effects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Side Effects</label>
            <textarea
              name="side_effects"
              value={formData.side_effects}
              onChange={handleInputChange}
              placeholder="Enter Side Effects"
              className="w-full h-24 sm:h-32 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Updated At */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
            <input
              type="datetime-local"
              name="updated_at"
              value={formData.updated_at}
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

export default Drug;