import React, { useState, useEffect } from "react";
import { Search } from "react-bootstrap-icons";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DiseaseManagement = () => {
  const [diseases, setDiseases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [diseasesPerPage, setDiseasesPerPage] = useState(5);
  const [formData, setFormData] = useState({
    disease_name: "",
    test_type: "",
    price: "",
    drug_name: "",
    drug_price: "",
    quantity: "",
  });

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setFormData({
        disease_name: "",
        test_type: "",
        price: "",
        drug_name: "",
        drug_price: "",
        quantity: "",
      });
      setSelectedDisease(null); // Reset selected disease when modal is closed
    }
  };

  const toggleViewModal = () => {
    setShowViewModal(!showViewModal);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { disease_name, test_type, price, drug_name, drug_price, quantity } = formData;
    if (!disease_name || !test_type || !price || !drug_name || !drug_price || !quantity) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const url = selectedDisease
        ? `http://localhost:5000/api/diseases/${selectedDisease.id}`
        : "http://localhost:5000/api/diseases";
      const method = selectedDisease ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(selectedDisease ? "Disease updated successfully!" : "Disease added successfully!");
        toggleModal();
        fetchDiseases(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to process the request.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while processing the request.");
    }
  };

  const fetchDiseases = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/diseases");
      if (response.ok) {
        const data = await response.json();
        setDiseases(data);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch diseases.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while fetching diseases.");
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const filteredDiseases = diseases.filter((disease) =>
    disease.disease_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDiseases = [...filteredDiseases].sort((a, b) => {
    if (!sortField) return 0;
    return sortOrder === "asc"
      ? a[sortField].localeCompare(b[sortField])
      : b[sortField].localeCompare(a[sortField]);
  });

  // Pagination Logic
  const indexOfLastDisease = currentPage * diseasesPerPage;
  const indexOfFirstDisease = indexOfLastDisease - diseasesPerPage;
  const currentDiseases = sortedDiseases.slice(indexOfFirstDisease, indexOfLastDisease);

  const totalPages = Math.ceil(sortedDiseases.length / diseasesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDiseasesPerPageChange = (e) => {
    setDiseasesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const handleView = (disease) => {
    setSelectedDisease(disease);
    toggleViewModal();
  };

  const handleEdit = (disease) => {
    setSelectedDisease(disease);
    setFormData({
      disease_name: disease.disease_name,
      test_type: disease.test_type,
      price: disease.price,
      drug_name: disease.drug_name,
      drug_price: disease.drug_price,
      quantity: disease.quantity,
    });
    toggleModal();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/diseases/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Disease deleted successfully!");
        fetchDiseases(); // Refresh list after deletion
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the disease.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-5">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {/* Header with Search and Add Disease Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Disease Management</h1>
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

          {/* Add Disease Button */}
          <button
            onClick={() => {
              setSelectedDisease(null);
              toggleModal();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            +Add Disease
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDiseases.map((disease, index) => (
                <tr key={disease.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{disease.disease_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{disease.test_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{disease.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{disease.drug_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{disease.drug_price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{disease.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                    {/* View Button */}
                    <button
                      onClick={() => handleView(disease)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(disease)}
                      className="text-green-500 hover:text-green-700 transition-colors"
                    >
                      <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(disease.id)}
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
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Results per page:</span>
            <select
              value={diseasesPerPage}
              onChange={handleDiseasesPerPageChange}
              className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
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

      {/* Modal for Adding/Editing Disease */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-800 bg-opacity-75 flex justify-center items-center z-[9999] animate-fadeIn">
          <div className="bg-white rounded-xl w-11/12 lg:w-8/12 h-[80vh] overflow-hidden shadow-lg transform transition-all duration-300 flex flex-col">
            <div className="border-b border-stone-200 p-4 sm:p-5 flex justify-between items-center bg-gray-100">
              <h1 className="text-lg font-semibold text-stone-800">
                {selectedDisease ? "Edit Disease" : "+Add Disease"}
              </h1>
              <button onClick={toggleModal} className="text-stone-500 hover:text-red-600 text-2xl">
                &times;
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Disease Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disease Name</label>
                  <input
                    type="text"
                    name="disease_name"
                    value={formData.disease_name}
                    onChange={handleInputChange}
                    placeholder="Enter Disease Name"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Test Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                  <input
                    type="text"
                    name="test_type"
                    value={formData.test_type}
                    onChange={handleInputChange}
                    placeholder="Enter Test Type"
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

                {/* Drug Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drug Name</label>
                  <input
                    type="text"
                    name="drug_name"
                    value={formData.drug_name}
                    onChange={handleInputChange}
                    placeholder="Enter Drug Name"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Drug Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drug Price</label>
                  <input
                    type="number"
                    name="drug_price"
                    value={formData.drug_price}
                    onChange={handleInputChange}
                    placeholder="Enter Drug Price"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter Quantity"
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
            {selectedDisease ? "Update" : "Submit"}
        </button>
    </div>
</form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Viewing Disease Details */}
      {showViewModal && selectedDisease && (
        <div className="fixed inset-0 bg-stone-800 bg-opacity-75 flex justify-center items-center z-[9999] animate-fadeIn">
          <div className="bg-white rounded-xl w-11/12 lg:w-8/12 h-[80vh] overflow-hidden shadow-lg transform transition-all duration-300 flex flex-col">
            <div className="border-b border-stone-200 p-4 sm:p-5 flex justify-between items-center bg-gray-100">
              <h1 className="text-lg font-semibold text-stone-800">Disease Details</h1>
              <button onClick={toggleViewModal} className="text-stone-500 hover:text-red-600 text-2xl">
                &times;
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Disease Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disease Name</label>
                  <p className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md flex items-center text-sm sm:text-base">
                    {selectedDisease.disease_name}
                  </p>
                </div>

                {/* Test Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                  <p className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md flex items-center text-sm sm:text-base">
                    {selectedDisease.test_type}
                  </p>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <p className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md flex items-center text-sm sm:text-base">
                    {selectedDisease.price}
                  </p>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <p className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md flex items-center text-sm sm:text-base">
                    {new Date(selectedDisease.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseManagement;












// import React, { useState, useEffect } from "react";
// import { Search } from "react-bootstrap-icons";
// import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const TestType = () => {
//   const [testtypes, setTestTypes] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [filter, setFilter] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortField, setSortField] = useState(null);
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [testtypesPerPage, setTesttypesPerPage] = useState(5);
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     category: "",
//     disease: "",
//     price: "",
//   });

//   const toggleModal = () => {
//     setShowModal(!showModal);
//     if (!showModal) {
//       setFormData({
//         name: "",
//         description: "",
//         category: "",
//         disease: "",
//         price: "",
//       });
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, description, category, disease, price } = formData;
//     if (!name || !description || !category || !disease || !price) {
//       toast.error("Please fill in all required fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("No token found. Please log in.");
//         return;
//       }

//       const response = await fetch("http://localhost:5000/api/testtypes", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success(data.message);
//         toggleModal();
//       } else {
//         toast.error(data.message || "Failed to add test type.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("An error occurred while adding the test type.");
//     }
//   };

//   const fetchTestTypes = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("No token found. Please log in.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/testtypes", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setTestTypes(data);
//       } else {
//         const errorData = await response.json();
//         toast.error(errorData.message || "Failed to fetch test types.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("An error occurred while fetching test types.");
//     }
//   };

//   useEffect(() => {
//     fetchTestTypes();
//   }, []);

//   const filteredTestTypes = testtypes.filter((testtype) =>
//     testtype.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const sortedTestTypes = [...filteredTestTypes].sort((a, b) => {
//     if (!sortField) return 0;
//     return sortOrder === "asc"
//       ? a[sortField].localeCompare(b[sortField])
//       : b[sortField].localeCompare(a[sortField]);
//   });

//   // Corrected Pagination Logic
//   const indexOfLastTestType = currentPage * testtypesPerPage;
//   const indexOfFirstTestType = indexOfLastTestType - testtypesPerPage;
//   const currentTestTypes = sortedTestTypes.slice(indexOfFirstTestType, indexOfLastTestType);

//   const totalPages = Math.ceil(sortedTestTypes.length / testtypesPerPage);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleTestTypesPerPageChange = (e) => {
//     setTesttypesPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handleSort = (field) => {
//     setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
//     setSortField(field);
//   };

//   const handleView = (id) => {
//     const testtype = testtypes.find((testtype) => testtype.id === id);
//     toast.info(`Viewing details for ${testtype.name}`);
//   };

//   const handleEdit = (id) => {
//     const testtype = testtypes.find((testtype) => testtype.id === id);
//     setFormData({
//       name: testtype.name,
//       category: testtype.category,
//       disease: testtype.disease,
//       price: testtype.price,
//     });
//     toggleModal();
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`/api/testtypes/delete-testtype/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (response.ok) {
//         toast.success("Test deleted successfully!");
//         fetchTestTypes(); // Refresh list after deletion
//       } else {
//         const errorData = await response.json();
//         toast.error(errorData.message);
//       }
//     } catch (error) {
//       toast.error("An error occurred while deleting the test.");
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-5">
//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
//       {/* Header with Search, Filter, and Add Drug Button */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-xl font-bold">Test List</h1>
//         <div className="flex items-center space-x-4">
//           {/* Search Bar */}
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
//               <Search className="w-5 h-5 text-gray-400" />
//             </span>
//           </div>

//           {/* Filter Dropdown */}
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="All">All</option>
//             <option value="Approved">Approved</option>
//             <option value="Pending">Pending</option>
//             <option value="Banned">Banned</option>
//           </select>

//           {/* Add Drug Button */}
//           <button
//             onClick={toggleModal}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             +Add Test
//           </button>
//         </div>
//       </div>

//       {/* Table with Light Gray Background */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>   
//               <tr className="border-b">
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   S.No.
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Description
//                 </th> */}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Category
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Disease
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Price
//                 </th>
//                 {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Expiry Date
//                 </th> */}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Created At
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentTestTypes.map((testtype, index) => (
//                 <tr key={testtype.id} className="hover:bg-gray-50 transition-colors duration-200">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testtype.name}</td>
//                   {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testtype.description}</td> */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testtype.category}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testtype.disease}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testtype.price}</td> 
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testtype.created_at}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
//                                       {/* View Button with Tooltip */}
//                                       <div className="relative group">
//                                         <button
//                                           onClick={() => handleView(testtype.testtypeId)}
//                                           className="text-blue-500 hover:text-blue-700 transition-colors"
//                                         >
//                                           <FaEye className="w-4 h-4 sm:w-5 sm:h-5" /> {/* Smaller on small screens */}
//                                         </button>
//                                         <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                                           View
//                                         </span>
//                                       </div>
                                    
//                                       {/* Edit Button with Tooltip */}
//                                       <div className="relative group">
//                                         <button
//                                           onClick={() => handleEdit(testtype.testtypeId)}
//                                           className="text-green-500 hover:text-green-700 transition-colors"
//                                         >
//                                           <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" /> {/* Smaller on small screens */}
//                                         </button>
//                                         <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                                           Edit
//                                         </span>
//                                       </div>
                                    
//                                       {/* Delete Button with Tooltip */}
//                                       <div className="relative group">
//                                         <button
//                                           onClick={() => handleDelete(testtype.testtypeId)}
//                                           className="text-red-500 hover:text-red-700 transition-colors"
//                                         >
//                                           <svg
//                                             className="w-4 h-4 sm:w-5 sm:h-5" // Smaller on small screens
//                                             fill="none"
//                                             stroke="currentColor"
//                                             viewBox="0 0 24 24"
//                                           >
//                                             <path
//                                               strokeLinecap="round"
//                                               strokeLinejoin="round"
//                                               strokeWidth={2}
//                                               d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                                             />
//                                           </svg>
//                                         </button>
//                                         <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                                           Delete
//                                         </span>
//                                       </div>
//                                     </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination and Results Per Page */}
//         <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
//           {/* Results Per Page Dropdown */}
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-gray-500">Results per page:</span>
//             <select
//               value={testtypesPerPage}
//               onChange={handleTestTypesPerPageChange}
//               className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value={1}>1</option>
//               <option value={2}>2</option>
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//             </select>
//           </div>

//           {/* Pagination */}
//           <div className="flex space-x-2">
//             <button
//               onClick={() => handlePageChange(1)}
//               disabled={currentPage === 1}
//               className={`px-3 py-1 rounded-lg ${
//                 currentPage === 1
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               1
//             </button>
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`px-3 py-1 rounded-lg ${
//                 currentPage === 1
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               &lt;
//             </button>
//             <span className="px-3 py-1 bg-white text-gray-700 rounded-lg">
//               {currentPage}
//             </span>
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className={`px-3 py-1 rounded-lg ${
//                 currentPage === totalPages
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               &gt;
//             </button>
//             <button
//               onClick={() => handlePageChange(totalPages)}
//               disabled={currentPage === totalPages}
//               className={`px-3 py-1 rounded-lg ${
//                 currentPage === totalPages
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               {totalPages}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal for Adding/Editing Drug */}
// {showModal && (
//   <div className="fixed inset-0 bg-stone-800 bg-opacity-75 flex justify-center items-center z-[9999] animate-fadeIn">
//     <div className="bg-white rounded-xl w-11/12 lg:w-8/12 h-[80vh] overflow-hidden shadow-lg transform transition-all duration-300 flex flex-col">
//       <div className="border-b border-stone-200 p-4 sm:p-5 flex justify-between items-center bg-gray-100">
//         <h1 className="text-lg font-semibold text-stone-800">+Add Test Type</h1>
//         <button onClick={toggleModal} className="text-stone-500 hover:text-red-600 text-2xl">
//           &times;
//         </button>
//       </div>

//       <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="Enter Test Name"
//               className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               placeholder="Enter Description"
//               className="w-full h-24 sm:h-32 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//             <input
//               type="text"
//               name="category"
//               value={formData.category}
//               onChange={handleInputChange}
//               placeholder="Enter Category"
//               className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//             />
//           </div>

//            {/* Disease */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Disease</label>
//             <input
//               type="text"
//               name="disease"
//               value={formData.disease}
//               onChange={handleInputChange}
//               placeholder="Enter Disease"
//               className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//             />
//           </div>           

//           {/* Price */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleInputChange}
//               placeholder="Enter Price"
//               className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//             />
//           </div>

//           {/* Submit Button */}
//           <div className="col-span-1 lg:col-span-2 mt-4 sm:mt-6 flex gap-0.5">
//             <button
//               onClick={toggleModal}
//               className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//          );
// };

// export default TestType;