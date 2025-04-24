// src/pages/analytics/HelpPage.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { LibraryBig } from "lucide-react";

// Sample data for help points
const helpPoints = [
  {
    title: "Search By Drug Name",
    subPoints: [
      "Type the desired drug name in the search bar.",
      "You will get all available NDCs.",
      "Choose the desired NDC.",
      "If the selected NDC has insurance, you will get suggested insurance options to choose from.",
      "Then click on 'View Drug Details'.",
      "Note: If you don't choose the RxGroup and click on 'View Drug Details', you will get the details without prices.",
    ],
  },
  {
    title: "Search By Insurance Data",
    subPoints: [
      "Type the desired BIN or insurance name in the search bar.",
      "You will get all available insurances.",
      "Choose the desired insurance to get all available PCNs. You can also search for a drug using only the BIN.",
      "Search for the RxGroup to see all available drugs and NDCs.",
      "Click on 'View Drug Details' to see the details with prices.",
      "Note: If you don't choose the RxGroup and click on 'View Drug Details', you will get the details without prices.",
    ],
  },
  {
    title: "Search By RxGroup Directly",
    subPoints: [
      "Search for the desired RxGroup directly.",
      "Select the desired drug and NDC.",
      "Click on 'View Drug Details' to see the details with prices.",
    ],
  },
  {
    title: "Drug Details Alternatives",
    subPoints: [
      "Alternatives are based on drug class—you will get all alternatives that belong to the same class.",
      "The first table contains alternatives that have insurance.",
      "The second table contains alternatives that don't have insurance.",
    ],
  },
  {
    title: "All Scripts Audit Dashboard",
    subPoints: [
      "Get estimated data for all scripts.",
      "Get estimated predicted revenue for all scripts.",
      "Get real revenue for all scripts.",
      "Note: The best net is calculated based on the previous month of the targeted script.",
    ],
  },
  {
    title: "Matched Scripts Audit Dashboard",
    subPoints: [
      "Get estimated data for all scripts that match with the best drug to be sold.",
      "Get estimated predicted revenue for all scripts.",
      "Get real revenue for all scripts.",
      "Note: The best net is calculated based on the previous month of the targeted script.",
    ],
  },
  {
    title: "Mismatched Scripts Audit Dashboard",
    subPoints: [
      "Get estimated data for all scripts that mismatch with the best drug to be sold.",
      "Get estimated predicted revenue for all scripts.",
      "Get real revenue for all scripts.",
      "Note: The best net is calculated based on the previous month of the targeted script.",
    ],
  },
  {
    title: "User Logs",
    subPoints: [
      "View all user logs.",
      "Filter logs by selected filters and date range.",
      "View a performance graph showing user activity using the tool.",
    ],
  },
];

const HelpPage: React.FC = () => {
  // Initialize AOS on mount
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Filter state for help topics
  const [filter, setFilter] = useState("");
  // Track expanded/collapsed state for each help point (default: expanded)
  const [expanded, setExpanded] = useState(
    helpPoints.map(() => true)
  );

  const toggleExpanded = (index: number) => {
    setExpanded((prev) =>
      prev.map((isExpanded, i) =>
        i === index ? !isExpanded : isExpanded
      )
    );
  };

  // Filter the helpPoints array based on filter input (case-insensitive match on title)
  const filteredHelpPoints = helpPoints.filter((point) =>
    point.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Header Section */}
        <section aria-labelledby="how-it-works-heading" className="text-center mb-12" data-aos="fade-down">
          <h1 id="how-it-works-heading" className="text-4xl sm:text-5xl font-bold tracking-tight leading-snug">
            How It Works
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-medium">
            Follow these simple steps to get started.
          </p>
        </section>
  
        {/* Search Input with Label */}
        <div className="mb-8 flex justify-center">
          <label htmlFor="search-topics" className="sr-only">
            Search help topics
          </label>
          <input
            id="search-topics"
            type="text"
            placeholder="Search help topics..."
            aria-label="Search help topics"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full max-w-md rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 py-2 px-4 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>
  
        {/* Help Sections */}
        <div className="space-y-8">
          {filteredHelpPoints.map((point, index) => (
            <div
              key={index}
              data-aos="fade-up"
              className="rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-neutral-800 p-6 transition-transform duration-300 hover:scale-105 hover:ring-blue-400 dark:hover:ring-blue-300"
            >
              <button
                onClick={() => toggleExpanded(index)}
                aria-expanded={expanded[index]}
                aria-controls={`help-section-${index}`}
                className="flex w-full items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
              >
                <h2 className="text-xl font-semibold tracking-tight dark:text-gray-200 flex items-center">
                  <span className="mr-2">
                    <LibraryBig />
                  </span>
                  {point.title}
                </h2>
                <span className="text-2xl dark:text-gray-200">
                  {expanded[index] ? "–" : "+"}
                </span>
              </button>
  
              {expanded[index] && (
                <ul
                  id={`help-section-${index}`}
                  className="mt-4 list-disc pl-5 space-y-1 text-sm sm:text-base leading-relaxed"
                >
                  {point.subPoints.map((subPoint, subIndex) => (
                    <li key={subIndex}>{subPoint}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
  
        {/* Call-to-Action Footer */}
        <div className="mt-12 text-center" data-aos="fade-up">
          <p className="text-lg font-medium">
            Still need help?{" "}
            <Link
              to="/contact"
              className="text-blue-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              Contact us.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
  
};

export default HelpPage;
