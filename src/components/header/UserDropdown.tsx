// src/components/UserInfoCard.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import BaseUrlLoader from "../../BaseUrlLoader";
import { X as XIcon } from "lucide-react"; // For close icon
// You can also import a settings icon or any additional icons if desired.

interface UserReadDto {
  email: string;
  name: string;
  branchId: number;
  role: string;
  branchName: string;
  roleName: string;
}

const UserInfoCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserReadDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const API_BASE_URL = BaseUrlLoader.API_BASE_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/user/UserById`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: UserReadDto = response.data;
        setUser(data);
        setFormData({ name: data.name, email: data.email, password: "" });
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [token, API_BASE_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      const updatedData: { name: string; email: string; password?: string } = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password.trim() !== "") {
        updatedData.password = formData.password;
      }
      await axios.put(`${API_BASE_URL}/user/UpdateUser`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setUser((prev) =>
        prev ? { ...prev, name: formData.name, email: formData.email } : null
      );
      closeDropdown();
      setFormData({ ...formData, password: "" });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/user/Logout`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("role");
      localStorage.removeItem("accessToken");
      // Optionally remove any other user-related data here
      navigate("/signin");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-4">
        <span className="text-gray-500">Loading...</span>
      </div>
    );

  if (!user)
    return (
      <p className="text-center text-gray-500">
        <Link to="/signin">Log In</Link>
      </p>
    );

  // Return initials if no user image is available
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 rounded-full p-2 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
          {getInitials(user.name)}
        </div>
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {user.name}
        </span>
        <motion.svg
          className={`w-5 h-5 transition-transform duration-200 dark:stroke-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-3">
              <span className="block font-medium text-gray-800 dark:text-gray-200">
                {user.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </span>
            </div>
            <ul className="flex flex-col gap-1 pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <li>
                <DropdownItem onItemClick={closeDropdown} tag="a" to="/profile">
                  Edit Profile
                </DropdownItem>
              </li>
              {/* Additional menu items can be added here */}
            </ul>
            <button
              onClick={handleLogout}
              className="mt-3 w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium transition-colors"
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserInfoCard;
