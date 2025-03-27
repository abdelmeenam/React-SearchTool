import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

export default function ScriptItemTable() {
  const [scriptItems, setScriptItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const url = "http://localhost:5107/scriptitems";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setScriptItems(data))
      .catch((error) => console.error("Error fetching script items:", error));
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = scriptItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (id) => {
    console.log("Edit script item with ID:", id);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    console.log("Delete script item with ID:", id);
    // Implement delete functionality
  };

  return (
    <>
      <PageMeta title="Script Item Table" description="Manage Script Item Data" />
      <PageBreadcrumb pageTitle="Script Item Table" />
      <div className="space-y-6">
        <ComponentCard title="Script Item List">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Script ID</th>
                  <th className="px-4 py-2 border">Drug</th>
                  <th className="px-4 py-2 border">Rx Number</th>
                  <th className="px-4 py-2 border">Insurance</th>
                  <th className="px-4 py-2 border">Drug Class</th>
                  <th className="px-4 py-2 border">Prescriber</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Acquisition Cost</th>
                  <th className="px-4 py-2 border">Discount</th>
                  <th className="px-4 py-2 border">Insurance Payment</th>
                  <th className="px-4 py-2 border">Patient Payment</th>
                  <th className="px-4 py-2 border">Net Profit</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 border">{item.scriptId}</td>
                      <td className="px-4 py-2 border">{item.drug?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">{item.rxNumber}</td>
                      <td className="px-4 py-2 border">{item.insurance?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">{item.drugClass?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">{item.prescriber?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">{item.quantity}</td>
                      <td className="px-4 py-2 border">${item.acquisitionCost.toFixed(2)}</td>
                      <td className="px-4 py-2 border">${item.discount.toFixed(2)}</td>
                      <td className="px-4 py-2 border">${item.insurancePayment.toFixed(2)}</td>
                      <td className="px-4 py-2 border">${item.patientPayment.toFixed(2)}</td>
                      <td className="px-4 py-2 border">${item.netProfit.toFixed(2)}</td>
                      <td className="px-4 py-2 border flex space-x-2">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center py-4">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: Math.ceil(scriptItems.length / itemsPerPage) }, (_, i) => (
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