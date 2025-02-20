import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
  Avatar,
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
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  // Retrieve the role and username from localStorage (set during login)
  const role = localStorage.getItem("role") || "admin"; // Default to "admin"
  const username = localStorage.getItem("username") || "Admin"; // Default to "Admin"
  const storedImage = localStorage.getItem("profileImage");

  // Profile Image State
  const [profileImage, setProfileImage] = useState(storedImage || "");

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("profileImage", reader.result);
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
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

  return (
    <Drawer
      variant="persistent"
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
            width: "3px", // Reduced width for smoother scrolling
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
      {/* Profile Section */}
      <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>
        <label htmlFor="profile-upload">
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
              {username || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.9rem" }}>
              {role || "User Role"}
            </Typography>
          </>
        )}
      </Box>

      {/* Sidebar List with Cursor Pointer */}
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