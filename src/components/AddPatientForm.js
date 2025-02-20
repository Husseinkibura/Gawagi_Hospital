import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Dummy components for missing imports
const ComponentCard = ({ children, title }) => (
  <div className="bg-white shadow-md rounded-md p-6 w-full">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const Label = ({ children }) => <label className="block text-sm font-medium text-gray-700">{children}</label>;

const Input = ({ type, ...props }) => (
  <input
    type={type}
    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors duration-300"
    {...props}
  />
);

const Select = ({ options, placeholder, value, onChange }) => (
  <select
    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors duration-300"
    value={value}
    onChange={onChange}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const EyeIcon = () => <span className="text-xl">👁️</span>;
const EyeCloseIcon = () => <span className="text-xl">🙈</span>;
const CalenderIcon = () => <span className="text-xl">📅</span>;

const AddPatientForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientID: "",
    name: "",
    username: "",
    password: "",
    address: "",
    contact: "",
    dob: "",
    gender: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    navigate("/patients"); // Redirect back to the patient list
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-full mx-auto"> {/* Expanded width to fit the background */}
        <ComponentCard title="Add New Patient">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5"> {/* Three columns for larger screens */}
              <div>
                <Label>Patient ID</Label>
                <Input type="text" name="patientID" value={formData.patientID} onChange={handleChange} />
              </div>
              <div>
                <Label>Patient Name</Label>
                <Input type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div>
                <Label>Username</Label>
                <Input type="text" name="username" value={formData.username} onChange={handleChange} />
              </div>
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                  </button>
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Input type="text" name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div>
                <Label>Contact</Label>
                <Input type="text" name="contact" value={formData.contact} onChange={handleChange} />
              </div>
              <div>
                <Label>Date of Birth (DOB)</Label>
                <div className="relative">
                  <Input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                    <CalenderIcon />
                  </span>
                </div>
              </div>
              <div>
                <Label>Gender</Label>
                <Select
                  name="gender"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  placeholder="Select Gender"
                  value={formData.gender}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
};

export default AddPatientForm;