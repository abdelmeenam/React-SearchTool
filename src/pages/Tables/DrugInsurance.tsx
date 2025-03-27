import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

export default function DrugInsuranceTable() {
  const [drugInsurances, setDrugInsurances] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const url = "http://localhost:5107/druginsurance";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setDrugInsurances(data))
      .catch((error) => console.error("Error fetching drug insurance data:", error));
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = drugInsurances.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle Edit Action
  const handleEdit = (drugInsuranceId) => {
    console.log("Edit item with ID:", drugInsuranceId);
    // Add your edit logic here (e.g., navigate to an edit page or open a modal)
  };

  // Handle Delete Action
  const handleDelete = (drugInsuranceId) => {
    console.log("Delete item with ID:", drugInsuranceId);
    // Add your delete logic here (e.g., confirm deletion and call an API)
    if (window.confirm("Are you sure you want to delete this item?")) {
      fetch(`${url}/${drugInsuranceId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Remove the deleted item from the state
            setDrugInsurances((prev) =>
              prev.filter((item) => item.drugInsuranceId !== drugInsuranceId)
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
      <PageMeta title="Drug Insurance Table" description="Manage Drug Insurance Data" />
      <PageBreadcrumb pageTitle="Drug Insurance Table" />
      <div className="space-y-6">
        <ComponentCard title="Drug Insurance List">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Insurance</th>
                  <th className="px-4 py-2 border">Drug</th>
                  <th className="px-4 py-2 border">Branch</th>
                  <th className="px-4 py-2 border">NDC Code</th>
                  <th className="px-4 py-2 border">Drug Class</th>
                  <th className="px-4 py-2 border">Net</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Prescriber</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Acquisition Cost</th>
                  <th className="px-4 py-2 border">Discount</th>
                  <th className="px-4 py-2 border">Insurance Payment</th>
                  <th className="px-4 py-2 border">Patient Payment</th>
                  <th className="px-4 py-2 border">Actions</th> {/* New column for actions */}
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 border">{item.insurance?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">{item.drug?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">{item.branch?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">{item.ndcCode}</td>
                      <td className="px-4 py-2 border">{item.drugClassId || "N/A"}</td>
                      <td className="px-4 py-2 border">${item.net.toFixed(2)}</td>
                      <td className="px-4 py-2 border">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border">{item.prescriber}</td>
                      <td className="px-4 py-2 border">{item.quantity}</td>
                      <td className="px-4 py-2 border">${item.acquisitionCost.toFixed(2)}</td>
                      <td className="px-4 py-2 border">${item.discount.toFixed(2)}</td>
                      <td className="px-4 py-2 border">${item.insurancePayment.toFixed(2)}</td>
                      <td className="px-4 py-2 border">${item.patientPayment.toFixed(2)}</td>
                      <td className="px-4 py-2 border">
                        <div className="flex space-x-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(item.drugInsuranceId)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(item.drugInsuranceId)}
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
                    <td colSpan="14" className="text-center py-4">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: Math.ceil(drugInsurances.length / itemsPerPage) }, (_, i) => (
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