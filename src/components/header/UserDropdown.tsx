import { useState, useEffect } from "react";
import axios from "axios";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link, useNavigate } from "react-router-dom";
import BaseUrlLoader from "../../BaseUrlLoader";
const API_BASE_URL = BaseUrlLoader.API_BASE_URL;

interface UserReadDto {
  email: string;
  name: string;
  branchId: number;
  role: string;
  branchName: string;
  roleName: string;
}


export default function UserInfoCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserReadDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const toggleDropdown = () => setIsOpen(!isOpen);
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
  }, [token]);

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

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("accessToken");
    // Optionally remove any other user-related data here
    navigate("/signin");
  };

  if (!user) return <p className="text-center text-gray-500"><a href="/signin" >Log In</a></p>;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="block mr-1 font-medium text-theme-sm">Welcome</span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
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
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {/* <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user.name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </span>
        </div> */}

        {/* <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem onItemClick={closeDropdown} tag="a" to="/profile">
              Edit Profile
            </DropdownItem>
          </li>
          
          <li>
            <DropdownItem onItemClick={closeDropdown} tag="a" to="/support">
              Support
            </DropdownItem>
          </li>
         
        </ul> */}

        {/* Updated Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 w-full text-left"
        >
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
