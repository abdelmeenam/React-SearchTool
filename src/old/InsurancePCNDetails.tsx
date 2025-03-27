import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Insurance, RxGroupModel } from "../types"; // Ensure your Insurance interface is defined with these properties
import BaseUrlLoader, { loadConfig } from "../BaseUrlLoader";

await loadConfig();

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

const InsurancePCNDetails: React.FC = () => {
  const { insuranceName } = useParams<{ insuranceName: string }>();
  const [rxGroups, setRxGroups] = useState<RxGroupModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [insurance, setInsurance] = useState<Insurance | null>(null);
  const [showRxGroups, setShowRxGroups] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(insuranceName);

        const endpointUrl = `${BaseUrlLoader.API_BASE_URL}/Insurance/GetAllRxGroupsByPcnId?id=${insuranceName}`;
        const response = await axios.get(endpointUrl, {
          headers: getAuthHeader(),
        });
        setRxGroups(response.data);
        console.log(response.data);

        const endpointUrl2 = `${BaseUrlLoader.API_BASE_URL}/Insurance/GetInsurancePCNDetails?id=${insuranceName}`;
        const response2 = await axios.get(endpointUrl2, {
          headers: getAuthHeader(),
        });
        setInsurance(response2.data);
        console.log(response2.data);

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
    value === null || value === undefined || value === ""
      ? "NA"
      : value.toString();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!rxGroups) return <div>No insurance details available.</div>;
  if (!insurance) return <div>No insurance details available.</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-100 p-6">
      <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">
        Insurance Details
      </h2>
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl border border-blue-500 mb-6">
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium text-blue-700">Bin:</td>
              <td className="py-3 px-4 text-blue-900">
                {displayValue(insurance.insuranceBin)}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium text-blue-700">
                Insurance Name:
              </td>
              <td className="py-3 px-4 text-blue-900">
                {displayValue(insurance.insuranceFullName)}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium text-blue-700">PCN:</td>
              <td className="py-3 px-4 text-blue-900">
                {displayValue(insurance.insurancePCN)}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-blue-700">
                Help Desk Number:
              </td>
              <td className="py-3 px-4 text-blue-900">
                {displayValue(insurance.helpDeskNumber)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="w-full max-w-2xl">
        <button
          onClick={() => setShowRxGroups(!showRxGroups)}
          className="mb-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          {showRxGroups ? "Hide Rx Groups" : "Show Rx Groups"}
        </button>

        {showRxGroups && (
          <div className="grid grid-cols-1 gap-4">
            {rxGroups.map((group: RxGroupModel) => (
              <a
                key={group.id}
                href={`/InsuranceDetails/${group.id}`}
                className="block bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-800 font-semibold">{group.rxGroup}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsurancePCNDetails;
