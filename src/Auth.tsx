import axios from "axios";
import { useNavigate } from "react-router-dom";
import BaseUrlLoader, { loadConfig } from "./BaseUrlLoader"; // Import the config and loader

await loadConfig();

const API_BASE_URL = BaseUrlLoader.API_BASE_URL;
const Base_API = `${API_BASE_URL}/user`;

// Axios instance with credentials enabled
const axiosInstance = axios.create({
  baseURL: Base_API,
  withCredentials: true, // Ensures cookies are sent with requests
});

export default async function Auth() {
  console.log("here",);
  return await ValidateAccessToken();
}

async function ValidateAccessToken() {
  const API_URL = `${Base_API}/token-test`;
  const BEARER_TOKEN = localStorage.getItem("accessToken");

  try {
    console.log("here2");

    await axiosInstance.get(API_URL, {
      headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
    });
    return true;
  } catch (error) {
    console.log(error);
    return await ValidateRefreshToken();
  }
}

async function ValidateRefreshToken() {
  try {
    console.log("here3");

    // No need to send RefreshToken manually; the browser will handle it via cookies
    const response = await axiosInstance.post("/access-token");

    // Store only the Access Token in localStorage
    // console.log(response.data.accessToken);
    localStorage.setItem("accessToken", response.data.accessToken);

    return true;
  } catch (error) {
    console.log("Refresh failed, logging out...");
    localStorage.removeItem("role");
    localStorage.removeItem("accessToken");
    return false;
  }
}
