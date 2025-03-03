import React, { useState } from "react";
import { Search } from "./Search";      // Drug search by name
import { Search2 } from "./Search2";    // Insurance-first search flow

export const SearchSwitcher: React.FC = () => {
  // "drug" for the drug search flow, "insurance" for the insurance-first flow.
  const [activeFlow, setActiveFlow] = useState<"drug" | "insurance">("drug");

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
          Drug Search
        </button>
        <button
          onClick={() => setActiveFlow("insurance")}
          className={`px-4 py-2 rounded-md ${
            activeFlow === "insurance" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Insurance Search
        </button>
      </div>

      {/* Render the selected search flow */}
      {activeFlow === "drug" ? <Search /> : <Search2 />}
    </div>
  );
};
