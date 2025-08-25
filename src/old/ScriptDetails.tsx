import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ScriptData } from "../types";
import BaseUrlLoader, { loadConfig } from "../BaseUrlLoader"; // Import the config and loader
import axiosInstance from "../api/axiosInstance";

const ScriptDetails: React.FC = () => {
  const { scriptcode } = useParams<{ scriptcode: string }>(); // Get script code from URL
  const [data, setData] = useState<ScriptData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadConfig(); // Ensure the config is loaded

        const baseUrl = BaseUrlLoader.API_BASE_URL; // Use the correct base URL
        const endpointUrl = `/drug/GetScriptByScriptCode?scriptCode=${scriptcode}`;

        const response = await axiosInstance.get(endpointUrl);

        if (Array.isArray(response.data)) {
          setData(response.data); // Ensure data is an array
          console.log(response.data);
        } else {
          setData([]); // Handle unexpected response format
        }
      } catch (err) {
        setError(
          "Access Denied. Sorry, you don’t have permission to view this page.\nPlease contact the system administrator if you believe this is an error."
        );
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scriptcode]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
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
    );
  if (!data.length) return <div>No data available.</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-100 p-6">
      <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">
        Script Details
      </h2>
      {data.map((script, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl border-2 border-blue-500 mb-6"
        >
          <table className="w-full border-collapse border border-blue-300 rounded-lg overflow-hidden">
            <tbody>
              {Object.entries({
                "Branch Name": script.branchName,
                "Drug Name": script.drugName,
                "Insurance Name": script.insuranceName,
                "Prescriber Name": script.prescriberName,
                "User Name": script.userName,
                PF: script.pf,
                Quantity: script.quantity,
                "Acquisition Cost": `$${script.acquisitionCost?.toFixed(2)}`,
                Discount: `$${script.discount?.toFixed(2)}`,
                "Insurance Payment": `$${script.insurancePayment?.toFixed(2)}`,
                "Patient Payment": `$${script.patientPayment?.toFixed(2)}`,
                "Net Profit": `$${script.netProfit?.toFixed(2)}`,
                "NDC Code": script.ndcCode,
              }).map(([key, value], idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-blue-100" : "bg-white"}
                >
                  <td className="py-3 px-4 font-medium text-blue-700 border border-blue-300">
                    {key}:
                  </td>
                  <td className="py-3 px-4 text-blue-900 border border-blue-300">
                    {value ?? "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ScriptDetails;
