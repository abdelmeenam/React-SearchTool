import React, { useEffect, useState } from "react";
import {
  BarChart3,
  AlertTriangle,
  PieChart,
  Pill,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DrugTransaction } from "../types";
import { motion } from "framer-motion";

interface DashboardProps {
  data: DrugTransaction[];
}

const insurance_mapping: { [key: string]: string } = {
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

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [latestScripts, setLatestScripts] = useState<DrugTransaction[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [filteredData, setFilteredData] = useState<DrugTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DrugTransaction;
    direction: "ascending" | "descending";
  } | null>(null);
  const [belowNetPriceCount, setBelowNetPriceCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalNet, setTotalNet] = useState<number>(0);
  const [selectedPrescriber, setSelectedPrescriber] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const rowsPerPage = 10;

  // Tooltip state
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: string;
    x: number;
    y: number;
  }>({ visible: false, content: "", x: 0, y: 0 });

  const handleTooltipEnter = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    content: string
  ) => {
    setTooltip({ visible: true, content, x: e.clientX, y: e.clientY });
  };

  const handleTooltipMove = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
  };

  const handleTooltipLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Load data & calculate initial stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = data;
        setLatestScripts(result);

        const belowNetCount = result.filter(
          (item) => item.netProfit < item.highstNet
        ).length;
        const totalRev = result.reduce((sum, item) => sum + item.netProfit, 0);
        const totalNetProfit = result.reduce(
          (sum, item) => sum + item.highstNet,
          0
        );

        setBelowNetPriceCount(belowNetCount);
        setTotalRevenue(totalRev);
        setTotalNet(totalNetProfit);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [data]);

  // Update filtered data whenever filters or sorting change
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
      const itemMonth = itemDate.toISOString().slice(0, 7);
      return (
        (!selectedClass || item.drugClass === selectedClass) &&
        (!selectedInsurance || item.insurance === selectedInsurance) &&
        (!selectedPrescriber || item.prescriber === selectedPrescriber) &&
        (!selectedUser || item.user === selectedUser) &&
        (!selectedBranch || item.branchCode === selectedBranch) &&
        (!selectedMonth || itemMonth === selectedMonth)
      );
    });

    setFilteredData(filtered);

    const belowNetCount = filtered.filter(
      (item) => item.netProfit < item.highstNet
    ).length;
    const totalRev = filtered.reduce((sum, item) => sum + item.netProfit, 0);
    const totalNetProfit = filtered.reduce(
      (sum, item) => sum + item.highstNet,
      0
    );
    const difference = filtered.reduce(
      (sum, item) =>
        sum +
        (item.highstDrugNDC === item.ndcCode
          ? item.highstNet - item.netProfit
          : 0),
      0
    );

    setBelowNetPriceCount(belowNetCount);
    setTotalRevenue(totalRev);
    setTotalNet(totalNetProfit - difference);
    setCurrentPage(1);
  }, [
    latestScripts,
    sortConfig,
    selectedClass,
    selectedInsurance,
    selectedPrescriber,
    selectedUser,
    selectedBranch,
    selectedMonth,
  ]);

  const requestSort = (key: keyof DrugTransaction) => {
    let direction: "ascending" | "descending" = "ascending";
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

  const normalizeName = (name: string) =>
    name
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .replace(/[.,]/g, "");

  const downloadCSV = () => {
    const headers = [
      "Date",
      "Script",
      "Insurance",
      "Drug Class",
      "Drug Name",
      "NDC Code",
      "Patient Payment",
      "ACQ",
      "Insurance Payment",
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
      item.patientPayment,
      item.acquisitionCost,
      item.insurancePayment,
      normalizeName(item.prescriber),
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
      <div className=" px-4 sm:px-6 lg:px-10 py-8 ">
        {/* Responsive Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total Prescriptions */}
          <div className="bg-white dark:bg-gray-800 border-l-4 border-blue-700 dark:border-blue-500 rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 truncate">
                  Total Prescriptions
                </p>
                <p
                  className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 truncate"
                  onMouseEnter={(e) =>
                    handleTooltipEnter(e, filteredData.length.toString())
                  }
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipLeave}
                >
                  {filteredData.length}
                </p>
              </div>
              <Pill className="h-10 w-10 mt-4 sm:mt-0" />
            </div>
          </div>

          {/* Card 2: Below Optimal Net Profit */}
          <div className="bg-white dark:bg-gray-800 border-l-4 border-red-700 dark:border-red-500 rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-red-800 dark:text-red-300 truncate">
                  Below Optimal Net Profit
                </p>
                <p
                  className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 truncate"
                  onMouseEnter={(e) =>
                    handleTooltipEnter(e, belowNetPriceCount.toString())
                  }
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipLeave}
                >
                  {belowNetPriceCount}
                </p>
              </div>
              <AlertTriangle className="h-10 w-10 mt-4 sm:mt-0" />
            </div>
          </div>

          {/* Card 3: Estimated Max. Net Profit */}
          <div className="bg-white dark:bg-gray-800 border-l-4 border-green-700 dark:border-green-500 rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-green-800 dark:text-green-300 truncate">
                  Estimated Max. Net Profit
                </p>
                <p
                  className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 truncate"
                  onMouseEnter={(e) =>
                    handleTooltipEnter(
                      e,
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(totalNet ?? 0)
                    )
                  }
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipLeave}
                >
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalNet ?? 0)}
                </p>
              </div>
              <BarChart3 className="h-10 w-10 mt-4 sm:mt-0" />
            </div>
          </div>

          {/* Card 4: Current Total Net Profit */}
          <div className="bg-white dark:bg-gray-800 border-l-4 border-purple-700 dark:border-purple-500 rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-purple-800 dark:text-purple-300 truncate">
                  Current Total Net Profit
                </p>
                <p
                  className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 truncate"
                  onMouseEnter={(e) =>
                    handleTooltipEnter(
                      e,
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(totalRevenue ?? 0)
                    )
                  }
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipLeave}
                >
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalRevenue ?? 0)}
                </p>
              </div>
              <PieChart className="h-10 w-10 mt-4 sm:mt-0" />
            </div>
          </div>
        </div>

        {/* Responsive Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative inline-block w-full sm:w-auto">
            <input
              list="months"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              placeholder="All Months"
              className="block w-full px-4 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
            <datalist id="months">
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
                  <option key={month} value={month} />
                ))}
            </datalist>
          </div>
          <div className="relative inline-block w-full sm:w-auto">
            <input
              list="classes"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              placeholder="All Classes"
              className="block w-full px-4 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
            <datalist id="classes">
              <option value="">All Classes</option>
              {[...new Set(latestScripts.map((item) => item.drugClass))]
                .sort()
                .map((className) => (
                  <option key={className} value={className} />
                ))}
            </datalist>
          </div>
          <div className="relative inline-block w-full sm:w-auto">
            <input
              list="insurances"
              value={selectedInsurance}
              onChange={(e) => setSelectedInsurance(e.target.value)}
              placeholder="All RxGroups"
              className="block w-full px-4 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
            <datalist id="insurances">
              <option value="">All RxGroups</option>
              {[...new Set(latestScripts.map((item) => item.insurance))]
                .sort()
                .map((insurance) => (
                  <option key={insurance} value={insurance}>
                    {insurance === "  "
                      ? "MARCOG"
                      : insurance_mapping[insurance] || insurance}
                  </option>
                ))}
            </datalist>
          </div>
          <div className="relative inline-block w-full sm:w-auto">
            <input
              list="prescribers"
              value={selectedPrescriber}
              onChange={(e) => setSelectedPrescriber(e.target.value)}
              placeholder="All Prescribers"
              className="block w-full px-4 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
            <datalist id="prescribers">
              <option value="">All Prescribers</option>
              {[...new Set(latestScripts.map((item) => item.prescriber))]
                .sort()
                .map((prescriber) => (
                  <option key={prescriber} value={prescriber} />
                ))}
            </datalist>
          </div>
          <div className="relative inline-block w-full sm:w-auto">
            <input
              list="users"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              placeholder="All Users"
              className="block w-full px-4 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
            <datalist id="users">
              <option value="">All Users</option>
              {[...new Set(latestScripts.map((item) => item.user))]
                .sort()
                .map((user) => (
                  <option key={user} value={user} />
                ))}
            </datalist>
          </div>
          <div className="relative inline-block w-full sm:w-auto">
            <input
              list="branches"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              placeholder="All Branches"
              className="block w-full px-4 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
            <datalist id="branches">
              <option value="">All Branches</option>
              {[...new Set(latestScripts.map((item) => item.branchCode))]
                .sort()
                .map((branch) => (
                  <option key={branch} value={branch} />
                ))}
            </datalist>
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={downloadCSV}
            className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Download CSV
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-gray-300 dark:bg-gray-800 border-b-2 border-gray-400 dark:border-gray-700">
              <tr>
                {[
                  { label: "Date", key: "date" as keyof DrugTransaction },
                  {
                    label: "Script Code",
                    key: "scriptCode" as keyof DrugTransaction,
                  },
                  {
                    label: "Branch Name",
                    key: "branchCode" as keyof DrugTransaction,
                  },
                  {
                    label: "Rx Group",
                    key: "insurance" as keyof DrugTransaction,
                  },
                  {
                    label: "Drug Class",
                    key: "drugClass" as keyof DrugTransaction,
                  },
                  {
                    label: "Drug Name",
                    key: "drugName" as keyof DrugTransaction,
                  },
                  {
                    label: "NDC Code",
                    key: "ndcCode" as keyof DrugTransaction,
                  },
                  { label: "User", key: "user" as keyof DrugTransaction },
                  {
                    label: "Patient Payment",
                    key: "patientPayment" as keyof DrugTransaction,
                  },
                  {
                    label: "ACQ",
                    key: "acquisitionCost" as keyof DrugTransaction,
                  },
                  {
                    label: "Insurance Payment",
                    key: "insurancePayment" as keyof DrugTransaction,
                  },
                  {
                    label: "Prescriber",
                    key: "prescriber" as keyof DrugTransaction,
                  },
                  {
                    label: "Net Profit",
                    key: "netProfit" as keyof DrugTransaction,
                  },
                  {
                    label: "Highest Net",
                    key: "highstNet" as keyof DrugTransaction,
                  },
                  {
                    label: "Difference",
                    key: "difference" as keyof DrugTransaction,
                  },
                  {
                    label: "Highest Drug NDC",
                    key: "highstDrugNDC" as keyof DrugTransaction,
                  },
                  {
                    label: "Highest Drug Name",
                    key: "highstDrugName" as keyof DrugTransaction,
                  },
                  {
                    label: "Highest Script Code",
                    key: "highstScriptCode" as keyof DrugTransaction,
                  },
                  {
                    label: "Highest Script Date",
                    key: "highstScriptDate" as keyof DrugTransaction,
                  },
                ].map(({ label, key }) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase cursor-pointer whitespace-nowrap transition-colors duration-150 hover:bg-gray-400 dark:hover:bg-gray-700"
                    onClick={() => requestSort(key)}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-400 dark:divide-gray-700">
              {currentRecords.map((item, index) => (
                <tr
                  key={index}
                  className="transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    <a
                      href={`/scriptitems/${item.scriptCode}`}
                      className="text-blue-700 dark:text-blue-300 hover:underline hover:text-blue-900 dark:hover:text-blue-400 transition-colors duration-150"
                    >
                      {item.scriptCode}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {item.branchCode}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    <a
                      href={`/InsuranceDetails/${item.insuranceId}`}
                      target="_blank"
                      className="text-blue-700 dark:text-blue-300 hover:underline hover:text-blue-900 dark:hover:text-blue-400 transition-colors duration-150"
                    >
                      {item.insurance === "  "
                        ? "MARCOG"
                        : insurance_mapping[item.insurance] || item.insurance}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {item.drugClass}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    <a
                      href={`/drug/${item.drugId}?ndc=${item.ndcCode}&insuranceId=${item.insuranceId}`}
                      className="text-blue-700 hover:underline hover:text-blue-900 transition duration-200 dark:text-blue-300 dark:hover:text-blue-400"
                      target="_blank"
                    >
                      {item.drugName}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    <a
                      href={`https://ndclist.com/ndc/${item.ndcCode}`}
                      className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-400 hover:underline transition-colors duration-150"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.ndcCode}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {item.user}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {item.patientPayment}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {item.acquisitionCost}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {item.insurancePayment}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {normalizeName(item.prescriber)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {item.netProfit}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {item.highstNet}
                  </td>
                  <td className="px-3 py-2 text-sm text-red-700 dark:text-red-400 whitespace-nowrap">
                    {(item.highstNet - item.netProfit).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-sm text-blue-700 dark:text-blue-300 font-bold whitespace-nowrap">
                    <a
                      href={`https://ndclist.com/ndc/${item.highstDrugNDC}`}
                      className="hover:underline transition-colors duration-150"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.highstDrugNDC}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-sm text-blue-700 dark:text-blue-300 font-bold whitespace-nowrap">
                    <a
                      href={`/drug/${item.highstDrugId}?ndc=${item.highstDrugNDC}&insuranceId=${item.insuranceId}`}
                      className="text-blue-700 hover:underline hover:text-blue-900 transition duration-200 dark:text-blue-300 dark:hover:text-blue-400"
                      target="_blank"
                    >
                      {item.highstDrugName}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-sm text-blue-700 dark:text-blue-300 font-bold whitespace-nowrap">
                    {item.highstScriptCode??"NA"}
                  </td>
                  <td className="px-3 py-2 text-sm text-blue-700 dark:text-blue-300 font-bold whitespace-nowrap">
                    {new Date(item.highstScriptDate).toLocaleDateString(
                      "en-US"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md mb-2 sm:mb-0 transition-colors duration-150 ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <ChevronLeft className="inline-block w-4 h-4 mr-1" />
            Previous
          </button>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md transition-colors duration-150 ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Next <ChevronRight className="inline-block w-4 h-4 ml-1" />
          </button>
        </div>
        {/* Tooltip rendering */}
        {tooltip.visible && (
          <div
            style={{
              position: "fixed",
              top: tooltip.y + 10,
              left: tooltip.x + 10,
              zIndex: 1000,
            }}
            className="bg-gray-800 text-white text-xs p-1 rounded shadow"
          >
            {tooltip.content}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
