import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { format, parseISO } from 'date-fns';

const socket = io('http://localhost:5000'); // Connect to the backend

const AllFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filter, setFilter] = useState('unread'); // Default filter is 'unread'

  // Fetch all feedback on component mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  // Listen for new feedback in real-time
  useEffect(() => {
    socket.on('newFeedback', (newFeedback) => {
      setFeedbackList((prevFeedback) => [newFeedback, ...prevFeedback]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('newFeedback');
    };
  }, []);

  // Fetch all feedback from the backend
  const fetchFeedback = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/feedback');
      if (response.ok) {
        const data = await response.json();
        setFeedbackList(data);
      } else {
        console.error('Failed to fetch feedback');
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  // Mark feedback as read
  const markAsRead = async (feedbackId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/feedback/${feedbackId}/mark-as-read`,
        {
          method: 'PUT',
        }
      );
      if (response.ok) {
        // Update the feedback list locally
        setFeedbackList((prevFeedback) =>
          prevFeedback.map((feedback) =>
            feedback.id === feedbackId ? { ...feedback, status: 'read' } : feedback
          )
        );
      } else {
        console.error('Failed to mark feedback as read');
      }
    } catch (error) {
      console.error('Error marking feedback as read:', error);
    }
  };

  // Delete feedback
  const deleteFeedback = async (feedbackId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/feedback/${feedbackId}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        // Remove the feedback from the list
        setFeedbackList((prevFeedback) =>
          prevFeedback.filter((feedback) => feedback.id !== feedbackId)
        );
      } else {
        console.error('Failed to delete feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  // Filter feedback based on status
  const filteredFeedback = feedbackList.filter((feedback) => {
    if (filter === 'all') return true;
    return feedback.status === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 mt-5">
      <div className="bg-white p-6 rounded-2xl shadow-2xl">
        <h1 className="text-2xl sm:text-xl font-semibold text-gray-800 mb-6">
          Patient Feedback
        </h1>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'unread'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'read'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Read
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {filteredFeedback.map((feedback) => (
            <div
              key={feedback.id}
              className={`bg-gray-50 p-4 sm:p-6 rounded-xl border ${
                feedback.status === 'unread'
                  ? 'border-indigo-300'
                  : 'border-gray-100'
              }`}
            >
              {/* Patient Details */}
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-700 mb-2">
                  Patient Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Patient ID:</span>{' '}
                      {feedback.patient_id || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Name:</span>{' '}
                      {feedback.fullname || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Mobile:</span>{' '}
                      {feedback.mobile || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feedback Details */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm font-semibold ${
                      feedback.satisfaction === 'Excellent'
                        ? 'text-green-600'
                        : feedback.satisfaction === 'Good'
                        ? 'text-blue-600'
                        : feedback.satisfaction === 'Fair'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {feedback.satisfaction}
                  </span>
                  {feedback.status === 'unread' && (
                    <button
                      onClick={() => markAsRead(feedback.id)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
                <button
                  onClick={() => deleteFeedback(feedback.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>

              {/* Submission Time */}
              <div className="text-sm text-gray-600 mb-4">
                <p className="font-medium">Submitted on:</p>
                <p>
                  {feedback.created_at
                    ? format(parseISO(feedback.created_at), 'MMMM d, yyyy h:mm a')
                    : 'N/A'}
                </p>
              </div>

              {/* Improvements Suggested */}
              <div className="text-sm text-gray-600 mb-4">
                <p className="font-medium">Improvements Suggested:</p>
                <ul className="list-disc list-inside">
                  {feedback.improvements && feedback.improvements.length > 0 ? (
                    feedback.improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))
                  ) : (
                    <li>No improvements suggested</li>
                  )}
                </ul>
              </div>

              {/* Comment */}
              <div className="text-sm text-gray-600">
                <p className="font-medium">Comment:</p>
                <p>{feedback.comment || 'No additional comments'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllFeedback;