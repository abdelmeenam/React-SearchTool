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

export const Dashboard: React.FC = () => {
  const [latestScripts, setLatestScripts] = useState<DrugTransaction[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [filteredData, setFilteredData] = useState<DrugTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);
  const [belowNetPriceCount, setBelowNetPriceCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalNet, setTotalNet] = useState<number>(0);
  const [selectedPrescriber, setSelectedPrescriber] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const rowsPerPage = 10;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(totalRevenue ?? 0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          "https://api.medisearchtool.com/drug/GetAllLatestScripts"
        );
        setLatestScripts(result.data);
        // Calculate values
        const belowNetCount = result.data.filter(
          (item) => item.netProfit < item.highstNet
        ).length;
        const totalRev = result.data.reduce(
          (sum, item) => sum + item.netProfit,
          0
        );
        const totalNetProfit = result.data.reduce(
          (sum, item) => sum + item.highstNet,
          0
        );

        // Update state
        setBelowNetPriceCount(belowNetCount);
        setTotalRevenue(totalRev);
        setTotalNet(totalNetProfit);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);
  const headers = [
    { label: "Date", key: "date" },
    { label: "Script Code", key: "scriptCode" },
    { label: "Rx Number", key: "rxNumber" },
    { label: "User", key: "user" },
    { label: "Drug Name", key: "drugName" },
    { label: "Insurance", key: "insurance" },
    { label: "PF", key: "pf" },
    { label: "Prescriber", key: "prescriber" },
    { label: "Quantity", key: "quantity" },
    { label: "Acquisition Cost", key: "acquisitionCost" },
    { label: "Discount", key: "discount" },
    { label: "Insurance Payment", key: "insurancePayment" },
    { label: "Patient Payment", key: "patientPayment" },
    { label: "NDC Code", key: "ndcCode" },
    { label: "Net Profit", key: "netProfit" },
    { label: "Drug Class", key: "drugClass" },
    { label: "Highest Drug NDC", key: "highstDrugNDC" },
    { label: "Highest Drug Name", key: "highstDrugName" },
    { label: "Highest Drug ID", key: "highstDrugId" },
    { label: "Highest Net", key: "highstNet" },
  ];
  useEffect(() => {
    let sortedData = [...latestScripts];
    if (sortConfig !== null) {
      sortedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    const filtered = sortedData.filter((item) => {
      const itemDate = new Date(item.date);
      const itemMonth = itemDate.toISOString().slice(0, 7); // YYYY-MM
      return (
        (!selectedClass || item.drugClass === selectedClass) &&
        (!selectedInsurance || item.insurance === selectedInsurance) &&
        (!selectedPrescriber || item.prescriber === selectedPrescriber) &&
        (!selectedUser || item.user === selectedUser) &&
        (!selectedMonth || itemMonth === selectedMonth)
      );
    });
    setFilteredData(filtered);
    const belowNetCount =filtered.filter(
      (item) => item.netProfit < item.highstNet
    ).length;
    const totalRev = filtered.reduce(
      (sum, item) => sum + item.netProfit,
      0
    );
    const totalNetProfit = filtered.reduce(
      (sum, item) => sum + item.highstNet,
      0
    );

    // Update state
    setBelowNetPriceCount(belowNetCount);
    setTotalRevenue(totalRev);
    setTotalNet(totalNetProfit);
    setCurrentPage(1);
  }, [
    selectedClass,
    selectedInsurance,
    selectedPrescriber,
    selectedUser,
    selectedMonth,
    latestScripts,
  ]);
  const requestSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentRecords = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const insurance_mapping = {
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
      new Date(item.date).toLocaleDateString("en-US"),
      item.scriptCode,
      item.insurance,
      item.drugClass,
      item.drugName,
      item.ndcCode,
      item.prescriber,
      item.netProfit.toFixed(2),
      item.highstNet,
      (item.highstNet - item.netProfit).toFixed(2),
      item.highstDrugNDC,
      item.highstDrugName,
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
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
          Pharmacy Dashboard
        </h1>
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Scripts</p>
                <p className="text-3xl font-semibold">{filteredData?.length}</p>
              </div>
              <Pill className="h-10 w-10" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Scripts Below Net Price</p>
                <p className="text-3xl font-semibold">{belowNetPriceCount}</p>
              </div>
              <AlertTriangle className="h-10 w-10" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Best Total Revenue </p>
                <p className="text-3xl font-semibold">
                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalNet ?? 0)}</span>
                </p>
              </div>
              <BarChart3 className="h-10 w-10" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium"> Current Total Revenue</p>
                <p className="text-3xl font-semibold">
                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue ?? 0)}</span>
                </p>
              </div>
              <PieChart className="h-10 w-10" />
            </div>
          </div>

         
        </div>
        <div className="flex gap-4 mb-6">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="">All Months</option>
            {[
              ...new Set(
                latestScripts.map((item) =>
                  new Date(item.date).toISOString().slice(0, 7)
                )
              ),
            ]
              .sort()
              .map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="">All Classes</option>
            {[...new Set(latestScripts.map((item) => item.drugClass))]
              .sort()
              .map((className) => (
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
            {[...new Set(latestScripts.map((item) => item.insurance))]
              .sort()
              .map((insurance) => (
                <option key={insurance} value={insurance}>
                  {insurance_mapping[insurance] || insurance}
                </option>
              ))}
          </select>

          <select
            value={selectedPrescriber}
            onChange={(e) => setSelectedPrescriber(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="">All Prescribers</option>
            {[...new Set(latestScripts.map((item) => item.prescriber))]
              .sort()
              .map((prescriber) => (
                <option key={prescriber} value={prescriber}>
                  {prescriber}
                </option>
              ))}
          </select>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="">All Users</option>
            {[...new Set(latestScripts.map((item) => item.user))]
              .sort()
              .map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
          </select>
       
        </div>
        <div>
        <button
            onClick={downloadCSV}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "date",
                  "scriptCode",
                  "insurance",
                  "drugClass",
                  "drugName",
                  "ndcCode",
                  "user",
                  "prescriber",
                  "netProfit",
                  "highestNet",
                  "difference",
                  "highestDrugNDC",
                  "highestDrugName",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase cursor-pointer"
                    onClick={() => requestSort(col)}
                  >
                    {col.replace(/([A-Z])/g, " $1").trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-250">
              {currentRecords.map((item, index) => (
                <tr key={index}>
                  <td className="px-2 py-2 text-sm text-gray-900">
                    {new Date(item.date).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900">
                    {item.scriptCode}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900">
                    {item.insurance === "  " ? "MARCOG" : insurance_mapping[item.insurance] || item.insurance}
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
                    {item.user}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900">
                    {item.prescriber}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900">
                    {item.netProfit}
                  </td>
                  <td className="px-2 py-2 text-sm text-blue-600 font-bold">
                    {item.highstNet}
                  </td>
                  <td className="px-2 py-2 text-sm text-red-600">
                    {(item.highstNet - item.netProfit).toFixed(2)}
                  </td>
                  <td className="px-2 py-2 text-sm text-blue-600 font-bold">
                    {item.highstDrugNDC}
                  </td>
                  <td className="px-2 py-2 text-sm text-blue-600 font-bold">
                    {item.highstDrugName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
function normalizePrescriber(prescriber: string): any {
  throw new Error("Function not implemented.");
}
