import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

export default function ClassInsuranceTable() {
  const [classInsurances, setClassInsurances] = useState([]);
  const url = "http://localhost:5107/classinsurance";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setClassInsurances(data))
      .catch((error) => console.error("Error fetching class insurance data:", error));
  }, []);

  // Handle Edit Action
  const handleEdit = (insuranceId) => {
    console.log("Edit item with ID:", insuranceId);
    // Add your edit logic here (e.g., navigate to an edit page or open a modal)
  };

  // Handle Delete Action
  const handleDelete = (insuranceId) => {
    console.log("Delete item with ID:", insuranceId);
    // Add your delete logic here (e.g., confirm deletion and call an API)
    if (window.confirm("Are you sure you want to delete this item?")) {
      fetch(`${url}/${insuranceId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Remove the deleted item from the state
            setClassInsurances((prev) =>
              prev.filter((item) => item.insuranceId !== insuranceId)
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
      <PageMeta title="Class Insurance Table" description="Manage Class Insurance Data" />
      <PageBreadcrumb pageTitle="Class Insurance Table" />
      <div className="space-y-6">
        <ComponentCard title="Class Insurance List">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Insurance Name</th>
                  <th className="px-4 py-2 border">Class Name</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Branch</th>
                  <th className="px-4 py-2 border">Best Net</th>
                  <th className="px-4 py-2 border">Drug</th>
                  <th className="px-4 py-2 border">Script Code</th>
                  <th className="px-4 py-2 border">Script Date</th>
                  <th className="px-4 py-2 border">Actions</th> {/* New column for actions */}
                </tr>
              </thead>
              <tbody>
                {classInsurances.length > 0 ? (
                  classInsurances.map((item) => (
                    <tr key={item.insuranceId} className="border-t">
                      <td className="px-4 py-2 border">{item.insuranceName}</td>
                      <td className="px-4 py-2 border">{item.className}</td>
                      <td className="px-4 py-2 border">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border">{item.branch?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">${item.bestNet.toFixed(2)}</td>
                      <td className="px-4 py-2 border">{item.drug?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">{item.scriptCode}</td>
                      <td className="px-4 py-2 border">{new Date(item.scriptDateTime).toLocaleString()}</td>
                      <td className="px-4 py-2 border">
                        <div className="flex space-x-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(item.insuranceId)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(item.insuranceId)}
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
                    <td colSpan="9" className="text-center py-4">No data available</td>
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