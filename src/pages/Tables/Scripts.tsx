import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

export default function ScriptTable() {
  const [scripts, setScripts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const url = "http://localhost:5107/scripts";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setScripts(data))
      .catch((error) => console.error("Error fetching scripts:", error));
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = scripts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (id) => {
    console.log("Edit script with ID:", id);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    console.log("Delete script with ID:", id);
    // Implement delete functionality
  };

  return (
    <>
      <PageMeta title="Script Table" description="Manage Script Data" />
      <PageBreadcrumb pageTitle="Script Table" />
      <div className="space-y-6">
        <ComponentCard title="Script List">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Script Code</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">User</th>
                  <th className="px-4 py-2 border">Branch</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((script, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 border">{script.scriptCode}</td>
                      <td className="px-4 py-2 border">{new Date(script.date).toLocaleString()}</td>
                      <td className="px-4 py-2 border">{script.user?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">{script.branch?.name || "N/A"}</td>
                      <td className="px-4 py-2 border flex space-x-2">
                        <button
                          onClick={() => handleEdit(script.id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(script.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: Math.ceil(scripts.length / itemsPerPage) }, (_, i) => (
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
