import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

export default function DrugClassTable() {
  const [drugClasses, setDrugClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const url = "http://localhost:5107/drugclass";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setDrugClasses(data))
      .catch((error) => console.error("Error fetching drug class data:", error));
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = drugClasses.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle Edit Action
  const handleEdit = (drugClassId) => {
    console.log("Edit item with ID:", drugClassId);
    // Add your edit logic here (e.g., navigate to an edit page or open a modal)
  };

  // Handle Delete Action
  const handleDelete = (drugClassId) => {
    console.log("Delete item with ID:", drugClassId);
    // Add your delete logic here (e.g., confirm deletion and call an API)
    if (window.confirm("Are you sure you want to delete this item?")) {
      fetch(`${url}/${drugClassId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Remove the deleted item from the state
            setDrugClasses((prev) =>
              prev.filter((item) => item.drugClassId !== drugClassId)
            );
          } else {
            console.error("Failed to delete item");
          }
        })
        .catch((error) => console.error("Error deleting item:", error));
    }
  };

  return (
    <>
      <PageMeta title="Drug Class Table" description="Manage Drug Class Data" />
      <PageBreadcrumb pageTitle="Drug Class Table" />
      <div className="space-y-6">
        <ComponentCard title="Drug Class List">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Actions</th> {/* New column for actions */}
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 border">{item.name}</td>
                      <td className="px-4 py-2 border">
                        <div className="flex space-x-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(item.drugClassId)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(item.drugClassId)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-4">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: Math.ceil(drugClasses.length / itemsPerPage) }, (_, i) => (
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