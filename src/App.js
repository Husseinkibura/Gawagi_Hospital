import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import Emergency from "./components/Emergency/Emergency";
import ReceptionDashboard from "./components/Dashboard/ReceptionDashboard";
import DoctorDashboard from "./components/Dashboard/DoctorDashboard";
import PatientDashboard from "./components/Dashboard/PatientDashboard";
import LabDashboard from "./components/Dashboard/LabDashboard";
import PharmacyDashboard from "./components/Dashboard/PharmacyDashboard";
import CashierDashboard from "./components/Dashboard/CashierDashboard";
import Patients from "./components/Patients/Patients";
import Doctors from "./components/Doctors/Doctors";
import DoctorPatient from "./components/Doctors/Patient";
import Bills from "./components/Doctors/Bills";
import DoctorAppointments from "./components/Doctors/DoctorAppointments";
import EmergencyCases from "./components/Doctors/EmergencyCases";
import MedicalRecords from "./components/Doctors/MedicalRecords";
import LabTests from "./components/Doctors/LabTests";
import PrescriptionForm from "./components/Doctors/PrescriptionForm";
import Receptionists from "./components/Receptionists/Receptionists";
import AppointmentList from "./components/Receptionists/AppointmentList";
import Patient from "./components/Receptionists/Patient";
import Pharmacists from "./components/Pharmacists/Pharmacists";
import Prescipt from "./components/Pharmacists/Prescipt";
import Medicine from "./components/Pharmacists/Medicine";
import PhysicalCount from "./components/Pharmacists/PhysicalCount";
import Cashiers from "./components/Cashiers/Cashiers";
import Billing from "./components/Cashiers/Billing";
import Technicians from "./components/Technicians/Technicians";
import TestResult from "./components/Technicians/TestResults";
import Drug from "./components/Drug/Drug";
import Tests from "./components/Tests/Tests";
import LabEquipment from "./components/Technicians/LabEquipment";
import AddPatientForm from "./components/AddPatientForm";
import PatientAppointment from "./components/Patients/Appointment";
import RchClinicDashboard from "./components/Dashboard/RchClinicDashboard";
import RchClinics from "./components/RchClinics/RchClinics";
import Reports from "./components/RchClinics/Reports";
import AllReports from "./components/Reports/AllReport";
import PaymentDetails from "./components/Cashiers/PaymentDetails";
import PatientFeedback from "./components/Patients/PatientFeedback";
import AllFeedback from "./components/Feedback/AllFeedback";
import PatientRecords from "./components/Patients/PatientRecord";
import Website from "./components/Auth/Website";
import BarcodeScannerSidebar from "./components/Pharmacists/BarcodeScannerSidebar";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Unauthorized from "./components/Common/Unauthorized";

const App = () => {
  return (
    <Router>
      {/* ToastContainer for displaying notifications globally */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        {/* Public Routes (without Layout) */}
        <Route path="/" element={<Website />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (with Layout) */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                {/* Admin Routes */}
                <Route element={<ProtectedRoute roles={["Admin"]} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/patients" element={<Patients />} />
                  <Route path="/admin/doctors" element={<Doctors />} />
                  <Route path="/admin/receptionists" element={<Receptionists />} />
                  <Route path="/admin/pharmacists" element={<Pharmacists />} />
                  <Route path="/admin/technician" element={<Technicians />} />
                  <Route path="/admin/cashiers" element={<Cashiers />} />
                  <Route path="/admin/rchclinics" element={<RchClinics />} />
                  <Route path="/admin/drug" element={<Drug />} />
                  <Route path="/admin/tests" element={<Tests />} />
                  <Route path="/admin/emergency" element={<Emergency />} />
                  <Route path="/admin/reports" element={<AllReports />} />
                  <Route path="/admin/all-feedback" element={<AllFeedback />} />
                </Route>

                {/* Reception Routes */}
                <Route element={<ProtectedRoute roles={["Reception"]} />}>
                  <Route path="/reception" element={<ReceptionDashboard />} />
                  <Route path="/reception/patient" element={<Patient />} />
                  <Route path="/reception/appointments" element={<AppointmentList />} />
                </Route>

                {/* Doctor Routes */}
                <Route element={<ProtectedRoute roles={["Doctor"]} />}>
                  <Route path="/doctor" element={<DoctorDashboard />} />
                  <Route path="/doctor/patients" element={<DoctorPatient />} />
                  <Route path="/doctor/lab" element={<LabTests />} />
                  <Route path="/doctor/bills" element={<Bills />} />
                  <Route path="/doctor/prescriptions" element={<PrescriptionForm />} />
                  <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                  <Route path="/doctor/records" element={<MedicalRecords />} />
                  <Route path="/doctor/emergency" element={<EmergencyCases />} />
                </Route>

                {/* Patient Routes */}
                <Route element={<ProtectedRoute roles={["Patient"]} />}>
                  <Route path="/patient" element={<PatientDashboard />} />
                  <Route path="/patient/appointment" element={<PatientAppointment />} />
                  <Route path="/patient/feedback" element={<PatientFeedback />} />
                  <Route path="/patient/medical-record" element={<PatientRecords />} />
                </Route>

                {/* Lab Routes */}
                <Route element={<ProtectedRoute roles={["LabTech"]} />}>
                  <Route path="/lab" element={<LabDashboard />} />
                  <Route path="/lab/tests" element={<TestResult />} />
                  <Route path="/lab/equipment" element={<LabEquipment />} />
                </Route>

                {/* Pharmacy Routes */}
                <Route element={<ProtectedRoute roles={["Pharmacist"]} />}>
                  <Route path="/pharmacy" element={<PharmacyDashboard />} />
                  <Route path="/pharmacy/prescriptions" element={<Prescipt />} />
                  <Route path="/pharmacy/medicine" element={<Medicine />} />
                  <Route path="/pharmacy/barcode" element={<BarcodeScannerSidebar />} />
                  <Route path="/pharmacy/physical-count" element={<PhysicalCount />} />
                </Route>

                {/* Cashier Routes */}
                <Route element={<ProtectedRoute roles={["Cashier"]} />}>
                  <Route path="/cashier" element={<CashierDashboard />} />
                  <Route path="/cashier/payment-details" element={<PaymentDetails />} />
                  <Route path="/cashier/billing" element={<Billing />} />
                </Route>

                {/* RchClinic Routes */}
                <Route element={<ProtectedRoute roles={["RchClinic"]} />}>
                  <Route path="/rchclinic" element={<RchClinicDashboard />} />
                  <Route path="/rchclinic/reports" element={<Reports />} />
                </Route>

                {/* Miscellaneous Routes */}
                <Route path="/add-patient" element={<AddPatientForm />} />

                {/* Unauthorized Route */}
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Default Redirect for Unknown Routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;