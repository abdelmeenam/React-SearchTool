import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

export default function UserLogsTable() {
  const [userLogs, setUserLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const url = "http://localhost:5107/userlogs";
  const usersUrl = "http://localhost:5107/users";

  useEffect(() => {
    fetch(usersUrl)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setUserLogs(data))
      .catch((error) => console.error("Error fetching user logs:", error));
  }, []);

  const filteredLogs = selectedUserId
    ? userLogs.filter((log) => log.userId === parseInt(selectedUserId))
    : userLogs;

  return (
    <>
      <PageMeta title="User Logs Table" description="Manage User Logs Data" />
      <PageBreadcrumb pageTitle="User Logs Table" />
      <div className="space-y-6">
        <ComponentCard title="User Logs List">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Filter by User:</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">User Name</th>
                  <th className="px-4 py-2 border">User ID</th>
                  <th className="px-4 py-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 border">{users.find((user) => user.id === log.userId)?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">{log.userId}</td>
                      <td className="px-4 py-2 border">{new Date(log.date).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
