import React from "react";

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
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">How It Works</h1>
      <div className="space-y-8">
        {helpPoints.map((point, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded shadow"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">{point.title}</h2>
              <ul className="list-disc pl-5 space-y-1">
                {point.subPoints.map((subPoint, subIndex) => (
                  <li key={subIndex}>{subPoint}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpPage;
