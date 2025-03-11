import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if the pharmacist has submitted the report
  const checkReportSubmission = () => {
    const lastReportDate = localStorage.getItem("lastReportDate");
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    if (lastReportDate) {
      const lastMonth = new Date(lastReportDate).getMonth();
      if (lastMonth !== currentMonth) {
        localStorage.removeItem("reportSubmitted"); // Reset report status for the new month
        return false;
      }
    }

    return localStorage.getItem("reportSubmitted") === "true";
  };

  // Handle login for all users
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if form validation fails
  
    setLoading(true);
  
    try {
      // Attempt to log in as a patient first
      try {
        const patientResponse = await axios.post("http://localhost:5000/api/patients/login", {
          username,
          password,
        });
  
        const { token: patientToken, role: patientRole, username: patientUsername, profileImage: patientProfileImage } = patientResponse.data;
  
        if (patientToken && patientRole === "Patient") {
          // Store token, role, username, and profile image in localStorage
          localStorage.setItem("token", patientToken);
          localStorage.setItem("role", patientRole);
          localStorage.setItem("username", patientUsername);
          localStorage.setItem("profileImage", patientProfileImage || "default-profile.png"); // Use a default image if none is provided
  
          // Show success message
          toast.success("Login successful! Redirecting to your dashboard...", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          });
  
          // Redirect to patient dashboard after 3 seconds
          setTimeout(() => {
            navigate("/patient");
          }, 3000);
          return; // Exit the function after handling patient login
        }
      } catch (patientError) {
        // If patient login fails, proceed to general login
        console.log("Patient login failed, attempting general login...");
      }
  
      // Attempt to log in as other roles (Admin, Doctor, Reception, etc.)
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
  
      const { token, user } = response.data;
  
      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("username", user.username);
        localStorage.setItem("profileImage", user.profileImage || "default-profile.png"); // Use a default image if none is provided
  
        toast.success(`Welcome back, ${user.username}!`, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
  
        // Check if the user is a pharmacist and if the report is submitted
        if (user.role === "Pharmacist" && !checkReportSubmission()) {
          toast.info("Please submit the physical count report before logging in.", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          });
          setTimeout(() => {
            navigate("/physical-count");
          }, 3000);
          return;
        }
  
        const rolePaths = {
          Admin: "/admin",
          Reception: "/reception",
          Doctor: "/doctor",
          Pharmacist: "/pharmacy",
          LabTech: "/lab",
          Cashier: "/cashier",
          Patient: "/patient",
          RchClinic: "/rchclinic",
        };
  
        setTimeout(() => {
          navigate(rolePaths[user.role] || "/dashboard");
        }, 3000);
      }
    } catch (err) {
      // Handle login errors
      toast.error(err.response?.data?.message || "Invalid username or password", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-indigo-100 p-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-full shadow-lg mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Please sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`}
                placeholder="Enter your username"
              />
              {errors.username && (
                <span className="absolute right-3 top-3 text-red-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              )}
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <span className="absolute right-3 top-3 text-red-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              )}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;