import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const socket = io('http://localhost:5000'); // Connect to the backend

// Set app element for react-modal (required for accessibility)
Modal.setAppElement('#root');

const PatientFeedback = () => {
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientMobile, setPatientMobile] = useState('');
  const [satisfaction, setSatisfaction] = useState('');
  const [improvements, setImprovements] = useState([]);
  const [comment, setComment] = useState('');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false); // State for chat modal
  const [message, setMessage] = useState(''); // State for chat message
  const [chatMessages, setChatMessages] = useState([]); // State for chat messages

  // Fetch patient details when Patient ID is entered
  useEffect(() => {
    if (patientId) {
      fetchPatientDetails(patientId);
    } else {
      // Reset patient details if Patient ID is cleared
      setPatientName('');
      setPatientMobile('');
    }
  }, [patientId]);

  // Fetch patient details from the backend
  const fetchPatientDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPatientName(data.fullname);
        setPatientMobile(data.mobile);
      } else {
        console.error('Failed to fetch patient details');
        setPatientName('');
        setPatientMobile('');
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
      setPatientName('');
      setPatientMobile('');
    }
  };

  // Handle satisfaction selection
  const handleSatisfactionChange = (e) => {
    setSatisfaction(e.target.value);
  };

  // Handle improvement selection
  const handleImprovementChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setImprovements([...improvements, value]);
    } else {
      setImprovements(improvements.filter((item) => item !== value));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare feedback data
    const feedbackData = {
      patientId,
      satisfaction,
      improvements,
      comment,
    };

    try {
      // Send feedback to the backend
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Feedback submitted successfully:', result);

        // Emit the feedback to the backend via Socket.IO
        socket.emit('submitFeedback', feedbackData);

        // Show success message using Toastr
        toast.success('Thank you for your feedback! We appreciate your time.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Reset form
        setPatientId('');
        setPatientName('');
        setPatientMobile('');
        setSatisfaction('');
        setImprovements([]);
        setComment('');
      } else {
        console.error('Failed to submit feedback:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  // Open chat modal
  const openChatModal = () => {
    setIsChatModalOpen(true);
  };

  // Close chat modal
  const closeChatModal = () => {
    setIsChatModalOpen(false);
  };

  // Handle sending chat messages
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender: 'patient',
        text: message,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessage('');
      // Emit the message to the backend via Socket.IO
      socket.emit('sendMessage', newMessage);
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-full xl:max-w-7xl mt-5">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">
            Patient Feedback and Suggestions
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            We value your opinion and would like to hear about your experience with our services. Your feedback will help us improve and provide better care for our patients.
          </p>
        </div>

        {/* Patient Details Section */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-100 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID
              </label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter Patient ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name
              </label>
              <input
                type="text"
                value={patientName}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Patient Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile
              </label>
              <input
                type="text"
                value={patientMobile}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Mobile"
              />
            </div>
          </div>
        </div>

        {/* Horizontal Cards for Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Card 1: Communication */}
          <div className="bg-indigo-50 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-indigo-100">
            <h3 className="text-lg font-medium text-indigo-700 mb-2">Communication</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              How well did our staff communicate with you? Let us know if there were any language barriers or misunderstandings.
            </p>
          </div>

          {/* Card 2: Wait Times */}
          <div className="bg-green-50 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <h3 className="text-lg font-medium text-green-700 mb-2">Wait Times</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Were you satisfied with the waiting time? We aim to minimize delays and improve efficiency.
            </p>
          </div>

          {/* Card 3: Environment */}
          <div className="bg-yellow-50 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-yellow-100">
            <h3 className="text-lg font-medium text-yellow-700 mb-2">Environment</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              How comfortable was the service environment? Your feedback helps us create a better experience.
            </p>
          </div>

          {/* Card 4: Medication Availability */}
          <div className="bg-red-50 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-red-100">
            <h3 className="text-lg font-medium text-red-700 mb-2">Medication</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Were all prescribed medicines available? Let us know if there were any shortages.
            </p>
          </div>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Satisfaction Section */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-100">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              How would you rate the quality of care you received?
            </label>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {['Excellent', 'Good', 'Fair', 'Poor'].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 bg-white p-2 sm:p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <input
                    type="radio"
                    name="satisfaction"
                    value={option}
                    checked={satisfaction === option}
                    onChange={handleSatisfactionChange}
                    className="form-radio h-4 w-4 sm:h-5 sm:w-5 text-indigo-600"
                  />
                  <span className="text-sm sm:text-base text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Improvements Section */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-100">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              What can we do to improve our services?
            </label>
            <div className="space-y-2">
              {[
                'Improve communication with staff',
                'Reduce wait times',
                'Enhance the overall patient experience',
                'Increase availability of services',
              ].map((improvement) => (
                <label
                  key={improvement}
                  className="flex items-center space-x-2 bg-white p-2 sm:p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="improvements"
                    value={improvement}
                    checked={improvements.includes(improvement)}
                    onChange={handleImprovementChange}
                    className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-indigo-600"
                  />
                  <span className="text-sm sm:text-base text-gray-700">{improvement}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Comment Section */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-100">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Do you have any additional comments or suggestions?
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Please share your thoughts..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
              rows="4"
            />
          </div>

          {/* Submit and Chat Buttons */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-6 py-2 sm:px-8 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm sm:text-base font-medium"
            >
              Submit Your Feedback
            </button>
            <button
              type="button"
              onClick={openChatModal}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm sm:text-base font-medium"
            >
              Chat with Admin
            </button>
          </div>
        </form>
      </div>

      {/* Chat Modal */}
      <Modal
        isOpen={isChatModalOpen}
        onRequestClose={closeChatModal}
        contentLabel="Chat with Admin"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Chat with Admin</h2>
          <div className="h-64 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.sender === 'patient' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === 'patient'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {msg.text}
                </span>
                <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Send
            </button>
          </div>
        </div>
      </Modal>

      {/* Toastr Container */}
      <ToastContainer />
    </div>
  );
};

export default PatientFeedback;