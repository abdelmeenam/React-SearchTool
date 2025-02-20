import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Insurance } from "../types"; // Ensure your Insurance interface is defined with these properties

const InsuranceDetails: React.FC = () => {
  const { insuranceName } = useParams<{ insuranceName: string }>();
  const [insurance, setInsurance] = useState<Insurance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpointUrl = `https://api.medisearchtool.com/drug/GetInsuranceDetails?shortName=${insuranceName}`;
        const response = await axios.get(endpointUrl);
        setInsurance(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch insurance details");
        setLoading(false);
      }
    };

    fetchData();
  }, [insuranceName]);

  // Helper to display a value or "NA" if the value is null/empty.
  const displayValue = (value: any): string =>
    value === null || value === undefined || value === "" ? "NA" : value.toString();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!insurance) return <div>No insurance details available.</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-100 p-6">
      <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">
        Insurance Details
      </h2>
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl border-2 border-blue-500 mb-6">
        <table className="w-full border-collapse border border-blue-300 rounded-lg overflow-hidden">
          <tbody>
            <tr className="bg-blue-100">
              <td className="py-3 px-4 font-medium text-blue-700 border border-blue-300">
                ID:
              </td>
              <td className="py-3 px-4 text-blue-900 border border-blue-300">
                {displayValue(insurance.id)}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="py-3 px-4 font-medium text-blue-700 border border-blue-300">
                Name:
              </td>
              <td className="py-3 px-4 text-blue-900 border border-blue-300">
                {displayValue(insurance.name)}
              </td>
            </tr>
            <tr className="bg-blue-100">
              <td className="py-3 px-4 font-medium text-blue-700 border border-blue-300">
                Description:
              </td>
              <td className="py-3 px-4 text-blue-900 border border-blue-300">
                {displayValue(insurance.description)}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="py-3 px-4 font-medium text-blue-700 border border-blue-300">
                BIN:
              </td>
              <td className="py-3 px-4 text-blue-900 border border-blue-300">
                {displayValue(insurance.bin)}
              </td>
            </tr>
            <tr className="bg-blue-100">
              <td className="py-3 px-4 font-medium text-blue-700 border border-blue-300">
                PCN:
              </td>
              <td className="py-3 px-4 text-blue-900 border border-blue-300">
                {displayValue(insurance.pcn)}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="py-3 px-4 font-medium text-blue-700 border border-blue-300">
                Help Desk Number:
              </td>
              <td className="py-3 px-4 text-blue-900 border border-blue-300">
                {displayValue(insurance.helpDeskNumber)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InsuranceDetails;
