import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  Pill,
  Search,
  LogOut,
  Sun,
  Moon,
  LogIn,
  // Import hamburger and close icons from lucide-react
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const isAuthenticated = localStorage.getItem("role");

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isLoggedIn = localStorage.getItem("role");

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  const renderNavLinks = () => {
    if (isLoggedIn) {
      return (
        <>
          <Link
            to="/search"
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-transform"
          >
            <Search className="h-5 w-5" />
            <span className="font-medium">Search</span>
          </Link>
          {isLoggedIn === "Admin" && (
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-transform"
            >
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
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </>
      );
    } else {
      return (
        <motion.div whileHover={{ scale: 1.1 }}>
          <Link
            to="/login"
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-transform"
          >
            <LogIn className="h-5 w-5" />
            <span className="font-medium">Log In</span>
          </Link>
        </motion.div>
      );
    }
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
          <div className="flex justify-between h-16 items-center">
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
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {renderNavLinks()}
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-transform focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-800 shadow-md"
          >
            <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
              {renderNavLinks()}
            </div>
          </motion.div>
        )}
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
