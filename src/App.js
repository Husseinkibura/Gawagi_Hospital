// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ReceptionDashboard from "./components/Dashboard/ReceptionDashboard";
import DoctorDashboard from "./components/Dashboard/DoctorDashboard";
import LabDashboard from "./components/Dashboard/LabDashboard";
import PharmacyDashboard from "./components/Dashboard/PharmacyDashboard";
import CashierDashboard from "./components/Dashboard/CashierDashboard";
import Patients from "./components/Patients"; // Import the Patients component
import Doctors from "./components/Doctors/Doctors"; // Import the Doctors component
import Receptionists from "./components/Receptionists/Receptionists"; // Import the Doctors component
import Pharmacists from "./components/Pharmacists/Pharmacists"; // Import the Pharmacists component
import Cashiers from "./components/Cashiers/Cashiers"; // Import the Cashiers component
import Technicians from "./components/Technicians/Technicians";
import ManageUsers from "./components/ManageUsers/ManageUsers"; // Import the component

import AddPatientForm from "./components/AddPatientForm";


const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/patients" element={<Patients />} /> {/* Patients route */}
          <Route path="/admin/doctors" element={<Doctors />} /> {/* Doctors route */}
          <Route path="/admin/receptionists" element={<Receptionists />} /> {/* Receptionists route */}
          <Route path="/admin/pharmacists" element={<Pharmacists />} /> {/* Pharmacists route */}
          <Route path="/admin/technician" element={<Technicians />} /> {/* Pharmacists route */}
          <Route path="/admin/cashiers" element={<Cashiers />} /> {/* Cashiers route */}
          <Route path="/reception" element={<ReceptionDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/lab" element={<LabDashboard />} />
          <Route path="/pharmacy" element={<PharmacyDashboard />} />
          <Route path="/cashier" element={<CashierDashboard />} />
          <Route path="/add-patient" element={<AddPatientForm />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;