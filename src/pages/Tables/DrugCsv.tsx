import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

export default function DrugCsvTable() {
  const [drugCsvData, setDrugCsvData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const url = "http://localhost:5107/drugcsv";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setDrugCsvData(data))
      .catch((error) => console.error("Error fetching drug CSV data:", error));
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = drugCsvData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <PageMeta title="Drug CSV Table" description="Manage Drug CSV Data" />
      <PageBreadcrumb pageTitle="Drug CSV Table" />
      <div className="space-y-6">
        <ComponentCard title="Drug CSV List">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Drug Name</th>
                  <th className="px-4 py-2 border">NDC</th>
                  <th className="px-4 py-2 border">Form</th>
                  <th className="px-4 py-2 border">Strength</th>
                  <th className="px-4 py-2 border">ACQ</th>
                  <th className="px-4 py-2 border">AWP</th>
                  <th className="px-4 py-2 border">RxCUI</th>
                  <th className="px-4 py-2 border">Drug Class</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 border">{item.drugName}</td>
                      <td className="px-4 py-2 border">{item.ndc}</td>
                      <td className="px-4 py-2 border">{item.form || "N/A"}</td>
                      <td className="px-4 py-2 border">{item.strength || "N/A"}</td>
                      <td className="px-4 py-2 border">${item.acq.toFixed(2)}</td>
                      <td className="px-4 py-2 border">${item.awp.toFixed(2)}</td>
                      <td className="px-4 py-2 border">{item.rxcui ?? "N/A"}</td>
                      <td className="px-4 py-2 border">{item.drugClass}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: Math.ceil(drugCsvData.length / itemsPerPage) }, (_, i) => (
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