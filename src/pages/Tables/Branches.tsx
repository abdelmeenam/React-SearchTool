import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

export default function BranchTable() {
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const url = "http://localhost:5107/branches";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setBranches(data))
      .catch((error) => console.error("Error fetching branches:", error));
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = branches.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (id) => {
    console.log("Edit branch with ID:", id);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    console.log("Delete branch with ID:", id);
    // Implement delete functionality
  };

  return (
    <>
      <PageMeta title="Branch Table" description="Manage Branch Data" />
      <PageBreadcrumb pageTitle="Branch Table" />
      <div className="space-y-6">
        <ComponentCard title="Branches List">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Location</th>
                  <th className="px-4 py-2 border">Code</th>
                  <th className="px-4 py-2 border">Main Company</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((branch) => (
                    <tr key={branch.id} className="border-t">
                      <td className="px-4 py-2 border">{branch.name}</td>
                      <td className="px-4 py-2 border">{branch.location}</td>
                      <td className="px-4 py-2 border">{branch.code}</td>
                      <td className="px-4 py-2 border">{branch.mainCompany?.name || "N/A"}</td>
                      <td className="px-4 py-2 border flex space-x-2">
                        <button
                          onClick={() => handleEdit(branch.id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(branch.id)}
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
              {Array.from({ length: Math.ceil(branches.length / itemsPerPage) }, (_, i) => (
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
