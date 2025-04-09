import React, { useEffect, useState, useMemo, useRef } from "react";
import BaseUrlLoader from "../BaseUrlLoader";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Log {
  id: number;
  userName: string;
  date: string;
  action: string;
}

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

// Action mapping (moved above usage for clarity)
const actionNameMap: Record<string, string> = {
  GetLogs: "View Logs",
  GetAllLatestScripts: "Latest Scripts",
  searchByName: "Search Drug by Name",
  getDrugNDCs: "Search Drug by NDC",
  GetInsuranceByNdc: "Get Insurance by NDC",
  SearchByNdc: "Search by NDC",
  GetDetails: "View Drug Details",
  GetClassById: "View Drug Class",
  GetAlternativesByClassIdBranchId: "Get Drug Alternatives",
  GetAllDrugs: "View All Drugs",
  GetInsurancesBinsByName: "Get BINs by Insurance Name",
  GetDrugsByBin: "Get Drugs by BIN",
  GetAllRxGroups: "View All RxGroups",
  GetInsuranceDetails: "View Insurance Details",
  GetInsurancePCNDetails: "View PCN Details",
  GetInsuranceBINDetails: "View BIN Details",
  GetAllPCNsByBINId: "List PCNs by BIN",
  GetAllRxGroupsByBINId: "List RxGroups by BIN",
  GetAllRxGroupsByPcnId: "List RxGroups by PCN",
  GetScriptByScriptCode: "Get Script by Code",
  UserById: "View User Profile",
  UpdateUser: "Update User Info",
  GetInsurancesPcnByBinId: "Get PCNs by BIN",
  GetDrugsByInsuranceName: "Get Drugs by Insurance",
  GetInsurancesRxByPcnId: "Get RxGroups by PCN",
  GetDrugsByPCN: "Get Drugs by PCN",
  Login: "User Sign in",
  Logout: "User Sign out",
};

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state for user, activity, and date range
  const [filterUser, setFilterUser] = useState<string>("");
  const [filterAction, setFilterAction] = useState<string>("");
  const [filterFromDate, setFilterFromDate] = useState<string>("");
  const [filterToDate, setFilterToDate] = useState<string>("");

  const [showUserSuggestions, setShowUserSuggestions] =
    useState<boolean>(false);
  const [showActionSuggestions, setShowActionSuggestions] =
    useState<boolean>(false);

  const userInputRef = useRef<HTMLDivElement>(null);
  const actionInputRef = useRef<HTMLDivElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const logsPerPage = 10;

  // Fetch logs on component mount
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `${BaseUrlLoader.API_BASE_URL}/Logs/GetLogs`,
          {
            headers: getAuthHeader(),
          }
        );
        const processedLogs = response.data
          // Exclude logs with "token-test" in the action
          .filter(
            (log: Log) => !log.action.toLowerCase().includes("token-test")
          )
          // Remove "User requested" prefix (case-insensitive)
          .map((log: Log) => ({
            ...log,
            action: log.action.replace(/^User requested\s*/i, ""),
          }))
          // Only keep logs whose action exists as a key in actionNameMap
          .filter((log: Log) =>
            Object.keys(actionNameMap).includes(log.action)
          );

        console.log("Processed logs:", processedLogs);
        setLogs(processedLogs);
      } catch (err: any) {
        setError(
          "Sorry, you don’t have access. Please contact your system administrator."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Close suggestion dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userInputRef.current &&
        !userInputRef.current.contains(event.target as Node)
      ) {
        setShowUserSuggestions(false);
      }
      if (
        actionInputRef.current &&
        !actionInputRef.current.contains(event.target as Node)
      ) {
        setShowActionSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute unique users for suggestions
  const userSuggestions = useMemo(() => {
    const allUsers = Array.from(new Set(logs.map((log) => log.userName)));
    return allUsers.filter((user) =>
      user.toLowerCase().includes(filterUser.toLowerCase())
    );
  }, [logs, filterUser]);

  // Compute unique actions for suggestions
  const actionSuggestions = useMemo(() => {
    const allActions = Array.from(new Set(logs.map((log) => log.action)));
    return allActions.filter((action) =>
      action.toLowerCase().includes(filterAction.toLowerCase())
    );
  }, [logs, filterAction]);

  // Filter logs based on user, activity, and date range filters
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const logDate = new Date(log.date);
      const fromValid = filterFromDate
        ? logDate >= new Date(filterFromDate)
        : true;
      const toValid = filterToDate ? logDate <= new Date(filterToDate) : true;
      return (
        log.userName.toLowerCase().includes(filterUser.toLowerCase()) &&
        log.action.toLowerCase().includes(filterAction.toLowerCase()) &&
        fromValid &&
        toValid
      );
    });
  }, [logs, filterUser, filterAction, filterFromDate, filterToDate]);

  // Reset current page whenever filtered logs change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredLogs]);

  // Determine logs for current page
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  // Group logs by day for the line chart (logs per day)
  const chartData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    filteredLogs.forEach((log) => {
      const day = new Date(log.date).toLocaleDateString();
      counts[day] = (counts[day] || 0) + 1;
    });
    const labels = Object.keys(counts).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    const data = labels.map((label) => counts[label]);
    return { labels, data };
  }, [filteredLogs]);

  // Configuration for the line chart
  const lineData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Number of Logs",
        data: chartData.data,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: filterUser ? `Activity for ${filterUser}` : "Logs Per Day",
      },
    },
  };

  // Group logs by action for the bar chart, using only the last word of each action
  const actionChartData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    filteredLogs.forEach((log) => {
      const words = log.action.trim().split(" ");
      const lastWord = words[words.length - 1];
      counts[lastWord] = (counts[lastWord] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const data = labels.map((action) => counts[action]);
    const newLables = labels.map((x) => actionNameMap[x] || "others");
    console.log(newLables);
    return { newLables, data };
  }, [filteredLogs]);

  const barData = {
    labels: actionChartData.newLables,
    datasets: [
      {
        label: "Action Usage Count",
        data: actionChartData.data,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Action Usage Overview (Last Word)",
      },
    },
  };

  // Compute working hours per day for the selected user
  const workingHoursData = useMemo(() => {
    if (!filterUser) return [];
    // Filter logs for the selected user that are either a Login or Logout
    const userLogs = logs.filter(
      (log) =>
        log.userName.toLowerCase() === filterUser.toLowerCase() &&
        (log.action === "Login" || log.action === "Logout")
    );
    // Group logs by day using locale date string (this assumes the local day is acceptable)
    const groupedByDay: { [day: string]: Log[] } = userLogs.reduce((acc, log) => {
      const day = new Date(log.date).toLocaleDateString();
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(log);
      return acc;
    }, {} as { [day: string]: Log[] });

    const results: {
      day: string;
      signIn: string;
      signOut: string;
      hours: string;
    }[] = [];

    Object.keys(groupedByDay).forEach((day) => {
      const logsForDay = groupedByDay[day];
      // Filter login and logout events
      const loginLogs = logsForDay.filter((log) => log.action === "Login");
      const logoutLogs = logsForDay.filter((log) => log.action === "Logout");

      // Only compute if we have at least one login and one logout
      if (loginLogs.length > 0 && logoutLogs.length > 0) {
        // Get the earliest login and the latest logout
        const firstLogin = loginLogs.reduce((a, b) =>
          new Date(a.date) < new Date(b.date) ? a : b
        );
        const lastLogout = logoutLogs.reduce((a, b) =>
          new Date(a.date) > new Date(b.date) ? a : b
        );
        // Calculate the difference in hours
        const diffMs = new Date(lastLogout.date).getTime() - new Date(firstLogin.date).getTime();
        const diffHours = diffMs / (1000 * 60 * 60); // converting milliseconds to hours

        results.push({
          day,
          signIn: new Date(firstLogin.date).toLocaleTimeString(),
          signOut: new Date(lastLogout.date).toLocaleTimeString(),
          hours: diffHours.toFixed(2),
        });
      }
    });
    // Sort by day in ascending order
    results.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
    return results;
  }, [logs, filterUser]);

  // Function to download CSV of filtered logs
  const downloadCSV = () => {
    const headers = ["ID", "User Name", "Action", "Date"];
    const csvRows = [];
    csvRows.push(headers.join(","));

    filteredLogs.forEach((log) => {
      // Use the mapped action name if available
      const actionText = actionNameMap[log.action] || log.action;
      const dateFormatted = new Date(log.date).toLocaleString();
      const row = [
        log.id,
        log.userName,
        `"${actionText}"`,
        `"${dateFormatted}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logs.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900 dark:text-white">
        <p>Loading logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto mb-6"
        role="alert"
      >
        <strong className="font-bold">Access Denied!</strong>
        <span className="block sm:inline">
          {" "}
          Sorry, you don’t have permission to view this page.
        </span>
        <br />
        <span className="block sm:inline">
          Please contact the system administrator if you believe this is an
          error.
        </span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">User Logs</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* User Filter */}
        <div className="flex-1 relative" ref={userInputRef}>
          <label className="block text-sm font-medium dark:text-gray-300">
            Select User
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter user name"
              value={filterUser}
              onChange={(e) => {
                setFilterUser(e.target.value);
                setShowUserSuggestions(true);
              }}
              onFocus={() => setShowUserSuggestions(true)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            {filterUser && (
              <span
                onClick={() => setFilterUser("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-300"
              >
                &times;
              </span>
            )}
          </div>
          {showUserSuggestions && userSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 mt-1 rounded-md max-h-60 overflow-y-auto">
              {userSuggestions.map((user, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setFilterUser(user);
                    setShowUserSuggestions(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {user}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Activity Filter */}
        <div className="flex-1 relative" ref={actionInputRef}>
          <label className="block text-sm font-medium dark:text-gray-300">
            Filter by Activity
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter activity"
              value={filterAction}
              onChange={(e) => {
                setFilterAction(e.target.value);
                setShowActionSuggestions(true);
              }}
              onFocus={() => setShowActionSuggestions(true)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            {filterAction && (
              <span
                onClick={() => setFilterAction("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-300"
              >
                &times;
              </span>
            )}
          </div>
          {showActionSuggestions && actionSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 mt-1 rounded-md max-h-60 overflow-y-auto">
              {actionSuggestions.map((action, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setFilterAction(action);
                    setShowActionSuggestions(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {actionNameMap[action]}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* From Date Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={filterFromDate}
            onChange={(e) => setFilterFromDate(e.target.value)}
            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          />
        </div>
        {/* To Date Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={filterToDate}
            onChange={(e) => setFilterToDate(e.target.value)}
            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          />
        </div>
      </div>

      {filterUser ? (
        <div className="flex flex-col gap-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <Line data={lineData} options={lineOptions} />
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Working Hours Table */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Daily Working Hours</h2>
            {workingHoursData.length > 0 ? (
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                      First Sign In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                      Last Sign Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                      Total Hours
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {workingHoursData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {item.day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {item.signIn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {item.signOut}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {item.hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-300">
                No working hours data available for this user.
              </div>
            )}
          </div>

          {/* Download CSV Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={downloadCSV}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Download CSV
            </button>
          </div>
          {/* Logs List Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentLogs.map((log, index) => (
                  <tr
                    key={`${log.id}-${index}`}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {log.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {log.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {actionNameMap[log.action] || log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(log.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLogs.length > logsPerPage && (
              <div className="flex justify-between items-center p-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-700 dark:text-gray-200">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
            {filteredLogs.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-300">
                No logs match the filter criteria.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 dark:text-gray-300">
          Please select a user to view their activity and logs.
        </div>
      )}
    </div>
  );
};

export default LogsPage;
