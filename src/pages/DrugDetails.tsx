import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Pill, AlertCircle, Repeat, ArrowUpDown } from "lucide-react";
import { api } from "../api/api";
import { Drug, Prescription } from "../types";
import axios from "axios";
import { motion } from "framer-motion";

export const DrugDetails: React.FC = () => {
  const { drugId } = useParams();
  const [searchParams] = useSearchParams();

  const ndcCode = searchParams.get("ndc");
  const insuranceId = searchParams.get("insuranceId");
  console.log(insuranceId);
  const [drug, setDrug] = useState<Drug | null>(null);
  const [otherDrugs, setOtherDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [className, setClassName] = useState("");
  const [drugDetial, setDrugDetail] = useState<Prescription | null>(null);
  const [sortedAlternatives, setSortedAlternatives] = useState<Prescription[]>(
    []
  );
  const [showOtherAlternatives, setShowOtherAlternatives] = useState(false);
  function padCode(code) {
    return code.padStart(11, "0");
  }
  const toggleOtherAlternatives = () => {
    setShowOtherAlternatives(!showOtherAlternatives);
  };
  const [selectedInsurance, setSelectedInsurance] = useState<string>("");
  useEffect(() => {
    const fetchDrugDetails = async () => {
      if (!ndcCode || !insuranceId) {
      }

      try {
        var response2;
        //http://localhost:5107/drug/SearchByIdNdc?id=2445&ndc=69367024516
        if (!ndcCode || !insuranceId) {
          const response = await axios.get(
            `http://ec2-13-60-83-232.eu-north-1.compute.amazonaws.com:5004/drug/GetDrugById?id=${drugId}`
          );
          setDrug(response.data);
          console.log(response.data);
          response2 = await axios.get(
            `http://ec2-13-60-83-232.eu-north-1.compute.amazonaws.com:5004/drug/GetAllDrugs?classId=${response.data.classId}`
          );
          setSortedAlternatives(response2.data);
          console.log("sdsad", response2.data);
          const response3 = await axios.get(
            `http://ec2-13-60-83-232.eu-north-1.compute.amazonaws.com:5004/drug/GetClassById?id=${response.data.classId}`
          );
          setClassName(response3.data.name);
        } else {
          const response = await axios.get(
            `http://ec2-13-60-83-232.eu-north-1.compute.amazonaws.com:5004/drug/SearchByNdc?ndc=${ndcCode}`
          );
          const drugData = response.data;
          console.log("here : ", response.data);
          setDrug(drugData);
          console.log(drugData.id, insuranceId);
          response2 = await axios.get(
            `http://ec2-13-60-83-232.eu-north-1.compute.amazonaws.com:5004/drug/GetDetails?ndc=${ndcCode}&insuranceId=${insuranceId}`
          );
          console.log("here 2 : ", response2.data);
          setDrugDetail(response2.data);
          console.log("temp : ", drugData.classId);
          const response3 = await axios.get(
            `http://ec2-13-60-83-232.eu-north-1.compute.amazonaws.com:5004/drug/GetClassById?id=${drugData?.classId}`
          );
          setClassName(response3.data.name);
          console.log("here3 : ", response3.data.name);
          if (response2.data && className != "other") {
            const response4 = await axios.get(
              `http://ec2-13-60-83-232.eu-north-1.compute.amazonaws.com:5004/drug/GetAltrantives?className=${response3.data.name}&insuranceId=${insuranceId}`
            );
            console.log(response4.data);
            const list = response4.data.filter(
              (item) => item.drugName !== response2.data.drugName
            );
            setSortedAlternatives(list);
          } else {
            const response5 = await axios.get(
              `http://ec2-13-60-83-232.eu-north-1.compute.amazonaws.com:5004/drug/GetDrugsByClass?classId=${drugData?.classId}`
            );
            console.log(response5.data);
            setOtherDrugs(response5.data);
          }
        }
      } catch (err) {
        setError("Failed to load drug details");
      } finally {
        setLoading(false);
      }
    };

    fetchDrugDetails();
  }, [drugId, ndcCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !drug) {
    return (
      <div className="text-center text-red-600 p-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>{error || "Drug not found"}</p>
      </div>
    );
  }
  const handleSort = () => {
    const sorted = [...sortedAlternatives].sort((a, b) => b.net - a.net);
    setSortedAlternatives(sorted);
  };
  const handleInsuranceFilterChange = (event) => {
    setSelectedInsurance(event.target.value);
  };

  const alternativesWithInsurance = sortedAlternatives.filter(
    (alt) => alt.insuranceName
  );
  const uniqueInsuranceNames = [
    ...new Set(alternativesWithInsurance.map((alt) => alt.insuranceName)),
  ];
  const alternativesWithoutInsurance = sortedAlternatives.filter(
    (alt) => !alt.insuranceName
  );

  return (
    <motion.div>
      <div className="max-w-8xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              <Pill className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">{drug.name}</h1>
                <p className="text-blue-100">NDC: {padCode(drug.ndc)}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Drug Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Drug Information
              </h2>
              {!drugDetial ? (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Class Name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {className}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          ACQ
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          ${drug.acq.toFixed(2)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          AWP
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          ${drug.awp}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Strength
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {drug.strength}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Form
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {drug.form}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="text-center text-2xl font-bold my-4">
                    Other Drugs
                  </div>{" "}
                  {/* <div className="overflow-x-auto pt-9">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ACQ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          AWP
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          form
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Strength
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {otherDrugs.map((alt) => (
                        <tr key={alt.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {alt.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              <div>${alt.acq}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ${alt.awp}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">{alt.form}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {alt.strength ? alt.strength : "NA"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}
                </>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Class Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {className}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">ACQ</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        ${drug.acq.toFixed(2)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">AWP</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        ${drug.awp}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Strength
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {drug.strength}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Net</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        ${drugDetial.net}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Insurance Pay
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        ${drugDetial.insurancePayment}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Patient Pay
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        ${drugDetial.patientPayment}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Quantity
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {drugDetial.quantity}
                      </dd>
                      </div>
                      
                  </dl>
                </div>
              )}
            </section>

            {sortedAlternatives.length > 0 && (
              <>
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Repeat className="h-5 w-5 mr-2" />
                      Alternative Medications with Insurance
                    </h2>
                    <div
                      className="flex items-center text-sm text-gray-500"
                      onClick={handleSort}
                    >
                      <ArrowUpDown className="h-4 w-4 mr-1" />
                      Sorted by Net Price
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="insuranceFilter"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Filter by Insurance Name
                    </label>
                    <select
                      id="insuranceFilter"
                      value={selectedInsurance}
                      onChange={handleInsuranceFilterChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">All</option>
                      {uniqueInsuranceNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Class
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            NDC Codes
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Insurance
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Net Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Insurance Coverage
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient Pay
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ACQ
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {alternativesWithInsurance
                          .filter(
                            (alt) =>
                              !selectedInsurance ||
                              alt.insuranceName === selectedInsurance
                          )
                          .map((alt) => (
                            <tr key={alt.ndcCode} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  <a
                                    href={`/drug/${alt.drugId}`}
                                    className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                                  >
                                    {alt.drugName}
                                  </a>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {className}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-500">
                                  <a
                                    href={`https://ndclist.com/ndc/${padCode(
                                      alt.ndcCode
                                    )}`}
                                    className="text-blue-500 hover:text-blue-700 hover:underline transition duration-200"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {padCode(alt.ndcCode)}
                                  </a>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-500">
                                  <div>{alt.insuranceName ?? "NA"}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {alt.insuranceName
                                    ? "$" + alt.net.toFixed(2)
                                    : "NA"}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  {alt.insuranceName
                                    ? "$" + alt.insurancePayment.toFixed(2)
                                    : "NA"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {alt.insuranceName
                                    ? "$" + alt.patientPayment.toFixed(2)
                                    : "NA"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {alt.insuranceName ? alt.quantity : "NA"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {alt.acquisitionCost }
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <button
                  onClick={toggleOtherAlternatives}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  {showOtherAlternatives
                    ? "Hide Other Alternatives"
                    : "Show Other Alternatives"}
                </button>
                {showOtherAlternatives && (
                  <section className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Alternative Medications without Insurance
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Class
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              NDC Codes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ACQ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {alternativesWithoutInsurance.map((alt) => (
                            <tr key={alt.ndcCode} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  <a
                                    href={`/drug/${alt.drugId}`}
                                    className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                                  >
                                    {alt.drugName}
                                  </a>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {className}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-500">
                                  <a
                                    href={`https://ndclist.com/ndc/${padCode(
                                      alt.ndcCode
                                    )}`}
                                    className="text-blue-500 hover:text-blue-700 hover:underline transition duration-200"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {padCode(alt.ndcCode)}
                                  </a>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {alt.acquisitionCost}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
