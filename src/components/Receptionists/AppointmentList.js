import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppointmentList = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
  });
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/patients');
        const patientsWithNumbers = response.data.map((patient) => ({
          ...patient,
          id: Number(patient.PatientId), // Ensure ID is a number
        }));
        setPatients(patientsWithNumbers);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments');
        const appointmentsWithNumbers = response.data.map((appointment) => ({
          ...appointment,
          patientId: Number(appointment.patientId),
        }));
        setAppointments(appointmentsWithNumbers);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, []);

  // Fetch patient name when Patient ID is entered
  const handlePatientIdChange = async (e) => {
    const patientId = e.target.value;
    setFormData({ ...formData, patientId });

    if (patientId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/patients/${patientId}`);
        setFormData((prevData) => ({
          ...prevData,
          patientName: response.data.fullname,
        }));
      } catch (error) {
        console.error('Error fetching patient details:', error);
        setFormData((prevData) => ({
          ...prevData,
          patientName: '',
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        patientName: '',
      }));
    }
  };

  // Helper function to get patient name by ID
  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.PatientId === patientId); // Use PatientId
    return patient ? patient.fullname : 'Unknown Patient';
  };

  // Check if an appointment is expired
  const isAppointmentExpired = (appointmentDate) => {
    const today = new Date();
    const appointment = new Date(appointmentDate);
    return appointment < today;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/appointments', formData);
      
      // Show success toast
      toast.success('Appointment scheduled successfully!');

      // Update the appointments state with the new appointment
      setAppointments([...appointments, response.data]);

      // Clear the form
      setFormData({
        patientId: '',
        patientName: '',
        doctorName: '',
        date: '',
        time: '',
      });

      // Hide the form
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      
      // Show error toast
      toast.error('Failed to schedule appointment. Please try again.');
    }
  };

  // Mark an appointment as done
  const handleMarkAsDone = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/done`);
      
      // Update the local state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id ? { ...appointment, status: 'Done' } : appointment
        )
      );

      // Show success toast
      toast.success('Appointment marked as done!');
    } catch (error) {
      console.error('Error marking appointment as done:', error);
      
      // Show error toast
      toast.error('Failed to mark appointment as done. Please try again.');
    }
  };

  return (
    <div className="w-full mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Appointments</h2>

      {/* Add Appointment Button */}
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6 transition duration-300"
      >
        {isFormVisible ? 'Hide Form' : 'Add Appointment'}
      </button>

      {/* Appointment Form */}
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Patient ID</label>
              <input
                type="text"
                name="patientId"
                value={formData.patientId}
                onChange={handlePatientIdChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Doctor Name</label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => setIsFormVisible(false)}
              className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Schedule
            </button>
          </div>
        </form>
      )}

      {/* Appointments Table */}
      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left text-gray-700">S.No</th>
                <th className="py-3 px-4 border-b text-left text-gray-700">Patient ID</th>
                <th className="py-3 px-4 border-b text-left text-gray-700">Patient Name</th>
                <th className="py-3 px-4 border-b text-left text-gray-700">Doctor Name</th>
                <th className="py-3 px-4 border-b text-left text-gray-700">Date</th>
                <th className="py-3 px-4 border-b text-left text-gray-700">Time</th>
                <th className="py-3 px-4 border-b text-left text-gray-700">Status</th>
                <th className="py-3 px-4 border-b text-left text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={appointment.id} className="hover:bg-gray-50 transition duration-200">
                  <td className="py-3 px-4 border-b text-gray-700">{index + 1}</td>
                  <td className="py-3 px-4 border-b text-gray-700">{appointment.patientId}</td>
                  <td className="py-3 px-4 border-b text-gray-700">{getPatientName(appointment.patientId)}</td>
                  <td className="py-3 px-4 border-b text-gray-700">{appointment.doctorName}</td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {new Date(appointment.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">{appointment.time}</td>
                  <td className="py-3 px-4 border-b">
                    {appointment.status === 'Done' ? (
                      <span className="text-green-500">Done</span>
                    ) : isAppointmentExpired(appointment.date) ? (
                      <span className="text-red-500">Expired</span>
                    ) : (
                      <span className="text-blue-500">Scheduled</span>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {appointment.status !== 'Done' && !isAppointmentExpired(appointment.date) && (
                      <button
                        onClick={() => handleMarkAsDone(appointment.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-300"
                      >
                        Mark as Done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;