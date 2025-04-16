// src/components/UserInfoCard.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import BaseUrlLoader from "../../BaseUrlLoader";
import axiosInstance from "../../api/axiosInstance";
import { Edit2 as EditIcon, Eye as EyeIcon, EyeOff as EyeOffIcon } from "lucide-react"; // Using Edit2 for the pencil icon

interface UserReadDto {
  email: string;
  name: string;
  branchId: number;
  role: string;
  branchName: string;
  roleName: string;
}

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/;

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const token = localStorage.getItem("accessToken");
  const [user, setUser] = useState<UserReadDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = BaseUrlLoader.API_BASE_URL;

  // Form data for updating user info & password
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Toggle for password visibility (optional enhancement)
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // Local state for password validation messages
  const [passwordError, setPasswordError] = useState("");

  // Fetch user data on mount
  const fetchUserData = async () => {
    try {
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }
      const response = await axiosInstance.get(`${API_BASE_URL}/user/UserById`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: UserReadDto = response.data;
      setUser(data);
      setFormData((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
      }));
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    if (name === "newPassword" || name === "confirmPassword") {
      // Validate new password as the user types
      if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
        setPasswordError("New password and confirm password do not match.");
      } else if (formData.newPassword && !passwordRegex.test(formData.newPassword)) {
        setPasswordError(
          "Password must be at least 5 characters long and include letters, numbers, and symbols."
        );
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    // If updating password, ensure all fields are filled
    if (formData.oldPassword || formData.newPassword || formData.confirmPassword) {
      if (
        !formData.oldPassword.trim() ||
        !formData.newPassword.trim() ||
        !formData.confirmPassword.trim()
      ) {
        setError("All password fields are required.");
        return;
      }
      if (!passwordRegex.test(formData.newPassword)) {
        setError(
          "Password must be at least 5 characters long and include letters, numbers, and symbols."
        );
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }
    }

    try {
      // Validate the old password by attempting a login (if password is being updated)
      if (formData.newPassword.trim()) {
        const loginResponse = await axios.post(
          `${API_BASE_URL}/user/login`,
          { email: formData.email, password: formData.oldPassword },
          { withCredentials: true }
        );
        if (loginResponse.status !== 200) {
          setError("Wrong old password.");
          return;
        }
      }

      // Build update payload (conditionally include password)
      const updatedData: { name: string; email: string; password?: string } = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword.trim()) {
        updatedData.password = formData.newPassword;
      }

      await axios.put(`${API_BASE_URL}/user/UpdateUser`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setUser((prev) => (prev ? { ...prev, name: formData.name, email: formData.email } : null));
      // Using alert for now; consider using a toast notification system
      if (formData.newPassword.trim()) {
        alert("Password changed successfully.");
      } else {
        alert("User updated successfully.");
      }

      closeModal();
      // Reset password fields after submission
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Wrong password. Please try again!");
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
        User not found. <Link to="/signin">Log in</Link>
      </p>
    );

  // Get user initials for avatar fallback
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Personal Information Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
              {getInitials(user.name)}
            </div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Personal Information
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Name</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.name}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Branch</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.branchName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Role</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.roleName}
              </p>
            </div>
          </div>
        </div>
        {/* Edit Button */}
        <button
          onClick={openModal}
          className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:w-auto"
        >
          <EditIcon className="w-5 h-5" />
          <span>Edit Profile</span>
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Password Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Change Your Password
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Display error messages */}
            {error && (
              <div className="mb-4 text-red-500 text-sm font-medium">{error}</div>
            )}
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Uncomment these if you want to allow updating name and email:
                <div className="col-span-2">
                  <Label>Name</Label>
                  <Input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="col-span-2">
                  <Label>Email</Label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                */}
                <div className="col-span-2">
                  <Label>Old Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword.old ? "text" : "password"}
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                      aria-required="true"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({ ...prev, old: !prev.old }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {/* {showPassword.old ? (
                        <EyeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <EyeOffIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      )} */}
                    </button>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword.new ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      aria-required="true"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {/* {showPassword.new ? (
                        <EyeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <EyeOffIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      )} */}
                    </button>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      aria-required="true"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {/* {showPassword.confirm ? (
                        <EyeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <EyeOffIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      )} */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" disabled={!formData.oldPassword || !!error}>
                Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </Modal>
    </div>
  );
}
