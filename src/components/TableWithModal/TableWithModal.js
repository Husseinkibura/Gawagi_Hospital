import React, { useState, useEffect } from "react";
import { Search, Plus, ChevronUp, ChevronDown, X } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const TableWithModal = ({ title, apiEndpoint, fields, formFields }) => {
  const [data, setData] = useState([
    {
      id: 1,
      doctor_name: "Dr. Hussein Kibura",
      username: "hussein",
      department: "Cardiology",
      specialization: "Heart Surgery",
      address: "Sinza",
      contact: "0673910791",
      last_login: "2025-02-10",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [formData, setFormData] = useState({});

  // Fetch data from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setData(response.data);
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
        toast.error(`Failed to fetch ${title}`);
      }
    };

    fetchData();
  }, [apiEndpoint, title]);

  const toggleModal = () => {
    setShowModal(!showModal);
    if (showModal) {
      setFormData({}); // Reset form data when closing
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(apiEndpoint, formData);
      setData([...data, response.data]); // Add new data to the list
      toggleModal(); // Close modal
      toast.success(`${title} added successfully!`); // Notify success
    } catch (error) {
      console.error(`Error adding ${title}:`, error.response?.data || error.message);
      toast.error(error.response?.data?.error || `Failed to add ${title}`);
    }
  };

  const filteredData = data.filter((item) =>
    item.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    return sortOrder === "asc" ? a[sortField].localeCompare(b[sortField]) : b[sortField].localeCompare(a[sortField]);
  });

  const handleSort = (field) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const handleView = (id) => {
    const item = data.find((item) => item.id === id);
    toast.info(`Viewing details for ${item.doctor_name}`);
  };

  const handleEdit = (id) => {
    const item = data.find((item) => item.id === id);
    setFormData({ ...item });
    toggleModal();
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    toast.error(`${title} deleted successfully!`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-5">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{title} List</h2>
        <button
          onClick={toggleModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center transition-all"
        >
          <Plus className="mr-2" />
          Add {title}
        </button>
      </div>

      <div className="mt-4 flex gap-4">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Search ${title}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {fields.map((field) => (
                <th
                  key={field}
                  onClick={() => handleSort(field.toLowerCase().replace(/\s/g, "_"))}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    {field}
                    {sortField === field.toLowerCase().replace(/\s/g, "_") && (
                      <span className="ml-2">
                        {sortOrder === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                {fields.map((field) => (
                  <td key={field} className="px-6 py-4 text-sm text-gray-900">
                    {item[field.toLowerCase().replace(/\s/g, "_")]}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm text-gray-900 flex gap-2">
                  <button
                    onClick={() => handleView(item.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 text-xs sm:text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 text-xs sm:text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-stone-800 bg-opacity-75 flex justify-center items-center z-[9999] animate-fadeIn">
          <div className="bg-white rounded-xl w-11/12 lg:w-8/12 h-[80vh] overflow-hidden shadow-lg transform transition-all duration-300 flex flex-col">
            <div className="border-b border-stone-200 p-5 flex justify-between items-center bg-gray-100">
              <h1 className="text-lg font-semibold text-stone-800">Add {title}</h1>
              <button
                onClick={toggleModal}
                className="text-stone-500 hover:text-red-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleInputChange}
                      >
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={`Enter ${field.label}`}
                        className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                ))}
              </form>
            </div>
            <div className="border-t border-stone-200 p-5 bg-gray-100 flex justify-start gap-0.5">
              <button
                onClick={toggleModal}
                className="px-3 py-0.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableWithModal;