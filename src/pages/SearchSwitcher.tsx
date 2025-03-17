import React, { useEffect, useState } from "react";
import { Search } from "./Search";            // Drug search by name
import { InsuranceSearch } from "./Search2";    // Insurance-first search flow
import { Search3 } from "./Search3";            // Rx Group–first search flow

export const SearchSwitcher: React.FC = () => {
  // "drug" for the drug search flow, "insurance" for the insurance-first flow,
  // "rx" for the Rx Group–first search flow.
  useEffect(() => {
    localStorage.removeItem("selectedRx");
    localStorage.removeItem("selectedPcn");
    localStorage.removeItem("selectedBin");
  }, []);
  const [activeFlow, setActiveFlow] = useState<"drug" | "insurance" | "rx">("drug");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setActiveFlow("drug")}
          className={`px-4 py-2 rounded-md ${
            activeFlow === "drug" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Search by Drug
        </button>
        <button
          onClick={() => setActiveFlow("insurance")}
          className={`px-4 py-2 rounded-md ${
            activeFlow === "insurance" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Search by Insurance
        </button>
        <button
          onClick={() => setActiveFlow("rx")}
          className={`px-4 py-2 rounded-md ${
            activeFlow === "rx" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Search by Rx Group
        </button>
      </div>

      {/* Render the selected search flow */}
      {activeFlow === "drug" && <Search />}
      {activeFlow === "insurance" && <InsuranceSearch />}
      {activeFlow === "rx" && <Search3 />}
    </div>
  );
};
