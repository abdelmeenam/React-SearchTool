import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

export default function BasicTables() {
  const [activeButton, setActiveButton] = useState("all");

  // --------------------------------------
  // 1) Define the Table Component
  // --------------------------------------
  function BasicTableOne() {
    // Sample data (adapted from your screenshot)
    const tableData = [
      {
        date: "5/04/2022",
        branchCode: "2GFA",
        scrCode: "California Dermatology Huntington",
        rxGroupClass: "Oral Arbitan (BDLN)",
        drugName: "DIOXYCYCL MONO (tab) 75MG",
        ndcCode: "23510305101",
        a_c: "2.8",
        insurancePayment: "EZNA",
        pressurePoint: "127",
        reportNpt: "127",
        highPrice: "115.4",
      },
      {
        date: "6/05/2022",
        branchCode: "2GFA",
        scrCode: "California Dermatology Irvine",
        rxGroupClass: "Topical",
        drugName: "KETOCONAZOLE",
        ndcCode: "28102003052",
        a_c: "4.59",
        insurancePayment: "EZNA",
        pressurePoint: "58.7",
        reportNpt: "55.87",
        highPrice: "145.7",
      },
      {
        date: "7/08/2022",
        branchCode: "2GFA",
        scrCode: "California Dermatology Thousand Oaks",
        rxGroupClass: "Antifungal (BDLN)",
        drugName: "TAVABOROLE SOL 5%",
        ndcCode: "28102003053",
        a_c: "4.09",
        insurancePayment: "EZNA",
        pressurePoint: "60.1",
        reportNpt: "59.2",
        highPrice: "141.7",
      },
      {
        date: "9/10/2022",
        branchCode: "2GFA",
        scrCode: "California Dermatology Thousand Oaks",
        rxGroupClass: "SECCONMA (BDLN)",
        drugName: "GENTAMICIN 0.1%",
        ndcCode: "28102003054",
        a_c: "3.77",
        insurancePayment: "EZNA",
        pressurePoint: "76.5",
        reportNpt: "73.2",
        highPrice: "119.8",
      },
    ];

    // (Optional) Pagination state & logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Show up to 5 rows per page
    const totalPages = Math.ceil(tableData.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

    const goToPage = (pageNumber) => {
      if (pageNumber < 1) pageNumber = 1;
      if (pageNumber > totalPages) pageNumber = totalPages;
      setCurrentPage(pageNumber);
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded shadow-sm p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Table Head */}
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 uppercase text-xs tracking-wider">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Branch Code</th>
                <th className="py-3 px-4 text-left">SCR Code</th>
                <th className="py-3 px-4 text-left">RX Group Class</th>
                <th className="py-3 px-4 text-left">Drug Name</th>
                <th className="py-3 px-4 text-left">NDC Code</th>
                <th className="py-3 px-4 text-left">A / C</th>
                <th className="py-3 px-4 text-left">Insurance Payment</th>
                <th className="py-3 px-4 text-left">Pressure Point</th>
                <th className="py-3 px-4 text-left">Report NPT</th>
                <th className="py-3 px-4 text-left">High Price</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-600 odd:bg-white even:bg-gray-50 dark:odd:bg-gray-700 dark:even:bg-gray-800 dark:text-gray-100"
                >
                  <td className="py-3 px-4">{row.date}</td>
                  <td className="py-3 px-4">{row.branchCode}</td>
                  <td className="py-3 px-4">{row.scrCode}</td>
                  <td className="py-3 px-4">{row.rxGroupClass}</td>
                  <td className="py-3 px-4">{row.drugName}</td>
                  <td className="py-3 px-4">{row.ndcCode}</td>
                  <td className="py-3 px-4">{row.a_c}</td>
                  <td className="py-3 px-4">{row.insurancePayment}</td>
                  <td className="py-3 px-4">{row.pressurePoint}</td>
                  <td className="py-3 px-4">{row.reportNpt}</td>
                  <td className="py-3 px-4">{row.highPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls (if multiple pages) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-4 py-2 rounded ${
                  currentPage === pageNum
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------
  // 2) Main Page Return
  // --------------------------------------
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />

      {/* Breadcrumb (if needed) */}
      <PageBreadcrumb pageTitle="" />

      {/* Centered Headline */}
      <div className="text-center my-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Pharmacy Dashboard
        </h1>
      </div>

      {/* Modern Filter Buttons */}
      <div className="flex justify-center items-center gap-6 mb-8">
        <button
          className={`
            relative inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white
            rounded-md shadow-lg transition-transform transform
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              activeButton === "all"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-indigo-500"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:ring-blue-500"
            }
            hover:-translate-y-1 hover:scale-105
            dark:focus:ring-indigo-400
          `}
          onClick={() => setActiveButton("all")}
        >
          All Scripts Audit
        </button>

        <button
          className={`
            relative inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white
            rounded-md shadow-lg transition-transform transform
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              activeButton === "matching"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-indigo-500"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:ring-blue-500"
            }
            hover:-translate-y-1 hover:scale-105
            dark:focus:ring-indigo-400
          `}
          onClick={() => setActiveButton("matching")}
        >
          Matching Scripts Audit
        </button>

        <button
          className={`
            relative inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white
            rounded-md shadow-lg transition-transform transform
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              activeButton === "mismatching"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-indigo-500"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:ring-blue-500"
            }
            hover:-translate-y-1 hover:scale-105
            dark:focus:ring-indigo-400
          `}
          onClick={() => setActiveButton("mismatching")}
        >
          Mismatching Scripts Audit
        </button>
      </div>

      {/* Summary Cards with colored side bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Card 1 */}
        <div className="relative border shadow-sm rounded p-4 text-center bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-full w-1 bg-blue-500 rounded-l" />
          <p className="text-gray-500 text-sm dark:text-gray-300">
            Total Number of Prescriptions in Database
          </p>
          <p className="text-2xl font-semibold mt-2 text-gray-900 dark:text-gray-100">
            26448
          </p>
        </div>

        {/* Card 2 */}
        <div className="relative border shadow-sm rounded p-4 text-center bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-full w-1 bg-red-500 rounded-l" />
          <p className="text-gray-500 text-sm dark:text-gray-300">
            Prescriptions Below Potential
          </p>
          <p className="text-2xl font-semibold mt-2 text-gray-900 dark:text-gray-100">
            14585
          </p>
        </div>

        {/* Card 3 */}
        <div className="relative border shadow-sm rounded p-4 text-center bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-full w-1 bg-green-500 rounded-l" />
          <p className="text-gray-500 text-sm dark:text-gray-300">
            Estimated Max. Net Profit
          </p>
          <p className="text-2xl font-semibold mt-2 text-gray-900 dark:text-gray-100">
            $4,722,161.84
          </p>
        </div>

        {/* Card 4 */}
        <div className="relative border shadow-sm rounded p-4 text-center bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-full w-1 bg-yellow-500 rounded-l" />
          <p className="text-gray-500 text-sm dark:text-gray-300">
            Current Total Net Profit
          </p>
          <p className="text-2xl font-semibold mt-2 text-gray-900 dark:text-gray-100">
            $2,883.38
          </p>
        </div>
      </div>

      {/* Modern Select Options (placed below the summary cards) */}
      <div className="flex flex-wrap items-center gap-4 mb-6 justify-center">
        <select className="appearance-none block w-48 px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
          <option>All Classes</option>
          <option>Class A</option>
          <option>Class B</option>
        </select>
        <select className="appearance-none block w-48 px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
          <option>All RxGroups</option>
          <option>Group A</option>
          <option>Group B</option>
        </select>
        <select className="appearance-none block w-48 px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
          <option>All Prescribers</option>
          <option>Prescriber A</option>
          <option>Prescriber B</option>
        </select>
        <select className="appearance-none block w-48 px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
          <option>All Branches</option>
          <option>Branch A</option>
          <option>Branch B</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500">
          Download CSV
        </button>
      </div>

      {/* Table Section */}
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
