import axios from "axios";
import BaseUrlLoader, { loadConfig } from "./BaseUrlLoader";

// Load configuration first (if applicable)
await loadConfig();

const API_BASE_URL = BaseUrlLoader.API_BASE_URL;
const Base_API = `${API_BASE_URL}/user`;

// Create an Axios instance with credentials enabled (cookies will be sent automatically)
const axiosInstance = axios.create({
  baseURL: Base_API,
  withCredentials: true,
});

export default async function Auth() {
  console.log("Checking token validity...");
  return await ValidateAccessToken();
}

async function ValidateAccessToken() {
  const API_URL = `${Base_API}/token-test`;
  const BEARER_TOKEN = localStorage.getItem("accessToken");

  try {
    console.log("Validating access token...");
    await axiosInstance.get(API_URL, {
      headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
    });
    return true;
  } catch (error) {
    console.log("Access token validation failed. Attempting refresh...", error);
    return await ValidateRefreshToken();
  }
}

async function ValidateRefreshToken() {
  try {
    console.log("Refreshing token...");
    // POST to the refresh endpoint (refresh token is sent via cookie)
    const response = await axiosInstance.post("/access-token");
    // Update the access token in localStorage
    localStorage.setItem("accessToken", response.data.accessToken);
    return true;
  } catch (error) {
    console.log("Refresh token failed, logging out...", error);
    localStorage.removeItem("role");
    localStorage.removeItem("accessToken");
    return false;
  }
}
