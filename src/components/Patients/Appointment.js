import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientAppointment = () => {
  const [formData, setFormData] = useState({
    doctorName: '',
    date: '',
    time: '',
  });
  const [appointments, setAppointments] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Get the logged-in patient's ID (assuming it's stored in localStorage)
  const patientId = localStorage.getItem('patientId'); // Replace with your actual key

  // Fetch appointments for the logged-in patient
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientId) {
        toast.error('Patient ID not found. Please log in.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/appointments?patientId=${patientId}`);
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to fetch appointments.');
      }
    };

    fetchAppointments();
  }, [patientId]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId) {
      toast.error('Patient ID not found. Please log in.');
      return;
    }

    try {
      const appointmentData = {
        ...formData,
        patientId,
        status: 'Pending', // Default status for new appointments
      };

      const response = await axios.post('http://localhost:5000/api/appointments', appointmentData);

      // Show success toast
      toast.success('Appointment scheduled successfully!');

      // Update the appointments state with the new appointment
      setAppointments([...appointments, response.data]);

      // Clear the form
      setFormData({
        doctorName: '',
        date: '',
        time: '',
      });

      // Hide the form
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast.error('Failed to schedule appointment. Please try again.');
    }
  };

  // Check if an appointment is expired
  const isAppointmentExpired = (appointmentDate) => {
    const today = new Date();
    const appointment = new Date(appointmentDate);
    return appointment < today;
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

      <h2 className="text-2xl font-bold mb-6">My Appointments</h2>

      {/* Add Appointment Button */}
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
      >
        {isFormVisible ? 'Hide Form' : 'Add Appointment'}
      </button>

      {/* Appointment Form */}
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Doctor Name</label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => setIsFormVisible(false)}
              className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">S.No</th>
                <th className="py-2 px-4 border-b">Doctor Name</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Time</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{appointment.doctorName}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(appointment.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{appointment.time}</td>
                  <td className="py-2 px-4 border-b">
                    {appointment.status === 'Accepted' ? (
                      <span className="text-green-500">Accepted</span>
                    ) : appointment.status === 'Rejected' ? (
                      <span className="text-red-500">Rejected</span>
                    ) : isAppointmentExpired(appointment.date) ? (
                      <span className="text-red-500">Expired</span>
                    ) : (
                      <span className="text-blue-500">Pending</span>
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

export default PatientAppointment;