import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LocalHospital,
  PersonAdd,
  LocalPharmacy,
  PointOfSale,
  Science,
} from "@mui/icons-material";

const AllReports = () => {
  const navigate = useNavigate();

  // Static reports data
  const reports = [
    { role: "Doctor", count: 5, icon: <LocalHospital className="text-green-500" /> },
    { role: "Receptionist", count: 2, icon: <PersonAdd className="text-blue-500" /> },
    { role: "Pharmacist", count: 2, icon: <LocalPharmacy className="text-pink-500" /> },
    { role: "Cashier", count: 2, icon: <PointOfSale className="text-red-500" /> },
    { role: "Lab Technician", count: 2, icon: <Science className="text-yellow-500" /> },
    { role: "RCHClinic", count: 2, icon: <LocalPharmacy className="text-purple-500" /> },
  ];

  // Handle navigation to the respective table
  const handleNavigation = (role) => {
    switch (role) {
      case "Doctor":
        navigate("/doctors");
        break;
      case "Receptionist":
        navigate("/receptionists");
        break;
      case "Pharmacist":
        navigate("/pharmacists");
        break;
      case "Cashier":
        navigate("/cashiers");
        break;
      case "Lab Technician":
        navigate("/lab-technicians");
        break;
      case "RCHClinic":
        navigate("/rchclinic/reports");
        break;
      default:
        toast.info(`No route defined for ${role}`);
        break;
    }
  };

  // Report background colors
  const reportColors = {
    Doctor: "bg-green-100 hover:bg-green-200",
    Receptionist: "bg-blue-100 hover:bg-blue-200",
    Pharmacist: "bg-pink-100 hover:bg-pink-200",
    Cashier: "bg-red-100 hover:bg-red-200",
    "Lab Technician": "bg-yellow-100 hover:bg-yellow-200",
    RCHClinic: "bg-purple-100 hover:bg-purple-200",
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Reports Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {reports.map((report, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg text-center cursor-pointer transition-all duration-300 ${reportColors[report.role]}`}
              onClick={() => handleNavigation(report.role)}
            >
              <div className="flex justify-center text-4xl mb-4">
                {report.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">{report.role}</h3>
                <p className="text-2xl font-bold text-gray-900">{report.count}</p>
                <p className="text-sm text-gray-500 mt-2">Total Records</p>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default AllReports;