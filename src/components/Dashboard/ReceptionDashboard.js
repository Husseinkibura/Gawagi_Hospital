// src/components/Dashboard/ReceptionDashboard.js
import React from "react";
import { Typography, Container, Paper, Box } from "@mui/material";

const ReceptionDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Reception Dashboard
        </Typography>
        <Box>
          <Typography variant="h6">Welcome, Receptionist!</Typography>
          {/* Add reception-specific features here */}
        </Box>
      </Paper>
    </Container>
  );
};

export default ReceptionDashboard;