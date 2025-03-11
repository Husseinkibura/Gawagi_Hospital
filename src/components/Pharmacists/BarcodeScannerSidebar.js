import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const BarcodeScannerSidebar = ({ onScanSuccess }) => {
  const [drugDetails, setDrugDetails] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("barcode-scanner", {
      qrbox: {
        width: 400,
        height: 250,
      },
      fps: 5,
    });

    const onScanSuccessHandler = async (decodedText) => {
      try {
        // Fetch drug details by barcode
        const response = await fetch(`http://localhost:5000/api/drugs/barcode/${decodedText}`);
        if (!response.ok) {
          throw new Error("Failed to fetch drug details");
        }

        const data = await response.json();
        setDrugDetails(data); // Set drug details in state
        onScanSuccess(decodedText); // Pass the scanned barcode to the parent component
      } catch (error) {
        console.error("Error fetching drug details:", error);
      } finally {
        scanner.clear(); // Stop the scanner after a successful scan
      }
    };

    const onScanErrorHandler = (error) => {
      console.error("Barcode scan error:", error);
    };

    scanner.render(onScanSuccessHandler, onScanErrorHandler);

    return () => {
      scanner.clear();
    };
  }, [onScanSuccess]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8 shadow-2xl rounded-lg mt-10">
      {/* Horizontal Card at the Top */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">How to Use the Barcode Scanner</h2>
        <p className="text-gray-300 mb-4">
          The barcode scanner allows you to quickly scan and process barcodes. Follow these steps to use it effectively:
        </p>
        <ul className="list-disc list-inside text-gray-300">
          <li>Ensure the barcode is clearly visible within the scanner frame.</li>
          <li>Hold the barcode steady and align it with the center of the frame.</li>
          <li>Wait for the scanner to automatically detect and process the barcode.</li>
          <li>Once scanned, the barcode data will be displayed below.</li>
        </ul>
      </div>

      {/* Barcode Scanner */}
      <div className="flex justify-center">
        <div
          id="barcode-scanner"
          className="w-full max-w-2xl p-6 bg-gray-700 rounded-lg shadow-inner"
        ></div>
      </div>

      {/* Display Drug Details */}
      {drugDetails && (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Drug Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={drugDetails.image_url}
                alt={drugDetails.name}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div>
              <p className="text-gray-300"><strong>Name:</strong> {drugDetails.name}</p>
              <p className="text-gray-300"><strong>Brand Name:</strong> {drugDetails.brand_name}</p>
              <p className="text-gray-300"><strong>Category:</strong> {drugDetails.category}</p>
              <p className="text-gray-300"><strong>Price:</strong> {drugDetails.price} Tsh</p>
              <p className="text-gray-300"><strong>Expiry Date:</strong> {drugDetails.expiry_date}</p>
              <p className="text-gray-300"><strong>Generic Name:</strong> {drugDetails.generic_name}</p>
              <p className="text-gray-300"><strong>Description:</strong> {drugDetails.description}</p>
              <p className="text-gray-300"><strong>Dosage Form:</strong> {drugDetails.dosage_form}</p>
              <p className="text-gray-300"><strong>Strength:</strong> {drugDetails.strength}</p>
              <p className="text-gray-300"><strong>Manufacturer:</strong> {drugDetails.manufacturer}</p>
              <p className="text-gray-300"><strong>Side Effects:</strong> {drugDetails.side_effects}</p>
              <p className="text-gray-300"><strong>Stock Quantity:</strong> {drugDetails.stock_quantity}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Text */}
      <p className="text-sm text-gray-400 text-center mt-6">
        Scan a barcode to proceed. Ensure the barcode is within the frame.
      </p>
    </div>
  );
};

export default BarcodeScannerSidebar;