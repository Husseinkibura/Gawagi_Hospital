// src/routes.js
export const roleBasedRoutes = {
    admin: [
      { path: "/admin", component: "AdminDashboard" },
      { path: "/admin/patients", component: "Patients" },
      { path: "/admin/doctors", component: "Doctors" },
      { path: "/admin/receptionists", component: "Receptionists" },
      { path: "/admin/pharmacists", component: "Pharmacists" },
      { path: "/admin/technician", component: "Technicians" },
      { path: "/admin/cashiers", component: "Cashiers" },
      { path: "/admin/manage-users", component: "ManageUsers" },
    ],
    reception: [
      { path: "/reception", component: "ReceptionDashboard" },
      { path: "/reception/register-patient", component: "AddPatientForm" },
      { path: "/reception/appointments", component: "Appointments" },
    ],
    doctor: [
      { path: "/doctor", component: "DoctorDashboard" },
      { path: "/doctor/patients", component: "Patients" },
      { path: "/doctor/prescriptions", component: "Prescriptions" },
    ],
    lab: [
      { path: "/lab", component: "LabDashboard" },
      { path: "/lab/tests", component: "LabTests" },
    ],
    pharmacy: [
      { path: "/pharmacy", component: "PharmacyDashboard" },
      { path: "/pharmacy/prescriptions", component: "Prescriptions" },
      { path: "/pharmacy/inventory", component: "Inventory" },
    ],
    cashier: [
      { path: "/cashier", component: "CashierDashboard" },
      { path: "/cashier/billing", component: "Billing" },
    ],
  };