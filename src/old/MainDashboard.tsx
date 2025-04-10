import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DrugTransaction } from "../types";
import Dashboard from "./Dashboard";
import SecondDashBoard from "./SecondDashBoard";
import ThirdDashBoard from "./ThirdDashBoard";
import BaseUrlLoader, { loadConfig } from "../BaseUrlLoader";
import {
  Pill,
  AlertTriangle,
  BarChart3,
  PieChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useParams } from "react-router";
import axiosInstance from "../api/axiosInstance"; // Import the customized axios instance

// Ensure configuration is loaded before making API calls
await loadConfig();
// The BaseUrlLoader.API_BASE_URL is already used inside axiosInstance,
// so there's no need to refer to it again here.

export const MainDashboard: React.FC = () => {
  // Destructure the parameter from the URL (e.g., /dashboard/:dashboardId)
  const { dashboardId } = useParams<{ dashboardId: string }>();
  console.log(dashboardId);

  // Initialize activeDashboard state with the URL parameter or default to "1"
  const [activeDashboard, setActiveDashboard] = useState(dashboardId || "1");
  const [data, setData] = useState<DrugTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update activeDashboard if the dashboardId URL parameter changes
  useEffect(() => {
    if (dashboardId) {
      setActiveDashboard(dashboardId);
    }
  }, [dashboardId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Clear any previous selections
        localStorage.removeItem("selectedRx");
        localStorage.removeItem("selectedPcn");
        localStorage.removeItem("selectedBin");

        const pageSize = 3000;
        // Fetch the first page (initial data set)
        const firstResponse = await axiosInstance.get(
          "/drug/GetAllLatestScriptsPaginated",
          {
            params: { pageNumber: 1, pageSize },
          }
        );
        console.log(firstResponse.data);
        const initialData: DrugTransaction[] = firstResponse.data;
        setData(initialData);
        // Set loading to false after initial data is ready for render
        setLoading(false);

        // Asynchronously load remaining pages after the initial render
        let page = 2;
        let continueFetching = true;
        while (continueFetching) {
          const response = await axiosInstance.get(
            "/drug/GetAllLatestScriptsPaginated",
            {
              params: { pageNumber: page, pageSize },
            }
          );
          console.log("page:", page);
          const pageData: DrugTransaction[] = response.data;
          // Append additional data and filter out duplicates (by ndcCode and scriptCode)
          setData((prevData) => {
            const combined = [...prevData, ...pageData];
            const distinctItems = Array.from(
              new Map(
                combined.map((item) => [
                  `${item.ndcCode}_${item.scriptCode}`,
                  item,
                ])
              ).values()
            );
            return distinctItems;
          });

          if (pageData.length < pageSize) {
            continueFetching = false;
          } else {
            page++;
          }
        }
      } catch (err) {
        setError(
          "Access Denied. Sorry, you don’t have permission to view this page.\nPlease contact the system administrator if you believe this is an error."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Enhanced Responsive Button Component
  const ResponsiveButton = ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <motion.button
      whileHover={{
        scale: 1.1,
        boxShadow: "0px 8px 20px rgba(59, 130, 246, 0.4)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="w-full sm:w-auto px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200"
    >
      {children}
    </motion.button>
  );

  return (
    <motion.div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
          Pharmacy Dashboard
        </h1>

        {/* Loading/Error States */}
        {loading && (
          <p className="text-center text-gray-500">Loading data...</p>
        )}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto mb-6"
            role="alert"
          >
            <strong className="font-bold">Access Denied!</strong>
            <span className="block sm:inline">
              {" "}
              Sorry, you don’t have permission to view this page.
            </span>
            <br />
            <span className="block sm:inline">
              Please contact the system administrator if you believe this is an
              error.
            </span>
          </div>
        )}

        {/* Render the appropriate dashboard when data is ready */}
        {!loading && !error && (
          <div>
            {activeDashboard === "1" && <Dashboard data={data} />}
            {activeDashboard === "2" && <SecondDashBoard data={data} />}
            {activeDashboard === "3" && <ThirdDashBoard data={data} />}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MainDashboard;
