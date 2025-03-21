import React, { useEffect, useState, useMemo, useRef } from 'react';
import BaseUrlLoader from '../BaseUrlLoader';
import axios from 'axios';

interface Log {
  id: number;
  userName: string;
  date: string;
  action: string;
}

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

const LogsPage: React.FC = () => {
  // All hooks are declared unconditionally
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterUser, setFilterUser] = useState<string>("");
  const [filterAction, setFilterAction] = useState<string>("");
  const [showUserSuggestions, setShowUserSuggestions] = useState<boolean>(false);
  const [showActionSuggestions, setShowActionSuggestions] = useState<boolean>(false);

  const userInputRef = useRef<HTMLDivElement>(null);
  const actionInputRef = useRef<HTMLDivElement>(null);

  // Fetch logs from the API endpoint on component mount
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${BaseUrlLoader.API_BASE_URL}/Logs/GetLogs`, {
          headers: getAuthHeader(),
        });
        setLogs(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Close suggestions dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userInputRef.current && !userInputRef.current.contains(event.target as Node)) {
        setShowUserSuggestions(false);
      }
      if (actionInputRef.current && !actionInputRef.current.contains(event.target as Node)) {
        setShowActionSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute suggestions from logs for the user filter
  const userSuggestions = useMemo(() => {
    const allUsers = Array.from(new Set(logs.map((log) => log.userName)));
    return allUsers.filter((user) =>
      user.toLowerCase().includes(filterUser.toLowerCase())
    );
  }, [logs, filterUser]);

  // Compute suggestions from logs for the action filter
  const actionSuggestions = useMemo(() => {
    const allActions = Array.from(new Set(logs.map((log) => log.action)));
    return allActions.filter((action) =>
      action.toLowerCase().includes(filterAction.toLowerCase())
    );
  }, [logs, filterAction]);

  // Filter logs based on filterUser and filterAction
  const filteredLogs = logs.filter((log) =>
    log.userName.toLowerCase().includes(filterUser.toLowerCase()) &&
    log.action.toLowerCase().includes(filterAction.toLowerCase())
  );

  // Now decide what to render. All hooks have been called!
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User Logs</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Filter by User */}
        <div className="flex-1 relative" ref={userInputRef}>
          <label className="block text-sm font-medium text-gray-700">Filter by User</label>
          <input
            type="text"
            placeholder="Enter user name"
            value={filterUser}
            onChange={(e) => {
              setFilterUser(e.target.value);
              setShowUserSuggestions(true);
            }}
            onFocus={() => setShowUserSuggestions(true)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {showUserSuggestions && userSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md max-h-60 overflow-y-auto">
              {userSuggestions.map((user, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setFilterUser(user);
                    setShowUserSuggestions(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {user}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Filter by Action */}
        <div className="flex-1 relative" ref={actionInputRef}>
          <label className="block text-sm font-medium text-gray-700">Filter by Action</label>
          <input
            type="text"
            placeholder="Enter action"
            value={filterAction}
            onChange={(e) => {
              setFilterAction(e.target.value);
              setShowActionSuggestions(true);
            }}
            onFocus={() => setShowActionSuggestions(true)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {showActionSuggestions && actionSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md max-h-60 overflow-y-auto">
              {actionSuggestions.map((action, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setFilterAction(action);
                    setShowActionSuggestions(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {action}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map((log, index) => (
              <tr key={`${log.id}-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.userName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(log.date).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <div className="p-4 text-center text-gray-500">No logs match the filter criteria.</div>
        )}
      </div>
    </div>
  );
};

export default LogsPage;
