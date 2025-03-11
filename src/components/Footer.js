import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";

const Footer = () => {
  const isMobile = useMediaQuery("(max-width: 600px)"); // Check for mobile screens

  return (
    <Box
      component="footer"
      sx={{
        py: 1, // Reduced padding (smaller height)
        px: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        position: "fixed", // Fix the footer at the bottom
        bottom: 0,
        left: isMobile ? 0 : "240px", // Align footer with the main content area (when sidebar is open)
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure footer is above other content
        transition: "left 0.3s", // Smooth transition when sidebar is toggled
      }}
    >
      <Typography variant="body2" align="center" sx={{ fontSize: "0.875rem", fontWeight: "medium" }}>
        © {new Date().getFullYear()} Hospital Management System. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;