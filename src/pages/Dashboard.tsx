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
import { PharmacySale, Prescription, SalesAnalytics } from "../types";
import { motion } from "framer-motion";

export const Dashboard: React.FC = () => {
  const [sales, setSales] = useState<PharmacySale[]>([]);
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [latestScript, setLatestScript] = useState<Prescription[]>([]);
  const [totalNet, setTotalNet] = useState<number>(0);
  const [groupedData, setGroupedData] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredInsurances, setFilteredInsurances] = useState([]);

  const [belowNetPriceCount, setBelowNetPriceCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Helper function to get unique values for dropdowns
  const getUniqueValues = (data: any[], key: string) => {
    return [...new Set(data.map((item) => item[key]))].filter(Boolean).sort();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          "https://api.medisearchtool.com/drug/GetAllLatestScripts"
        );
        setLatestScript(result.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (latestScript.length > 0) {
      const insuranceMapping = {
        AL: "Aetna (AL)",
        BW: "aetna (BW)",
        AD: "Aetna Medicare (AD)",
        AF: "Anthem BCBS (AF)",
        DS: "Blue Cross Blue Shield (DS)",
        CA: "blue shield medicare (CA)",
        FQ: "Capital Rx (FQ)",
        BF: "Caremark (BF)",
        ED: "CatalystRx (ED)",
        AM: "Cigna (AM)",
        BO: "Default Claim Format (BO)",
        AP: "Envision Rx Options (AP)",
        CG: "Express Scripts (CG)",
        BI: "Horizon (BI)",
        AJ: "Humana Medicare (AJ)",
        BP: "informedRx (BP)",
        AO: "MEDCO HEALTH (AO)",
        AC: "MEDCO MEDICARE PART D (AC)",
        AQ: "MEDGR (AQ)",
        CC: "MY HEALTH LA (CC)",
        AG: "Navitus Health Solutions (AG)",
        AH: "OptumRx (AH)",
        AS: "PACIFICARE LIFE AND H (AS)",
        FJ: "Paramount Rx (FJ)",
        "X ": "PF - DEFAULT (X )",
        EA: "Pharmacy Data Management (EA)",
        DW: "phcs (DW)",
        AX: "PINNACLE (AX)",
        BN: "Prescription Solutions (BN)",
        AA: "Tri-Care Express Scripts (AA)",
        AI: "United Healthcare (AI)",
      };

      const grouped = latestScript.reduce((acc: Record<string, any>, item) => {
        const key = `${item.drugClass}-${item.insurance}`;
        if (!acc[key])
          acc[key] = {
            highestNet: 0,
            highestNdc: "",
            highestDrug: "",
            records: [],
          };

        acc[key].records.push(item);
        if (item.netProfit > acc[key].highestNet) {
          acc[key].highestNet = item.netProfit;
          acc[key].highestNdc = item.ndcCode;
          acc[key].highestDrug = item.drugName;
        }

        return acc;
      }, {});

      const processed = Object.values(grouped).flatMap(
        ({ highestNet, highestNdc, highestDrug, records }: any) =>
          records.map((item: any) => ({
            ...item,
            insuranceName: insuranceMapping[item.insurance] || item.insurance,
            highestNet,
            highestNdc,
            highestDrug,
            difference: highestNet - item.netProfit,
          }))
      );

      const totalNet = processed.reduce(
        (acc, entry) => acc + entry.netProfit,
        0
      );
      setTotalNet(totalNet);

      const totalRevenue = processed.reduce(
        (acc, entry) => acc + entry.highestNet,
        0
      );
      setTotalRevenue(totalRevenue);

      const belowNetPriceCount = processed.filter(
        (item) => item.netProfit < item.highestNet
      ).length;
      setBelowNetPriceCount(belowNetPriceCount);

      setGroupedData(processed);
      setFilteredData(processed);
      setFilteredInsurances(getUniqueValues(processed, "insuranceName"));
    }
  }, [latestScript]);

  // Filter effect
  useEffect(() => {
    const filtered = groupedData.filter((item) => {
      const matchesClass = !selectedClass || item.drugClass === selectedClass;
      const matchesInsurance =
        !selectedInsurance || item.insuranceName === selectedInsurance;
      return matchesClass && matchesInsurance;
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change

    // Filter insurance options based on selected class
    const availableInsurances = groupedData
      .filter((item) => !selectedClass || item.drugClass === selectedClass)
      .map((item) => item.insuranceName);
    setFilteredInsurances([...new Set(availableInsurances)]);
  }, [selectedClass, selectedInsurance, groupedData]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRecords = filteredData.slice(startIndex, endIndex);

  const normalizePrescriber = (prescriber) => {
    const [lastName, firstName] = prescriber.split(", ");
    return `${lastName} ${firstName.charAt(0)}.`;
  };

  const downloadCSV = () => {
    const headers = [
      "Date",
      "Script",
      "Insurance",
      "Drug Class",
      "Drug Name",
      "NDC Code",
      "Prescriber",
      "Net Profit",
      "Highest Net",
      "Difference",
      "Highest NDC",
      "Highest Drug",
    ];
    const rows = filteredData.map((item) => [
      (() => {
        const [datePart] = item.date.split(" ");
        const [day, month, year] = datePart.split("/");
        return `${month}/${day}/${year}`;
      })(),
      item.scriptCode,
      item.insuranceName,
      item.drugClass,
      item.drugName,
      item.ndcCode,
      normalizePrescriber(item.prescriber),
      item.netProfit.toFixed(2),
      item.highestNet,
      item.difference.toFixed(2),
      item.highestNdc,
      item.highestDrug,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "audit_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Pharmacy Dashboard
        </h1>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Scripts</p>
                <p className="text-3xl font-semibold">{latestScript?.length}</p>
              </div>
              <Pill className="h-10 w-10" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-semibold">
                  ${totalRevenue?.toFixed(2)}
                </p>
              </div>
              <BarChart3 className="h-10 w-10" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-semibold">
                  ${totalNet?.toFixed(2)}
                </p>
              </div>
              <PieChart className="h-10 w-10" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Below Net Price</p>
                <p className="text-3xl font-semibold">{belowNetPriceCount}</p>
              </div>
              <AlertTriangle className="h-10 w-10" />
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="">All Classes</option>
            {getUniqueValues(groupedData, "drugClass").map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>

          <select
            value={selectedInsurance}
            onChange={(e) => setSelectedInsurance(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="">All Insurance</option>
            {filteredInsurances.map((insuranceName) => (
              <option key={insuranceName} value={insuranceName}>
                {insuranceName}
              </option>
            ))}
          </select>
        </div>
        {/* Processed Data Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Audit Report
          </h2>
          <button
            onClick={downloadCSV}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download CSV
          </button>
          {/* 🔹 Table with Pagination */}

          <div className="overflow-x-auto">
            <table className="table-auto min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                    Date
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                    Script
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                    Insurance
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                    Drug Class
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                    Drug Name
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                    NDC Code
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                    Prescriber
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                    Net Profit
                  </th>
                  <th className="px-2 py-2 text-sm text-blue-600 font-bold">
                    Highest Net
                  </th>
                  <th className="px-2 py-2 text-sm text-red-600">Difference</th>
                  <th className="px-2 py-2 text-sm text-blue-600 font-bold">
                    Highest NDC
                  </th>
                  <th className="px-2 py-2 text-sm text-blue-600 font-bold">
                    Highest Drug
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-250">
                {currentRecords.map((item, index) => (
                  <tr key={index}>
                    <td className="px-2 py-2 text-sm text-gray-900">
                      {(() => {
                        const [datePart] = item.date.split(" ");
                        const [day, month, year] = datePart.split("/");
                        return `${month}/${day}/${year}`;
                      })()}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-900">
                      {item.scriptCode}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-900">
                      {item.insuranceName}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-900">
                      {item.drugClass}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-900">
                      {item.drugName}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-900">
                      {item.ndcCode}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-900">
                      {normalizePrescriber(item.prescriber)}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-900">
                      ${item.netProfit.toFixed(2)}
                    </td>
                    <td className="px-2 py-2 text-sm text-blue-600 font-bold">
                      {item.highestNet}
                    </td>
                    <td className="px-2 py-2 text-sm text-red-600">
                      ${item.difference.toFixed(2)}
                    </td>
                    <td className="px-2 py-2 text-sm text-blue-600 font-bold">
                      {item.highestNdc}
                    </td>
                    <td className="px-2 py-2 text-sm text-blue-600 font-bold">
                      {item.highestDrug}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 🔹 Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
              }`}
            >
              <ChevronLeft className="inline-block w-4 h-4 mr-1" /> Previous
            </button>

            <p className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </p>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
              }`}
            >
              Next <ChevronRight className="inline-block w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
