import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  MenuItem,
} from "@mui/material";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Reception"); // Default role
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("", {
        fullname,
        username,
        email,
        password,
        role,
        address: "N/A", // Default address
        DateOfBirth: "1990-01-01", // Default date of birth
        profileImage: "N/A", // Default profile image
      });

      if (response.status === 201) {
        setSuccess("User registered successfully!");
        // Clear form fields
        setFullname("");
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("Reception");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Register User
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            sx={{ mb: 3 }}
            required
          />
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 3 }}
            required
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
            required
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            required
          />
          <TextField
            fullWidth
            select
            label="Role"
            variant="outlined"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ mb: 3 }}
            required
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Reception">Receptionist</MenuItem>
            <MenuItem value="Doctor">Doctor</MenuItem>
            <MenuItem value="LabTech">Lab Technician</MenuItem>
            <MenuItem value="Pharmacist">Pharmacist</MenuItem>
            <MenuItem value="Cashier">Cashier</MenuItem>
          </TextField>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 2 }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;