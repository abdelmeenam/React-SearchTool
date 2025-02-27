import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ScriptData } from "../types";

const ScriptDetails: React.FC = () => {
  const { scriptcode } = useParams<{ scriptcode: string }>(); // Get script code from URL
  const [data, setData] = useState<ScriptData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpointUrl = `https://api.medisearchtool.com/drug/GetScriptByScriptCode?scriptCode=${scriptcode}`;
        const response = await axios.get(endpointUrl);
        setData(response.data); // Expecting an array
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [scriptcode]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
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
                "Drug Class Name": script.drugClassName,
                "Prescriber Name": script.prescriberName,
                "User Name": script.userName,
                PF: script.pf,
                Quantity: script.quantity,
                "Acquisition Cost": `$${script.acquisitionCost.toFixed(2)}`,
                Discount: `$${script.discount.toFixed(2)}`,
                "Insurance Payment": `$${script.insurancePayment.toFixed(2)}`,
                "Patient Payment": `$${script.patientPayment.toFixed(2)}`,
                "Net Profit": `$${script.netProfit.toFixed(2)}`,
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
                    {value}
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
