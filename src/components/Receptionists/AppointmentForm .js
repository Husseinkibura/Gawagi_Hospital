// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AppointmentForm = () => {
//   const [formData, setFormData] = useState({
//     patientId: '',
//     doctorId: '',
//     date: '',
//     time: '',
//   });
//   const [patients, setPatients] = useState([]);
//   const [doctors, setDoctors] = useState([]);

//   useEffect(() => {
//     // Fetch patients and doctors
//     const fetchUsers = async () => {
//       try {
//         const patientsResponse = await axios.get('http://localhost:5000/api/users/role/Patient');
//         const doctorsResponse = await axios.get('http://localhost:5000/api/users/role/Doctor');
//         setPatients(patientsResponse.data);
//         setDoctors(doctorsResponse.data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/appointments', formData);
//       alert('Appointment scheduled successfully!');
//       // Reset form after submission
//       setFormData({
//         patientId: '',
//         doctorId: '',
//         date: '',
//         time: '',
//       });
//     } catch (error) {
//       console.error('Error scheduling appointment:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
//       <h2 className="text-2xl font-bold mb-6">Schedule Appointment</h2>
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2">Patient</label>
//         <select
//           name="patientId"
//           value={formData.patientId}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         >
//           <option value="">Select Patient</option>
//           {patients.map((patient) => (
//             <option key={patient.id} value={patient.id}>
//               {patient.fullname}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2">Doctor</label>
//         <select
//           name="doctorId"
//           value={formData.doctorId}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         >
//           <option value="">Select Doctor</option>
//           {doctors.map((doctor) => (
//             <option key={doctor.id} value={doctor.id}>
//               {doctor.fullname}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2">Date</label>
//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2">Time</label>
//         <input
//           type="time"
//           name="time"
//           value={formData.time}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//       </div>
//       <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//         Schedule
//       </button>
//     </form>
//   );
// };

// export default AppointmentForm;