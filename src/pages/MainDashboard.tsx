import React, { useEffect, useState } from "react";
import {
  BarChart3,
  AlertTriangle,
  PieChart,
  Pill,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { DrugTransaction } from "../types";
import { motion } from "framer-motion";
import { CSVLink } from "react-csv";
import Dashboard from "./Dashboard";
import SecondDashBoard from "./SecondDashBoard";
import ThirdDashBoard from "./ThirdDashBoard";
export const MainDashboard: React.FC = () => {
  const [activeDashboard, setActiveDashboard] = useState("Dashboard");
  const Button = ({ children, onClick }) => (
    <button
      onClick={onClick}
      className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
    >
      {children}
    </button>
  );
  return (
    <motion.div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
          Pharmacy Dashboard
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={() => setActiveDashboard("Dashboard")}>
            All Scripts Audit
          </Button>
          <Button onClick={() => setActiveDashboard("SecondDashBoard")}>
            Matching Scripts Audit
          </Button>
          <Button onClick={() => setActiveDashboard("ThirdDashBoard")}>
            Mismatching Scripts Audit{" "}
          </Button>
        </div>

        <div>
          {activeDashboard === "Dashboard" && <Dashboard />}
          {activeDashboard === "SecondDashBoard" && <SecondDashBoard />}
          {activeDashboard === "ThirdDashBoard" && <ThirdDashBoard />}
        </div>
      </div>
    </motion.div>
  );
};

export default MainDashboard;
function normalizePrescriber(prescriber: string): any {
  throw new Error("Function not implemented.");
}
