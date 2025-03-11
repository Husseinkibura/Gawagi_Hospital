import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  LocalHospital as HospitalIcon,
  Receipt as ReceiptIcon,
  Science as ScienceIcon,
  LocalPharmacy as PharmacyIcon,
  PointOfSale as CashierIcon,
  CalendarToday as CalendarIcon,
  Folder as FolderIcon,
  Chat as ChatIcon,
  ChevronLeft as ChevronLeftIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Assessment as ReportIcon,
  Inventory as PhysicalCountIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 600px)"); // Check for mobile screens

  // Retrieve the role and username from localStorage (set during login)
  const role = localStorage.getItem("role") || "admin"; // Default to "admin"
  const username = localStorage.getItem("username") || "Admin"; // Default to "Admin"

  // Generate a unique key for the profile image based on the username
  const profileImageKey = `profileImage_${username}`;

  // Profile Image State
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem(profileImageKey) || ""
  );

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        localStorage.setItem(profileImageKey, imageUrl); // Save with unique key
        setProfileImage(imageUrl);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  // Sidebar items mapped by role
  const sidebarItems = {
    admin: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
      { text: "Patients", icon: <HospitalIcon />, path: "/admin/patients" },
      { text: "Doctor", icon: <PeopleIcon />, path: "/admin/doctors" },
      { text: "Receptionists", icon: <PeopleIcon />, path: "/admin/receptionists" },
      { text: "Pharmacists", icon: <PharmacyIcon />, path: "/admin/pharmacists" },
      { text: "Cashier", icon: <CashierIcon />, path: "/admin/cashiers" },
      { text: "Lab Technician", icon: <ScienceIcon />, path: "/admin/technician" },
      { text: "RCH", icon: <CashierIcon />, path: "/admin/rchclinics" },
      { text: "Drugs", icon: <PeopleIcon />, path: "/admin/drug" },
      { text: "Lab Tests", icon: <SettingsIcon />, path: "/admin/tests" },
      { text: "Emergency Cases", icon: <ReportIcon />, path: "/admin/emergency" },
      { text: "Patient Feedback", icon: <ReportIcon />, path: "/admin/all-feedback" },
      { text: "Staff Reports", icon: <AssignmentIcon />, path: "/admin/reports" },
    ],
    reception: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/reception" },
      { text: "Patient", icon: <HospitalIcon />, path: "/reception/patient" },
      { text: "Appointments", icon: <AssignmentIcon />, path: "/reception/appointments" },
    ],
    doctor: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/doctor" },
      { text: "Patients", icon: <PeopleIcon />, path: "/doctor/patients" },
      { text: "Lab Tests", icon: <ScienceIcon />, path: "/doctor/lab" },
      { text: "Billing & Payments", icon: <CashierIcon />, path: "/doctor/bills" },
      // { text: "Prescriptions", icon: <PharmacyIcon />, path: "/doctor/prescriptions" },
      { text: "Appointments", icon: <CalendarIcon />, path: "/doctor/appointments" },
      { text: "Medical Records", icon: <FolderIcon />, path: "/doctor/records" },
      { text: "Emergency Cases", icon: <ReportIcon />, path: "/doctor/emergency" },
      { text: "Reports", icon: <ReportIcon />, path: "/doctor/reports" },
    ],
    labtech: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/lab" },
      { text: "Lab Tests", icon: <ScienceIcon />, path: "/lab/tests" },
      { text: "Lab Equipment", icon: <ScienceIcon />, path: "/lab/equipment" },
    ],
    pharmacist: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/pharmacy" },
      { text: "Prescriptions", icon: <ReceiptIcon />, path: "/pharmacy/prescriptions" },
      { text: "Medicine", icon: <PharmacyIcon />, path: "/pharmacy/medicine" },
      { text: "Barcode", icon: <QrCodeScannerIcon />, path: "/pharmacy/barcode" },
      { text: "Physical Count", icon: <PhysicalCountIcon />, path: "/pharmacy/physical-count" },
    ],
    cashier: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/cashier" },
      { text: "Bills", icon: <ReceiptIcon />, path: "/cashier/payment-details" },
      // { text: "Billing", icon: <ReceiptIcon />, path: "/cashier/billing" },
    ],
    patient: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/patient" },
      { text: "Appointment", icon: <CalendarIcon />, path: "/patient/appointment" },
      { text: "Medical Record", icon: <ReceiptIcon />, path: "/patient/medical-record" },
      { text: "Feedback", icon: <ChatIcon />, path: "/patient/feedback" },
    ],
    rchclinic: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/rchclinic" },
      { text: "Reports", icon: <CalendarIcon />, path: "/rchclinic/reports" },
    ],
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"} // Use temporary drawer for mobile
      open={isOpen}
      onClose={toggleSidebar}
      sx={{
        width: isOpen ? 240 : 64,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isOpen ? 240 : 64,
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          zIndex: (theme) => theme.zIndex.drawer,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#aaa transparent",
          "&::-webkit-scrollbar": {
            width: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#aaa",
            borderRadius: "2px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        },
      }}
    >
      {/* Title Section */}
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          borderBottom: "1px solid #e0e0e0",
          cursor: "pointer",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            color: "#1976d2",
          }}
        >
          Gawagi Dispensary
        </Typography>
      </Box>

      {/* Profile Section */}
      <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>
        <label htmlFor="profile-upload" style={{ cursor: "pointer" }}>
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <Avatar
            src={profileImage}
            sx={{ width: 70, height: 70, mb: 2, cursor: "pointer" }}
            alt="Profile"
          >
            {!profileImage && (username ? username.charAt(0) : "U")}
          </Avatar>
        </label>
        {isOpen && (
          <>
            <Typography variant="h6" sx={{ fontWeight: "medium", fontSize: "1.1rem" }}>
              {username}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.9rem" }}>
              {role}
            </Typography>
          </>
        )}
      </Box>

      {/* Sidebar List */}
      <List>
        {sidebarItems[role.toLowerCase()]?.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => navigate(item.path)}
            sx={{ cursor: "pointer" }} // Add cursor pointer here
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      {/* Toggle Button */}
      <Box sx={{ p: 2, textAlign: "center", borderTop: "1px solid #e0e0e0" }}>
        <IconButton onClick={toggleSidebar}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;