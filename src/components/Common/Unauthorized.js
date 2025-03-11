// src/components/Common/Unauthorized.js

import React from "react";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-gray-700">You do not have permission to view this page.</p>
      </div>
    </div>
  );
};

export default Unauthorized;