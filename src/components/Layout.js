import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar visible by default
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 600px)"); // Check for mobile screens

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  // Hide Navbar, Sidebar, and Footer on specific routes
  const hideLayoutRoutes = ["/", "/register", "/website"];
  if (hideLayoutRoutes.includes(location.pathname)) {
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
          marginLeft: isSidebarOpen && !isMobile ? "240px" : 0, // Adjust margin based on sidebar visibility
          transition: "margin-left 0.3s",
          width: isSidebarOpen && !isMobile ? "calc(100% - 240px)" : "100%", // Adjust width based on sidebar visibility
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