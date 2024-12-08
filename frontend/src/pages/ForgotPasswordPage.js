import React, { useState } from 'react';
import { Mail, Check, ArrowLeft } from 'lucide-react';
import axios from '../axios';
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        // Make API call to test connection
        const response = await axios.get('http:///127.0.0.1:5000', {
          headers: {
            'Content-Type': 'application/json', 
          },
        });
      
        // Display the response for debugging purposes
        alert(`Response received: ${JSON.stringify(response.data)}`);
      
        // Set submitted state to true if the response indicates success
        setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data.message || 'An error occurred');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error processing your request');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoBack = () => {
    // Use React Router navigation instead of this placeholder
    // history.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
        {!isSubmitted ? (
          <>
            <div className="text-center">
              <img className="mx-auto mb-4" src={require('../images/logo-with-txt.png')} style={{ width: '175px'}}/>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Forgot Password</h2>
              <p className="text-gray-500 mb-6">
                Enter the email address associated with your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  {error}
                </div>
              )}

              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full flex justify-center items-center py-2 px-4 border border-transparent 
                  rounded-lg shadow-sm text-sm font-medium text-white 
                  ${isLoading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  transition-colors duration-300
                `}
              >
                {isLoading ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  'Reset Password'
                )}
              </button>

              <button
                type="button"
                onClick={handleGoBack}
                className="w-full flex justify-center items-center text-sm text-gray-600 hover:text-gray-800 mt-4"
              >
                <ArrowLeft className="mr-2" size={16} />
                Back to Login
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Check className="text-green-600" size={48} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Password Reset Email Sent
            </h2>

            <p className="text-gray-600">
              We've sent a password reset link to <strong>{email}</strong>. 
              Check your email and follow the instructions to reset your password.
            </p>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setError(null);
                }}
                className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Try Another Email
              </button>

              <button
                onClick={handleGoBack}
                className="w-full py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;