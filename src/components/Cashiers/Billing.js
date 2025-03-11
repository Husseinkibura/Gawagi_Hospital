import React, { useState } from "react";

const Billing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState("");
  const [diseases, setDiseases] = useState([]);

  // List of diseases for the dropdown
  const diseaseOptions = [
    "Malaria",
    "Typhoid",
    "Tuberculosis",
    "Dengue",
    "Asthma",
    "Diabetes",
    "UTI",
    "HIV/AIDS",
  ];

  // Function to handle adding a selected disease
  const handleAddDisease = () => {
    if (selectedDisease && !diseases.includes(selectedDisease)) {
      setDiseases([...diseases, selectedDisease]);
      setSelectedDisease(""); // Reset selection after adding
    }
  };

  // Function to handle form submission
  const handleSubmit = () => {
    console.log("Submitted Diseases:", diseases);
    setIsModalOpen(false); // Close modal after submission
  };

  return (
    <div className="p-4">
      {/* Button to open modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-5"
      >
        Add Diseases
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Select Diseases</h2>

            {/* Dropdown for selecting diseases */}
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Select a disease</option>
              {diseaseOptions.map((disease, index) => (
                <option key={index} value={disease}>
                  {disease}
                </option>
              ))}
            </select>

            {/* Button to add selected disease */}
            <button
              onClick={handleAddDisease}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Add Disease
            </button>

            {/* Button to submit all diseases */}
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>

            {/* Display added diseases */}
            <div className="mt-4">
              <h3 className="font-bold">Selected Diseases:</h3>
              <ul>
                {diseases.map((disease, index) => (
                  <li key={index} className="ml-4 list-disc">
                    {disease}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Display submitted diseases in a table */}
      {diseases.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Submitted Diseases</h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Disease</th>
              </tr>
            </thead>
            <tbody>
              {diseases.map((disease, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border">{disease}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Billing;