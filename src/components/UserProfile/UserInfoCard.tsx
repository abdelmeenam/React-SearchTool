import axios from "axios";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import BaseUrlLoader from "../../BaseUrlLoader";
import axiosInstance from "../../api/axiosInstance";

interface UserReadDto {
  email: string;
  name: string;
  branchId: number;
  role: string;
  branchName: string;
  roleName: string;
}

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const token = localStorage.getItem("accessToken");
  const [user, setUser] = useState<UserReadDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const API_BASE_URL = BaseUrlLoader.API_BASE_URL;

  // Fetch user data on mount
  const fetchUserData = async () => {
    try {
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await axiosInstance.get(`/user/UserById`);
      const data: UserReadDto = response.data;
      setUser(data);
      // Prepopulate form data with user name and email
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

  // Update input state on change and clear error message when the user starts typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Form submit handler with empty field check and error message display
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error messages

    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    // Check if any password field is empty
    if (
      !formData.oldPassword.trim() ||
      !formData.newPassword.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError("All password fields are required.");
      return;
    }

    // Password requirements: minimum length 5, at least one letter, one number, and one symbol
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/;
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

    try {
      // Validate the old password by attempting a login
      const loginResponse = await axios.post(
        `${API_BASE_URL}/user/login`,
        { email: formData.email, password: formData.oldPassword },
        { withCredentials: true }
      );
      if (loginResponse.status !== 200) {
        setError("Wrong old password.");
        return;
      }

      // Build the update payload
      const updatedData: { name: string; email: string; password?: string } = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.newPassword.trim()) {
        updatedData.password = formData.newPassword;
      }

      // Send update request to the server
      await axios.put(`${API_BASE_URL}/user/UpdateUser`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the local user state
      setUser((prev) =>
        prev ? { ...prev, name: formData.name, email: formData.email } : null
      );

      // Optionally, you can add a success message here or use an alert
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

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Loading...</p>;
  if (!user)
    return <p className="text-center text-gray-500">User not found</p>;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.name}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Branch
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.branchName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Role
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.roleName}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={openModal}
          className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
            />
          </svg>
          Edit
        </button>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Password Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Change Your Password
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Error Message Display */}
            {error && (
              <div className="mb-4 text-red-500 text-sm font-medium">
                {error}
              </div>
            )}
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Uncomment these lines if you want to allow updating name and email:
                  <div className="col-span-2">
                    <Label>Name</Label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                */}
                <div className="col-span-2">
                  <Label>Old Password</Label>
                  <Input
                    type="password"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    aria-required="true"

                  />
                </div>
                <div className="col-span-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    aria-required="true"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    aria-required="true"
                    
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm">Save Changes</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
