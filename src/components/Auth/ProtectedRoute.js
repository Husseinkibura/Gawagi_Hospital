// src/components/Auth/ProtectedRoute.js

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ roles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // If no token is found, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and the user's role is not included, redirect to unauthorized page
  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;