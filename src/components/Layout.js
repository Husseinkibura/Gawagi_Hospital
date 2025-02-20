// src/components/Layout.js
import React, { useState } from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar visible by default
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token"); // Check if the user is logged in

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  // Hide Navbar, Sidebar, and Footer on the Login and Register pages
  if (location.pathname === "/" || location.pathname === "/register") {
    return <Box>{children}</Box>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "white" }}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: isSidebarOpen ? "240px" : 0, // Adjust margin based on sidebar visibility
          transition: "margin-left 0.3s",
          width: isSidebarOpen ? "calc(100% - 240px)" : "100%", // Adjust width based on sidebar visibility
          marginBottom: "48px", // Add margin to prevent content from being hidden behind the footer
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;