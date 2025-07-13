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
  const classVersion = localStorage.getItem("classType") || "ClassVersion1";
  // Destructure the parameter from the URL (e.g., /dashboard/:dashboardId)
  const { dashboardId } = useParams<{ dashboardId: string }>();
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
        let allData: DrugTransaction[] = [];
        let page = 1;
        let continueFetching = true;

        while (continueFetching) {
          const response = await axiosInstance.get(
            "/drug/GetAllLatestScriptsPaginated",
            {
              params: { pageNumber: page, pageSize, classVersion },
            }
          );
          const pageData: DrugTransaction[] = response.data;
          console.log(pageData);
          allData = [...allData, ...pageData];

          if (pageData.length < pageSize) {
            continueFetching = false;
          } else {
            page++;
          }
        }

        // Remove duplicates by ndcCode and scriptCode
        const distinctItems = Array.from(
          new Map(
            allData
              .map((item) => [`${item.ndcCode}_${item.scriptCode}`, item])
          ).values()
        );

        setData(distinctItems);
        setLoading(false);
      } catch (err) {
        setError(
          "Access Denied. Sorry, you don’t have permission to view this page.\nPlease contact the system administrator if you believe this is an error."
        );
        setLoading(false);
      }
    };

    setLoading(true);
    setError(null);
    fetchData();
  }, [classVersion, activeDashboard]);

  // Class Version Selector


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
      <main className="  sm:px-6 lg: py-8" role="main">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-blue-700">
            Pharmacy Dashboard
          </h1>
        </header>

        {/* Class Version Selector */}
        {/* <ClassVersionSelector /> */}

        {/* Loading/Error States */}
        {loading && (
          <section>
            <h2 className="sr-only">Loading State</h2>
            <p className="text-center text-gray-500">Loading data...</p>
          </section>
        )}
        {error && (
          <section
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto mb-6"
            role="alert"
          >
            <h2 className="sr-only">Error State</h2>
            <strong className="font-bold">Access Denied!</strong>
            <span className="block sm:inline">
              Sorry, you don’t have permission to view this page.
            </span>
            <br />
            <span className="block sm:inline">
              Please contact the system administrator if you believe this is an
              error.
            </span>
          </section>
        )}

        {/* Render the appropriate dashboard when data is ready */}
        {!loading && !error && (
          <section>
            <div>
              {activeDashboard === "1" && <Dashboard data={data} />}
              {activeDashboard === "2" && <SecondDashBoard data={data} />}
              {activeDashboard === "3" && <ThirdDashBoard data={data} />}
            </div>
          </section>
        )}
      </main>
    </motion.div>
  );
};

export default MainDashboard;
