import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  Pill,
  Search,
  LogOut,
  BarChart2,
  Upload,
  Sun,
  Moon,
  LogIn,
  FileText,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const isAuthenticated = localStorage.getItem("role");

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isLoggedIn = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email")
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {isAuthenticated && (
                <Link
                  to="/"
                  className="flex items-center space-x-2 hover:scale-105 transition-transform"
                >
                  <Pill className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    MedSearch
                  </span>
                </Link>
              )}
            </div>
            <div className="flex items-center space-x-6">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/search"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-transform"
                  >
                    <Search className="h-5 w-5" />{" "}
                    <span className="font-medium">Search</span>
                  </Link>
                  {/* <Link
                    to="/upload"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-transform"
                  >
                    <Upload className="h-5 w-5" />{" "}
                    <span className="font-medium">Upload</span>
                  </Link> */}
                  {/* <Link
                    to="/logs"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-transform"
                  >
                    <FileText className="h-5 w-5" />{" "}
                    <span className="font-medium">Logs</span>
                  </Link> */}
                  {isLoggedIn === "admin" && (
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-transform"
                    >
                      {/* You can add an icon or some content here */}
                      <span>Dashboard</span>
                    </Link>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    onClick={toggleTheme}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-transform"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-transform"
                  >
                    <LogOut className="h-5 w-5" />{" "}
                    <span className="font-medium">Logout</span>
                  </motion.button>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-transform"
                  >
                    <LogIn className="h-5 w-5" />{" "}
                    <span className="font-medium">Log In</span>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};
