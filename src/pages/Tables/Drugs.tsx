import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

export default function DrugTable() {
  const [drugs, setDrugs] = useState([]);
  const url = "http://localhost:5107/drug";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setDrugs(data))
      .catch((error) => console.error("Error fetching drugs:", error));
  }, []);

  // Handle Edit Action
  const handleEdit = (drugId) => {
    console.log("Edit item with ID:", drugId);
    // Add your edit logic here (e.g., navigate to an edit page or open a modal)
  };

  // Handle Delete Action
  const handleDelete = (drugId) => {
    console.log("Delete item with ID:", drugId);
    // Add your delete logic here (e.g., confirm deletion and call an API)
    if (window.confirm("Are you sure you want to delete this item?")) {
      fetch(`${url}/${drugId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Remove the deleted item from the state
            setDrugs((prev) =>
              prev.filter((item) => item.id !== drugId)
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
      <PageMeta title="Drug Table" description="Manage Drug Data" />
      <PageBreadcrumb pageTitle="Drug Table" />
      <div className="space-y-6">
        <ComponentCard title="Drugs List">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">NDC</th>
                  <th className="px-4 py-2 border">Form</th>
                  <th className="px-4 py-2 border">Strength</th>
                  <th className="px-4 py-2 border">Drug Class</th>
                  <th className="px-4 py-2 border">ACQ</th>
                  <th className="px-4 py-2 border">AWP</th>
                  <th className="px-4 py-2 border">RxCUI</th>
                  <th className="px-4 py-2 border">Actions</th> {/* New column for actions */}
                </tr>
              </thead>
              <tbody>
                {drugs.length > 0 ? (
                  drugs.map((drug) => (
                    <tr key={drug.id} className="border-t">
                      <td className="px-4 py-2 border">{drug.name}</td>
                      <td className="px-4 py-2 border">{drug.ndc}</td>
                      <td className="px-4 py-2 border">{drug.form || "N/A"}</td>
                      <td className="px-4 py-2 border">{drug.strength || "N/A"}</td>
                      <td className="px-4 py-2 border">{drug.drugClass?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">${drug.acq.toFixed(2)}</td>
                      <td className="px-4 py-2 border">${drug.awp.toFixed(2)}</td>
                      <td className="px-4 py-2 border">{drug.rxcui ?? "N/A"}</td>
                      <td className="px-4 py-2 border">
                        <div className="flex space-x-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(drug.id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(drug.id)}
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