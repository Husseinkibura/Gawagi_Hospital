import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments');
        const formattedAppointments = response.data.map(appointment => ({
          ...appointment,
          date: new Date(appointment.date).toISOString().split('T')[0],
          patientId: Number(appointment.patientId)
        }));
        setAppointments(formattedAppointments);
        setFilteredAppointments(formattedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
      }
    };
    fetchAppointments();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let results = appointments.filter(appointment => {
      const searchMatch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        appointment.patientId.toString().includes(searchTerm);

      const statusMatch = statusFilter === 'all' ? true :
                         statusFilter === 'completed' ? appointment.status === 'Done' :
                         statusFilter === 'expired' ? isAppointmentExpired(appointment.date) :
                         appointment.status === 'Scheduled';

      return searchMatch && statusMatch;
    });

    setFilteredAppointments(results);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, appointments]);

  const isAppointmentExpired = (dateString) => {
    const appointmentDate = new Date(dateString);
    const today = new Date();
    return appointmentDate < today.setHours(0, 0, 0, 0);
  };

  const handleMarkAsDone = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/done`);
      setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status: 'Done' } : app
      ));
      toast.success('Appointment marked as completed');
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const StatusBadge = ({ status, date }) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    
    if (status === 'Done') {
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
    }
    if (isAppointmentExpired(date)) {
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Expired</span>;
    }
    return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Scheduled</span>;
  };

  return (
    <div className="w-full mx-auto p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mt-5">My Appointments</h1>
            <p className="text-gray-600 mt-1">Manage and track patient appointments</p>
          </div>
          
          {/* Controls Section */}
          <div className="w-full lg:w-auto flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                className="w-5 h-5 absolute left-3 top-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full lg:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Appointments</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase">Patient</th>
    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase">Doctor</th>
    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase">Date & Time</th>
    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase">Status</th>
    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              {/* Table Body */}
<tbody className="bg-white divide-y divide-gray-200">
  {currentAppointments.map((appointment) => (
    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
      {/* Patient Column */}
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-base font-medium text-gray-900">{appointment.patientName}</div>
            <div className="text-sm text-gray-500">ID: {appointment.patientId}</div>
          </div>
        </div>
      </td>

      {/* Doctor Column */}
      <td className="px-6 py-4">
        <div className="text-base text-gray-900">{appointment.doctorName}</div>
        <div className="text-sm text-gray-500">ID: {appointment.doctorId}</div>
      </td>

      {/* Date/Time Column */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {new Date(appointment.date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
        <div className="text-sm text-gray-500">{appointment.time}</div>
      </td>

      {/* Status Column */}
      <td className="px-6 py-4">
        <StatusBadge status={appointment.status} date={appointment.date} />
      </td>

      {/* Actions Column */}
      <td className="px-6 py-4">
        {appointment.status !== 'Done' && !isAppointmentExpired(appointment.date) && (
          <button
            onClick={() => handleMarkAsDone(appointment.id)}
            className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Mark Completed
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>

          {/* Empty State */}
          {currentAppointments.length === 0 && (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filteredAppointments.length === 0
                  ? 'No appointments scheduled yet'
                  : 'No appointments match your current filters'}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredAppointments.length)}
              </span>{' '}
              of <span className="font-medium">{filteredAppointments.length}</span> results
            </div>

            <div className="flex items-center gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="pl-2 pr-8 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>

              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;