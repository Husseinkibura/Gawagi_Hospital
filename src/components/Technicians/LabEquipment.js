import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Science,
  Build, // Maintenance
  ReportProblem, // Broken
  Edit,
  Delete,
  Notifications,
  Done, // Available
  DirectionsRun, // In Use
} from "@mui/icons-material";

const LabEquipment = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    status: "Available",
  });
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEquipmentId, setEditingEquipmentId] = useState(null);

  // Fetch equipment from the backend
  const fetchEquipment = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/equipment");
      if (!response.ok) {
        throw new Error("Failed to fetch equipment");
      }
      const data = await response.json();
      setEquipmentList(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add or update equipment
  const handleAddOrUpdateEquipment = async () => {
    if (!newEquipment.name.trim()) {
      toast.error("Please enter equipment name.");
      return;
    }

    try {
      const url = isEditing
        ? `http://localhost:5000/api/equipment/${editingEquipmentId}`
        : "http://localhost:5000/api/equipment";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEquipment),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "add"} equipment`);
      }

      const data = await response.json();
      toast.success(`Equipment ${isEditing ? "updated" : "added"} successfully!`);
      setNewEquipment({ name: "", status: "Available" });
      setShowAddEquipmentModal(false);
      setIsEditing(false);
      setEditingEquipmentId(null);
      fetchEquipment(); // Refresh the equipment list
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete equipment
  const handleDeleteEquipment = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/equipment/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete equipment");
      }

      toast.success("Equipment deleted successfully!");
      fetchEquipment(); // Refresh the equipment list
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Notify Admin about equipment issues
  const handleNotifyAdmin = async (equipmentId, equipmentName, status) => {
    const message = `Equipment "${equipmentName}" requires attention. Status: ${status}.`;

    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipment_id: equipmentId,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }

      toast.success("Admin notified successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Open edit modal
  const handleEditEquipment = (equipment) => {
    setNewEquipment({
      name: equipment.name,
      status: equipment.status,
    });
    setIsEditing(true);
    setEditingEquipmentId(equipment.id);
    setShowAddEquipmentModal(true);
  };

  // Fetch equipment on component mount
  useEffect(() => {
    fetchEquipment();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-5">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      {/* Header and Add Equipment Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Laboratory Equipment</h1>
        <button
          onClick={() => {
            setShowAddEquipmentModal(true);
            setIsEditing(false);
            setNewEquipment({ name: "", status: "Available" });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Equipment
        </button>
      </div>

      {/* Status Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {["Available", "In Use", "Maintenance", "Broken"].map((status) => (
          <div
            key={status}
            className={`p-4 rounded-lg ${
              status === "Available"
                ? "bg-green-100"
                : status === "In Use"
                ? "bg-yellow-100"
                : status === "Maintenance"
                ? "bg-blue-100"
                : "bg-red-100"
            }`}
          >
            <h3 className="text-sm font-semibold">{status}</h3>
            <p className="text-2xl font-bold">
              {equipmentList.filter((eq) => eq.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {/* Equipment Table */}
      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipmentList.map((equipment) => (
                <tr key={equipment.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                    <Science className="text-gray-500" /> {/* Icon beside name */}
                    {equipment.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        equipment.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : equipment.status === "In Use"
                          ? "bg-yellow-100 text-yellow-800"
                          : equipment.status === "Maintenance"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {equipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-3">
                    {/* Action buttons with tooltips */}
                    <button
                      onClick={() => handleEditEquipment(equipment)}
                      className="text-blue-500 hover:text-blue-700 relative group"
                      title="Edit"
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => handleDeleteEquipment(equipment.id)}
                      className="text-red-500 hover:text-red-700 relative group"
                      title="Delete"
                    >
                      <Delete />
                    </button>
                    <button
                      onClick={() => handleNotifyAdmin(equipment.id, equipment.name)}
                      className="text-purple-500 hover:text-purple-700 relative group"
                      title="Notify Admin"
                    >
                      <Notifications />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Equipment Modal */}
      {showAddEquipmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/3 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {isEditing ? "Edit Equipment" : "Add New Equipment"}
              </h2>
              <button
                onClick={() => setShowAddEquipmentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment Name
                </label>
                <input
                  type="text"
                  value={newEquipment.name}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, name: e.target.value })
                  }
                  placeholder="Enter equipment name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newEquipment.status}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="In Use">In Use</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Broken">Broken</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddEquipmentModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrUpdateEquipment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {isEditing ? "Update Equipment" : "Add Equipment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabEquipment;