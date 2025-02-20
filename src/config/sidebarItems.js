// src/config/sidebarItems.js
export const sidebarItems = {
    admin: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
      { text: "Patients", icon: <HospitalIcon />, path: "/admin/patients" },
      { text: "Doctor", icon: <PeopleIcon />, path: "/admin/doctors" },
      { text: "Receptionists", icon: <PeopleIcon />, path: "/admin/receptionists" },
      { text: "Pharmacists", icon: <PharmacyIcon />, path: "/admin/pharmacists" },
      { text: "Cashier", icon: <CashierIcon />, path: "/admin/cashiers" },
      { text: "Lab Technician", icon: <ScienceIcon />, path: "/admin/technician" },
      { text: "Manage Users", icon: <PeopleIcon />, path: "/admin/manage-users" },
      { text: "System Settings", icon: <SettingsIcon />, path: "/admin/settings" },
      { text: "Generate Reports", icon: <AssignmentIcon />, path: "/admin/reports" },
    ],
    reception: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/reception" },
      { text: "Patient Registration", icon: <HospitalIcon />, path: "/reception/register-patient" },
      { text: "Appointments", icon: <AssignmentIcon />, path: "/reception/appointments" },
    ],
    doctor: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/doctor" },
      { text: "Patients", icon: <HospitalIcon />, path: "/doctor/patients" },
      { text: "Prescriptions", icon: <ReceiptIcon />, path: "/doctor/prescriptions" },
    ],
    lab: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/lab" },
      { text: "Lab Tests", icon: <ScienceIcon />, path: "/lab/tests" },
    ],
    pharmacy: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/pharmacy" },
      { text: "Prescriptions", icon: <ReceiptIcon />, path: "/pharmacy/prescriptions" },
      { text: "Inventory", icon: <PharmacyIcon />, path: "/pharmacy/inventory" },
    ],
    cashier: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/cashier" },
      { text: "Billing", icon: <ReceiptIcon />, path: "/cashier/billing" },
    ],
  };