import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface UserReadDto {
  email: string;
  name: string;
  branchId: number;
  role: string;
  branchName: string;
  roleName: string;
}
const API_BASE_URL = "http://localhost:5107";

export const ProfilePage: React.FC = () => {
  const token = localStorage.getItem("accessToken"); // Assuming token is stored in localStorage
  const [user, setUser] = useState<UserReadDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchUserData = async () => {
    try {
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/user/UserById`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        console.log(response.data);

      const data: UserReadDto = response.data;
      setUser(data);
      setFormData({ name: data.name, email: data.email, password: "" });
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Call the function inside useEffect
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      if (!token) {
        console.error("No token found");
        return;
      }
  
      // Construct the payload dynamically to avoid sending an empty password
      const updatedData: { name: string; email: string; password?: string } = {
        name: formData.name,
        email: formData.email,
      };
  
      if (formData.password.trim() !== "") {
        updatedData.password = formData.password; // Include password only if it's provided
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
      setIsEditing(false);
      setFormData({ ...formData, password: "" }); // Reset password field after submission
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  

  if (loading) return <p>Loading...</p>;

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "400px",
        margin: "auto",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
      >
        Profile
      </h2>
      {user ? (
        <div style={{ fontSize: "16px" }}>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Branch:</strong> {user.branchName}
          </p>
          <p>
            <strong>Role:</strong> {user.roleName}
          </p>
        </div>
      ) : (
        <p>User not found</p>
      )}
      <button
        onClick={() => setIsEditing(true)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Edit Profile
      </button>
      <Link
        to="/"
        style={{
          display: "block",
          marginTop: "10px",
          color: "#007bff",
          textDecoration: "none",
        }}
      >
        Go back home
      </Link>

      {isEditing && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
            Edit Profile
          </h3>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};
