import React, { useEffect, useState } from 'react';
import { BarChart3, AlertTriangle, PieChart, Pill , ChevronLeft, ChevronRight  } from 'lucide-react';
import { api } from '../api/api';
import { PharmacySale, Prescription, SalesAnalytics } from '../types';
import { format } from 'date-fns';
import axios from 'axios';


export const oldDashboard: React.FC = () => {
  const [sales, setSales] = useState<PharmacySale[]>([]);
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [latestScript, setLatestScript] = useState<Prescription [] | null>([]);
  const [totalNet, setTotalNet] = useState<number>(0);
  const [groupedData, setGroupedData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Number of records per page
  
  useEffect(() => {
    const fetchData = async () => {
        const result = await axios.get('http://localhost:5107/drug/GetAllLatest');
        console.log(result.data);
        setLatestScript(result.data);
    };
    fetchData();
  }, []);



  useEffect(() => {
    if (latestScript.length > 0) {
      const totalNet = latestScript.reduce((acc, entry) => acc + entry.net, 0);
      setTotalNet(totalNet);

    // 🔹 Step 1: Define the Insurance Name Mapping
      const insuranceMapping = {
        'AL': 'Aetna (AL)',
        'BW': 'aetna (BW)',
        'AD': 'Aetna Medicare (AD)',
        'AF': 'Anthem BCBS (AF)',
        'DS': 'Blue Cross Blue Shield (DS)',
        'CA': 'blue shield medicare (CA)',
        'FQ': 'Capital Rx (FQ)',
        'BF': 'Caremark (BF)',
        'ED': 'CatalystRx (ED)',
        'AM': 'Cigna (AM)',
        'BO': 'Default Claim Format (BO)',
        'AP': 'Envision Rx Options (AP)',
        'CG': 'Express Scripts (CG)',
        'BI': 'Horizon (BI)',
        'AJ': 'Humana Medicare (AJ)',
        'BP': 'informedRx (BP)',
        'AO': 'MEDCO HEALTH (AO)',
        'AC': 'MEDCO MEDICARE PART D (AC)',
        'AQ': 'MEDGR (AQ)',
        'CC': 'MY HEALTH LA (CC)',
        'AG': 'Navitus Health Solutions (AG)',
        'AH': 'OptumRx (AH)',
        'AS': 'PACIFICARE LIFE AND H (AS)',
        'FJ': 'Paramount Rx (FJ)',
        'X ': 'PF - DEFAULT (X )',
        'EA': 'Pharmacy Data Management (EA)',
        'DW': 'phcs (DW)',
        'AX': 'PINNACLE (AX)',
        'BN': 'Prescription Solutions (BN)',
        'AA': 'Tri-Care Express Scripts (AA)',
        'AI': 'United Healthcare (AI)'
      };

      
    // 🔹 Step 2: Filter out records with empty insurance names
    const filteredData = latestScript.filter(item => item.insurance?.name?.trim());

      const grouped = filteredData.reduce((acc, item) => {
        const key = `${item.classId}-${item.insuranceId}`;
        if (!acc[key]) acc[key] = { highestNet: 0, records: [] };

        acc[key].records.push(item);

        // acc[key].highestNet = Math.max(acc[key].highestNet, item.net); // Store highest net per group
        if (item.net > acc[key].highestNet) {
          acc[key].highestNet = item.net;
          acc[key].highestNdc = item.ndcCode;
          acc[key].drugName = item.drugName;
        }

        return acc;
      }, {});
      

      const processed = Object.values(grouped).flatMap(({ highestNet, highestNdc,drugName, records }) =>
        records.map((item) => ({
          ...item,
          insuranceName: insuranceMapping[item.insurance.name] || item.insurance.name, // Map insurance name
          highestNet,
          highestNdc, // Keep the highest NDC for the group
          drugName,
          difference: highestNet - item.net,
        }))
      );



      console.log(processed);
      setGroupedData(processed);

    }
  }, [latestScript]);


  const belowNetPriceSales = sales.filter(sale => sale.salePrice < sale.netPrice);
  // 🔹 Calculate Pagination
  const totalPages = Math.ceil(groupedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRecords = groupedData.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Pharmacy Dashboard</h1>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Scripts</p>
              <p className="text-3xl font-semibold">{latestScript?.length}</p>
            </div>
            <Pill className="h-10 w-10" />
          </div>
        </div>

        

        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Sales</p>
              <p className="text-3xl font-semibold">{analytics?.totalSales}</p>
            </div>
            <BarChart3 className="h-10 w-10" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-semibold">
                ${totalNet?.toFixed(2)}
              </p>
            </div>
            <PieChart className="h-10 w-10" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Below Net Price</p>
              <p className="text-3xl font-semibold">{analytics?.belowNetPriceCount}</p>
            </div>
            <AlertTriangle className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* Processed Data Table */}


  <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Audit Report</h2>
     {/* 🔹 Table with Pagination */}
     <div className="overflow-x-auto">
        <table className="table-auto min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Insurance Name</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Drug Class</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Drug Name</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">NDC Code</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Prescriber</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Net</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Highest Net</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Difference</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Highest NDC</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Highest Drug</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-250">
            {currentRecords.map((item, index) => (
              <tr key={index}>
                <td className="px-2 py-2 text-sm text-gray-900">{item.date}</td>
                <td className="px-2 py-2 text-sm text-gray-900">{item.insuranceName}</td>
                <td className="px-2 py-2 text-sm text-gray-900">{item.drugClass}</td>
                <td className="px-2 py-2 text-sm text-gray-900">{item.drugName}</td>
                <td className="px-2 py-2 text-sm text-gray-900">{item.ndcCode}</td>
                <td className="px-2 py-2 text-sm text-gray-900">{item.prescriber}</td>
                <td className="px-2 py-2 text-sm text-gray-900">${item.net.toFixed(2)}</td>
                <td className="px-2 py-2 text-sm text-blue-600 font-bold">${item.highestNet.toFixed(2)}</td>
                <td className="px-2 py-2 text-sm text-red-600">${item.difference.toFixed(2)}</td>
                <td className="px-2 py-2 text-sm text-blue-600 font-bold">{item.highestNdc}</td>
                <td className="px-2 py-2 text-sm text-blue-600 font-bold">{item.drugName}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
          }`}
        >
          <ChevronLeft className="inline-block w-4 h-4 mr-1" /> Previous
        </button>

        <p className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </p>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
          }`}
        >
          Next <ChevronRight className="inline-block w-4 h-4 ml-1" />
        </button>
      </div>

      </div>
    </div>
  );
};