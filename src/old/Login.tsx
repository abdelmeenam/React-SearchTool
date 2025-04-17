import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail,Pill } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import BaseUrlLoader, { loadConfig } from "../BaseUrlLoader"; // Import the config and loader
import { SignInForm } from '.././components/auth/SignInForm';
import axiosInstance from "../api/axiosInstance";

await loadConfig();
const baseUrl = BaseUrlLoader.API_BASE_URL;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = `/user/login`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axiosInstance.post(
        API_URL,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { accessToken, role } = response.data;
        // Store access token securely
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("role", role);
      
        window.location.reload();
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column (Form) */}
      <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 flex items-center justify-center p-8">
        <div className="max-w-sm w-full">
          {/* Animated Logo */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
          
          </motion.div>

          {/* Back to Dashboard (optional) */}
          <div className="mb-4">
            <a
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-150 text-sm"
            >
              ← Back to home
            </a>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Sign In
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
            Login to see your prescriptions and proceed to login
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-300 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <SignInForm />
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  required
                />
                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>

      {/* Right Column (Branding / Info) */}

     

{/* Right Column (Enhanced Branding / Info) */}
<div className="hidden md:flex md:w-1/2 items-center justify-center p-10 bg-gradient-to-br from-blue-900 to-blue-700 dark:from-blue-800 dark:to-blue-600">
  <div className="text-center text-white space-y-6">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex justify-center"
    >
      <Pill className="h-16 w-16" />
    </motion.div>
    <h3 className="text-3xl font-bold">medsearch</h3>
    <p className="text-base md:text-lg opacity-90">
      Your Guide For a Better Medication Experience
    </p>
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="mt-4"
    >
      <a
        href="/about"
        className="inline-block px-6 py-3 border border-white rounded-full text-white font-semibold hover:bg-white hover:text-blue-700 transition-colors duration-200"
      >
        Learn More
      </a>
    </motion.div>
  </div>
</div>




     
    </div>
  );
};

export default Login;
