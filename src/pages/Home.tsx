import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
const isAuthenticated = localStorage.getItem("role");
export const Home: React.FC = () => {
  return (
    <motion.div>
      <div className="bg-gradient-to-r from-green-400 to-blue-500 min-h-screen flex flex-col items-center justify-center text-white">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold drop-shadow-lg">
            Welcome to PharmaCare
          </h1>
          <p className="mt-4 text-lg font-medium">
            Your trusted partner for finding medicines and insurance coverage.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <Link
            to="/search"
            className="block bg-white text-blue-600 rounded-lg shadow-lg p-6 hover:bg-blue-100 transition-transform transform hover:-translate-y-1"
          >
            <h2 className="text-2xl font-bold mb-2">Search for Medicines</h2>
            <p className="text-gray-700">
              Find the medicine you need, compare prices, and check insurance
              compatibility.
            </p>
          </Link>

          <Link
            to="/upload"
            className="block bg-white text-green-600 rounded-lg shadow-lg p-6 hover:bg-green-100 transition-transform transform hover:-translate-y-1"
          >
            <h2 className="text-2xl font-bold mb-2">Upload Prescriptions</h2>
            <p className="text-gray-700">
              Securely upload your prescription to find compatible drugs and
              services.
            </p>
          </Link>

          {isAuthenticated==="admin" && (
            <Link
              to="/dashboard"
              className="block bg-white text-purple-600 rounded-lg shadow-lg p-6 hover:bg-purple-100 transition-transform transform hover:-translate-y-1"
            >
              <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
              <p className="text-gray-700">
                Manage your profile, view saved searches, and access your
                history.
              </p>
            </Link>
          )}

          {!isAuthenticated && (
            <Link
              to="/login"
              className="block bg-white text-red-600 rounded-lg shadow-lg p-6 hover:bg-red-100 transition-transform transform hover:-translate-y-1"
            >
              <h2 className="text-2xl font-bold mb-2">Login</h2>
              <p className="text-gray-700">
                Access your account to unlock personalized features.
              </p>
            </Link>
          )}
        </div>

        <footer className="mt-12 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} PharmaCare. All rights reserved.
          </p>
        </footer>
      </div>
    </motion.div>
  );
};
