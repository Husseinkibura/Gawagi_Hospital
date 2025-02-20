import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("username", user.username);

        toast.success(`Welcome back, ${user.username}!`, {
          position: "top-right",
          autoClose: 3000,
        });

        // Role-based redirection
        const rolePaths = {
          Admin: "/admin",
          Reception: "/reception",
          Doctor: "/doctor",
          Pharmacist: "/pharmacy",
          LabTech: "/lab",
          Cashier: "/cashier",
        };

        setTimeout(() => {
          navigate(rolePaths[user.role] || "/dashboard");
        }, 3000);
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid username or password", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <ToastContainer />
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
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
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;






// // src/components/Auth/Login.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // Simulate a login request
//     const fakeLoginResponse = {
//       success: true,
//       role: "admin", // This should come from your backend
//       username: "Admin",
//     };

//     if (fakeLoginResponse.success) {
//       // Store the role and username in localStorage
//       localStorage.setItem("role", fakeLoginResponse.role);
//       localStorage.setItem("username", fakeLoginResponse.username);

//       // Redirect based on role
//       navigate(`/${fakeLoginResponse.role}`);
//     } else {
//       alert("Login failed");
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;


