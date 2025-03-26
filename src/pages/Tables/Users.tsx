import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const url = "http://localhost:5107/users";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (id) => {
    console.log("Edit user with ID:", id);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    console.log("Delete user with ID:", id);
    // Implement delete functionality
  };

  return (
    <>
      <PageMeta title="User Table" description="Manage User Data" />
      <PageBreadcrumb pageTitle="User Table" />
      <div className="space-y-6">
        <ComponentCard title="User List">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Short Name</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Branch</th>
                  <th className="px-4 py-2 border">Role</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((user, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 border">{user.email}</td>
                      <td className="px-4 py-2 border">{user.shortName}</td>
                      <td className="px-4 py-2 border">{user.name}</td>
                      <td className="px-4 py-2 border">{user.branch?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">{user.role}</td>
                      <td className="px-4 py-2 border flex space-x-2">
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: Math.ceil(users.length / itemsPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}