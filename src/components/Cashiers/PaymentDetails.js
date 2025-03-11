import React, { useState, useEffect } from "react";
import { Search } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Bills = () => {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [diseases, setDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [drugs, setDrugs] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    fullname: "",
    age: "",
    ConsultationFee: "",
    diseases: "",
    testType: "",
    testPrice: "",
    totalTestPrice: "",
    drugName: "",
    drugPrice: "",
    totalDrugPrice: "",
    paymentType: "",
    assignedBy: "",
    status: "Not Paid",
    totalBills: 0,
  });
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const diseasesResponse = await fetch("http://localhost:5000/api/diseases", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!diseasesResponse.ok) {
          throw new Error(`Failed to fetch diseases. Status: ${diseasesResponse.status}`);
        }
        const diseasesData = await diseasesResponse.json();
        setDiseases(diseasesData);

        const drugsResponse = await fetch("http://localhost:5000/api/drugs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!drugsResponse.ok) {
          throw new Error(`Failed to fetch drugs. Status: ${drugsResponse.status}`);
        }
        const drugsData = await drugsResponse.json();
        setDrugs(drugsData);

        const billsResponse = await fetch("http://localhost:5000/api/bills", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!billsResponse.ok) {
          throw new Error(`Failed to fetch bills. Status: ${billsResponse.status}`);
        }
        const billsData = await billsResponse.json();
        setBills(billsData);
      } catch (error) {
        console.error("Error details:", error);
        toast.error(`An error occurred while fetching data: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  // Calculate total bills
  // useEffect(() => {
  //   const totalBillsAmount =
  //     parseFloat(formData.totalTestPrice || 0) + parseFloat(formData.totalDrugPrice || 0);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     totalBills: totalBillsAmount.toFixed(2), // Ensure 2 decimal places
  //   }));
  // }, [formData.totalTestPrice, formData.totalDrugPrice]);

  
  // Calculate total bills
  // useEffect(() => {
  //   const totalBillsAmount =
  //     parseFloat(formData.ConsultationFee || 0) + 
  //     parseFloat(formData.totalTestPrice || 0) + 
  //     parseFloat(formData.totalDrugPrice || 0);
    
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     totalBills: totalBillsAmount.toFixed(2), // Ensure 2 decimal places
  //   }));
  // }, [formData.ConsultationFee, formData.totalTestPrice, formData.totalDrugPrice]);

  useEffect(() => {
    const totalBillsAmount =
      parseFloat(formData.ConsultationFee || 0) + 
      parseFloat(formData.totalTestPrice || 0) + 
      parseFloat(formData.totalDrugPrice || 0);
    
    setFormData((prevData) => ({
      ...prevData,
      totalBills: totalBillsAmount.toFixed(2), // Ensure 2 decimal places
    }));
  }, [formData.ConsultationFee, formData.totalTestPrice, formData.totalDrugPrice]);



  // Toggle modals
  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setFormData({
        patientId: "",
        fullname: "",
        age: "",
        ConsultationFee: "",
        diseases: "",
        testType: "",
        testPrice: "",
        totalTestPrice: "",
        drugName: "",
        drugPrice: "",
        totalDrugPrice: "",
        paymentType: "",
        assignedBy: "",
        status: "Not Paid",
        totalBills: 0,
      });
      setSelectedDiseases([]);
      setSelectedDrugs([]);
    }
  };

  const toggleViewModal = () => {
    setShowViewModal(!showViewModal);
  };

  const toggleInvoiceModal = () => {
    setShowInvoiceModal(!showInvoiceModal);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle disease selection
  const handleDiseaseSelection = (e) => {
    const diseaseId = e.target.value;
    const selectedDisease = diseases.find((disease) => disease.id === parseInt(diseaseId));

    if (selectedDisease && !selectedDiseases.some((d) => d.id === selectedDisease.id)) {
      setSelectedDiseases((prev) => [...prev, selectedDisease]);

      setFormData((prevData) => ({
        ...prevData,
        diseases: [...selectedDiseases, selectedDisease].map((d) => d.disease_name).join(", "),
        testType: [...selectedDiseases, selectedDisease].map((d) => d.test_type).join(", "),
        testPrice: [...selectedDiseases, selectedDisease].reduce((total, d) => total + parseInt(d.price), 0),
        totalTestPrice: [...selectedDiseases, selectedDisease].reduce((total, d) => total + parseInt(d.price), 0),
      }));
    }
  };

  // Handle drug selection
  const handleDrugSelection = (e) => {
    const drugId = e.target.value;
    const selectedDrug = drugs.find((drug) => drug.id === parseInt(drugId));

    if (selectedDrug && !selectedDrugs.some((d) => d.id === selectedDrug.id)) {
      setSelectedDrugs((prev) => [...prev, selectedDrug]);

      // Calculate total drug price
      const totalDrugPrice = selectedDrugs.reduce((total, drug) => total + parseInt(drug.price), 0) + parseInt(selectedDrug.price);

      setFormData((prevData) => ({
        ...prevData,
        drugName: selectedDrug.name,
        drugPrice: parseInt(selectedDrug.price),
        totalDrugPrice: totalDrugPrice,
      }));
    }
  };

  // Handle patient ID change
  const handlePatientIdChange = async (e) => {
    const patientId = e.target.value;
    setFormData({ ...formData, patientId });

    if (patientId) {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/${patientId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch patient data.");
        }

        const patient = await response.json();
        if (patient) {
          setFormData((prevData) => ({
            ...prevData,
            fullname: patient.fullname || "",
            age: patient.age || "",
            ConsultationFee: patient.ConsultationFee || "",
          }));
        } else {
          setFormData((prevData) => ({
            ...prevData,
            fullname: "",
            age: "",
            ConsultationFee: "",
          }));
          toast.error("Patient not found.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching patient data.");
        console.error(error);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        fullname: "",
        age: "",
        ConsultationFee: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create bill.");
      }

      const newBill = await response.json();
      setBills((prev) => [...prev, newBill]);
      toggleModal();
      toast.success("Bill created successfully!");
    } catch (error) {
      console.error("Error details:", error);
      toast.error(`An error occurred while creating the bill: ${error.message}`);
    }
  };

  // Handle delete
  const handleDelete = async (billId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/bills/${billId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete bill.");
      }

      // Remove the deleted bill from the state
      setBills((prevBills) => prevBills.filter((bill) => bill.id !== billId));
      toast.success("Bill deleted successfully!");
    } catch (error) {
      console.error("Error details:", error);
      toast.error(`An error occurred while deleting the bill: ${error.message}`);
    }
  };

  // Handle view
  const handleView = (bill) => {
    setSelectedBill(bill);
    toggleViewModal();
  };

  // Handle edit
  const handleEdit = (bill) => {
    setFormData(bill);
    toggleModal();
  };


  // Function to handle payment approval
// const handleApprovePayment = async (billId) => {
//   try {
//     const token = localStorage.getItem("token");

//     const response = await fetch(`http://localhost:5000/api/bills/${billId}/approve-payment`, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to approve payment.");
//     }

//     // Update the bill's status in the state
//     setBills((prevBills) =>
//       prevBills.map((bill) =>
//         bill.id === billId ? { ...bill, status: "Paid", payment_status: "Paid" } : bill
//       )
//     );

//     toast.success("Payment approved successfully!");
//   } catch (error) {
//     console.error("Error details:", error);
//     toast.error(`An error occurred while approving the payment: ${error.message}`);
//   }
// };

// Bills.js

const handleApprovePayment = async (billId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/api/bills/${billId}/approve-payment`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to approve payment.");
    }

    // Update the bill's status in the state
    setBills((prevBills) =>
      prevBills.map((bill) =>
        bill.id === billId ? { ...bill, status: "Paid", payment_status: "Paid" } : bill
      )
    );

    toast.success("Payment approved successfully!");
  } catch (error) {
    console.error("Error in handleApprovePayment:", error);
    toast.error(`An error occurred while approving the payment: ${error.message}`);
  }
};


  // Handle invoice
  const handleInvoice = (bill) => {
    setSelectedBill(bill);
    setShowInvoiceModal(true);
  };

  // const generateInvoice = (bill) => {
  //   // Create a receipt-like format
  //   const invoiceContent = `
  //     ----------------------------------------
  //     |           MEDICAL INVOICE           |
  //     ----------------------------------------
  //     Patient ID: ${bill.patientId}
  //     Patient Name: ${bill.fullname}
  //     Age: ${bill.age}
  //     ----------------------------------------
  //     |           DIAGNOSIS & TESTS         |
  //     ----------------------------------------
  //     Diseases: ${bill.diseases}
  //     Test Type: ${bill.testType}
  //     Test Price: ${bill.testPrice}
  //     Total Test Price: ${bill.totalTestPrice}
  //     ----------------------------------------
  //     |           MEDICATION DETAILS        |
  //     ----------------------------------------
  //     Drug Name: ${bill.drugName}
  //     Drug Price: ${bill.drugPrice}
  //     Total Drug Price: ${bill.totalDrugPrice}
  //     ----------------------------------------
  //     |           PAYMENT DETAILS           |
  //     ----------------------------------------
  //     Total Bills: ${bill.totalBills}
  //     Payment Type: ${bill.paymentType}
  //     Status: ${bill.status}
  //     Assigned By: ${bill.assignedBy}
  //     Date Created: ${bill.dateCreated}
  //     ----------------------------------------
  //     |           THANK YOU!                |
  //     ----------------------------------------
  //   `;
  
  //   // Create a new window for printing
  //   const printWindow = window.open("", "_blank");
  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Invoice Receipt</title>
  //         <style>
  //           body {
  //             font-family: Arial, sans-serif;
  //             font-size: 14px;
  //             line-height: 1.5;
  //           }
  //           .receipt {
  //             width: 300px;
  //             margin: 0 auto;
  //             padding: 10px;
  //             border: 1px solid #000;
  //           }
  //           .receipt-header, .receipt-footer {
  //             text-align: center;
  //             font-weight: bold;
  //           }
  //           .receipt-section {
  //             margin-bottom: 10px;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="receipt">
  //           <div class="receipt-header">MEDICAL INVOICE</div>
  //           <div class="receipt-section">
  //             <strong>Patient ID:</strong> ${bill.patientId}<br>
  //             <strong>Patient Name:</strong> ${bill.fullname}<br>
  //             <strong>Age:</strong> ${bill.age}<br>
  //           </div>
  //           <div class="receipt-section">
  //             <strong>Diseases:</strong> ${bill.diseases}<br>
  //             <strong>Test Type:</strong> ${bill.testType}<br>
  //             <strong>Test Price:</strong> ${bill.testPrice}<br>
  //             <strong>Total Test Price:</strong> ${bill.totalTestPrice}<br>
  //           </div>
  //           <div class="receipt-section">
  //             <strong>Drug Name:</strong> ${bill.drugName}<br>
  //             <strong>Drug Price:</strong> ${bill.drugPrice}<br>
  //             <strong>Total Drug Price:</strong> ${bill.totalDrugPrice}<br>
  //           </div>
  //           <div class="receipt-section">
  //             <strong>Total Bills:</strong> ${bill.totalBills}<br>
  //             <strong>Payment Type:</strong> ${bill.paymentType}<br>
  //             <strong>Status:</strong> ${bill.status}<br>
  //             <strong>Assigned By:</strong> ${bill.assignedBy}<br>
  //             <strong>Date Created:</strong> ${bill.dateCreated}<br>
  //           </div>
  //           <div class="receipt-footer">THANK YOU!</div>
  //         </div>
  //         <script>
  //           window.onload = function() {
  //             window.print();
  //           };
  //         </script>
  //       </body>
  //     </html>
  //   `);
  //   printWindow.document.close();
  // };


  const generateInvoice = (bill) => {
    // Create a receipt-like format
    const invoiceContent = `
      ----------------------------------------
      |           MEDICAL INVOICE           |
      ----------------------------------------
      Patient ID: ${bill.patientId}
      Patient Name: ${bill.fullname}
      Age: ${bill.age}
      Consultation Fee: ${bill.ConsultationFee}
      ----------------------------------------
      |           DIAGNOSIS & TESTS         |
      ----------------------------------------
      Diseases: ${bill.diseases}
      Test Type: ${bill.testType}
      Test Price: ${bill.testPrice}
      Total Test Price: ${bill.totalTestPrice}
      ----------------------------------------
      |           MEDICATION DETAILS        |
      ----------------------------------------
      Drug Name: ${bill.drugName}
      Drug Price: ${bill.drugPrice}
      Total Drug Price: ${bill.totalDrugPrice}
      ----------------------------------------
      |           PAYMENT DETAILS           |
      ----------------------------------------
      Total Bills: ${bill.totalBills}
      Payment Type: ${bill.paymentType}
      Status: ${bill.status}
      Assigned By: ${bill.assignedBy}
      Date Created: ${bill.dateCreated}
      ----------------------------------------
      |           THANK YOU!                |
      ----------------------------------------
    `;
  
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 14px;
              line-height: 1.5;
            }
            .receipt {
              width: 300px;
              margin: 0 auto;
              padding: 10px;
              border: 1px solid #000;
            }
            .receipt-header, .receipt-footer {
              text-align: center;
              font-weight: bold;
            }
            .receipt-section {
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="receipt-header">MEDICAL INVOICE</div>
            <div class="receipt-section">
              <strong>Patient ID:</strong> ${bill.patientId}<br>
              <strong>Patient Name:</strong> ${bill.fullname}<br>
              <strong>Age:</strong> ${bill.age}<br>
               <strong>Consultation Fee:</strong> ${bill.ConsultationFee}<br>
            </div>
            <div class="receipt-section">
              <strong>Diseases:</strong> ${bill.diseases}<br>
              <strong>Test Type:</strong> ${bill.testType}<br>
              <strong>Test Price:</strong> ${bill.testPrice}<br>
              <strong>Total Test Price:</strong> ${bill.totalTestPrice}<br>
            </div>
            <div class="receipt-section">
              <strong>Drug Name:</strong> ${bill.drugName}<br>
              <strong>Drug Price:</strong> ${bill.drugPrice}<br>
              <strong>Total Drug Price:</strong> ${bill.totalDrugPrice}<br>
            </div>
            <div class="receipt-section">
              <strong>Total Bills:</strong> ${bill.totalBills}<br>
              <strong>Payment Type:</strong> ${bill.paymentType}<br>
              <strong>Status:</strong> ${bill.status}<br>
              <strong>Assigned By:</strong> ${bill.assignedBy}<br>
              <strong>Date Created:</strong> ${bill.dateCreated}<br>
            </div>
            <div class="receipt-footer">THANK YOU!</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filter bills based on search term
  const filteredBills = bills.filter((bill) => {
    if (!bill || !bill.fullname) return false;
    return bill.fullname.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const [billsPerPage, setBillsPerPage] = useState(5);
  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(filteredBills.length / billsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBillsPerPageChange = (e) => {
    setBillsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-5">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Bills Overview</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="w-5 h-5 text-gray-400" />
            </span>
          </div>
          {/* <button
            onClick={toggleModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Create Bill
          </button> */}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>

{
  currentBills.map((bill, index) => (
    <tr key={bill.id} className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1 + (currentPage - 1) * billsPerPage}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.patientId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.fullname}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.age}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.paymentType}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.assignedBy}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            bill.payment_status === "Paid"
              ? "bg-green-400 text-white"
              : "bg-yellow-400 text-white"
          }`}
        >
          {bill.payment_status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
        <button
          onClick={() => handleView(bill)}
          className="bg-blue-500 text-white px-2 py-1 rounded-md flex items-center gap-1 hover:bg-blue-700 transition duration-300 text-xs"
        >
          View
        </button>
        {/* <button
          onClick={() => handleEdit(bill)}
          className="bg-green-500 text-white px-2 py-1 rounded-md flex items-center gap-1 hover:bg-green-700 transition duration-300 text-xs"
        >
          Edit
        </button> */}
        <button
          onClick={() => handleInvoice(bill)}
          className="bg-purple-500 text-white px-2 py-1 rounded-md flex items-center gap-1 hover:bg-purple-700 transition duration-300 text-xs"
        >
          Invoice
        </button>
        {bill.payment_status === "Not Paid" && (
          <button
            onClick={() => handleApprovePayment(bill.id)}
            className="bg-orange-500 text-white px-2 py-1 rounded-md flex items-center gap-1 hover:bg-orange-700 transition duration-300 text-xs"
          >
            Approve Payment
          </button>
        )}
        {/* <button
          onClick={() => handleDelete(bill.id)}
          className="bg-red-500 text-white px-2 py-1 rounded-md flex items-center gap-1 hover:bg-red-700 transition duration-300 text-xs"
        >
          Delete
        </button> */}
      </td>
    </tr>
    ))};
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination (from LabTests.js) */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Results per page:</span>
          <select
            value={billsPerPage}
            onChange={handleBillsPerPageChange}
            className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            1
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            &lt;
          </button>
          <span className="px-3 py-1 bg-white text-gray-700 rounded-lg">
            {currentPage}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            &gt;
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {totalPages}
          </button>
        </div>
      </div>

      {/* Modals (from Bills.js) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-lg w-11/12 md:w-8/12 lg:w-6/12 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h1 className="text-lg font-semibold text-gray-800">Add Bill</h1>
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-red-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                  <input
                    type="text"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handlePatientIdChange}
                    placeholder="Enter Patient ID"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    readOnly
                    placeholder="Patient Name"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    readOnly
                    placeholder="Age"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div>   
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                  <input
                    type="number"
                    name="ConsultationFee"
                    value={formData.ConsultationFee}
                    readOnly
                    placeholder="Consultation Fee"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div> 

                {/* Test Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Diseases</label>
                  <select
                    onChange={handleDiseaseSelection}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select a disease</option>
                    {diseases.map((disease) => (
                      <option key={disease.id} value={disease.id}>
                        {disease.disease_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diseases</label>
                  <input
                    type="text"
                    name="diseases"
                    value={formData.diseases}
                    readOnly
                    placeholder="Diseases"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                  <input
                    type="text"
                    name="testType"
                    value={formData.testType}
                    readOnly
                    placeholder="Test Type"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Price</label>
                  <input
                    type="number"
                    name="testPrice"
                    value={formData.testPrice}
                    onChange={handleInputChange}
                    placeholder="Test Price"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Test Price</label>
                  <input
                    type="number"
                    name="totalTestPrice"
                    value={formData.totalTestPrice}
                    readOnly
                    placeholder="Total Test Price"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div>

                {/* Medication Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Drugs</label>
                  <select
                    onChange={handleDrugSelection}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select a drug</option>
                    {drugs.map((drug) => (
                      <option key={drug.id} value={drug.id}>
                        {drug.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedDrugs.map((drug) => (
                  <div key={drug.id} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Drug Name</label>
                      <input
                        type="text"
                        value={drug.name}
                        readOnly
                        className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Drug Price</label>
                      <input
                        type="number"
                        name="drugPrice"
                        value={formData.drugPrice}
                        onChange={handleInputChange}
                        placeholder="Drug Price"
                        className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        value={drug.stock_quantity}
                        readOnly
                        className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Drug Price</label>
                  <input
                    type="number"
                    name="totalDrugPrice"
                    value={formData.totalDrugPrice}
                    readOnly
                    placeholder="Total Drug Price"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div>

                {/* Bills Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Bills</label>
                  <input
                    type="number"
                    name="totalBills"
                    value={formData.totalBills}
                    readOnly
                    placeholder="Total Bills"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                  <select
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select Payment Type</option>
                    <option value="Cash">Cash</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Banking">Banking</option>
                    <option value="Insurance">Insurance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned By</label>
                  <input
                    type="text"
                    name="assignedBy"
                    value={formData.assignedBy}
                    onChange={handleInputChange}
                    placeholder="Assigned By"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    readOnly
                    placeholder="Status"
                    className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Created</label>
                  <input
                    type="datetime-local"
                    name="dateCreated"
                    value={formData.dateCreated}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={toggleModal}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal (from Bills.js) */}
      {showViewModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-lg w-11/12 md:w-8/12 lg:w-6/12 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h1 className="text-lg font-semibold text-gray-800">View Bill Details</h1>
              <button
                onClick={toggleViewModal}
                className="text-gray-500 hover:text-red-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Patient Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.patientId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.fullname}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.age}
                  </p>
                </div>    
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.ConsultationFee}
                  </p>
                </div> 

                {/* Test Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diseases</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.diseases}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.testType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Price</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.testPrice}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Test Price</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.totalTestPrice}
                  </p>
                </div>

                {/* Medication Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drug Name</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.drugName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drug Price</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.drugPrice}
                  </p>
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.stockQuantity}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.quantity}
                  </p>
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Drug Price</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.totalDrugPrice}
                  </p>
                </div>

                {/* Bills Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Bills</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.totalBills}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.paymentType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned By</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.assignedBy}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.status}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Created</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.dateCreated}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal (from Bills.js) */}
      {showInvoiceModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-lg w-11/12 md:w-8/12 lg:w-6/12 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h1 className="text-lg font-semibold text-gray-800">Invoice Details</h1>
              <button
                onClick={toggleInvoiceModal}
                className="text-gray-500 hover:text-red-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Patient Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.patientId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.fullname}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.age}
                  </p>
                </div>  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.ConsultationFee}
                  </p>
                </div>

                {/* Test Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diseases</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.diseases}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.testType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Price</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.testPrice}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Test Price</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.totalTestPrice}
                  </p>
                </div>

                {/* Medication Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drug Name</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.drugName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drug Price</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.drugPrice}
                  </p>
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.stockQuantity}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.quantity}
                  </p>
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Drug Price</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.totalDrugPrice}
                  </p>
                </div>

                {/* Bills Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Bills</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.totalBills}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.paymentType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned By</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.assignedBy}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.status}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Created</label>
                  <p className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-100 text-sm">
                    {selectedBill.dateCreated}
                  </p>
                </div>

                {/* Generate Invoice Button */}
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => generateInvoice(selectedBill)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Generate Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;