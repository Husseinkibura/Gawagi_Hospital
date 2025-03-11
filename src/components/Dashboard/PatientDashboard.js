import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const PatientDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-6">Patient Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Appointments</h2>
                    <p>Upcoming checkups and past visits.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Medical Records</h2>
                    <p>Access your health records and prescriptions.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Billing</h2>
                    <p>View your invoices and payment history.</p>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;