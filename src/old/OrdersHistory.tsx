import { useEffect, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiPackage,
} from "react-icons/fi";
import axios from "axios";
import { OrderReadDto } from "../types";
import axiosInstance from "../api/axiosInstance";

const OrderHistory = () => {
  const [orders, setOrders] = useState<OrderReadDto[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get<OrderReadDto[]>(
          "/order/GetAllOrdersByUserId?userId=64"
        );
        console.log("Fetched orders:", res.data);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Fake status for visual demo (you can improve this with backend status field)
  const getStatus = (
    order: OrderReadDto
  ): "delivered" | "shipped" | "processing" => {
    if (order.totalInsurancePay > 0 && order.totalPatientPay > 0)
      return "delivered";
    if (order.totalInsurancePay > 0) return "shipped";
    return "processing";
  };

  const getStatusBadge = (status: "delivered" | "shipped" | "processing") => {
    switch (status) {
      case "delivered":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
            <FiCheckCircle className="text-green-500" /> Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
            <FiTruck className="text-blue-500" /> Shipped
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <FiClock className="text-yellow-500" /> Processing
          </span>
        );
    }
  };

  const filteredOrders = orders
    .filter(
      (order) =>
        (filterStatus === "all" || getStatus(order) === filterStatus) &&
        (order.id.toString().includes(searchTerm.toLowerCase()) ||
          order.orderItemReadDtos.some((item) =>
            item.searchLogReadDto.drugId
              .toString()
              .includes(searchTerm.toLowerCase())
          ))
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "highest") return b.totalNet - a.totalNet;
      if (sortBy === "lowest") return a.totalNet - b.totalNet;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Order History
        </h1>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* <select
            className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select> */}

          <select
            className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </select>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {filteredOrders.length ? (
            filteredOrders.map((order) => {
              const status = getStatus(order);
              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Order Summary */}
                  <div
                    className="p-4 md:p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order.id ? null : order.id
                      )
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <FiPackage className="text-blue-500 dark:text-blue-400 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium text-gray-900 dark:text-white hidden md:block">
                        ${order.totalNet.toFixed(2)}
                      </p>
                      {/* {getStatusBadge(status)}
                    {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />} */}
                    </div>
                  </div>

                  {/* Order Details */}
                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 md:p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Order Items
                      </h4>
                      <ul className="space-y-5">
                        {order.orderItemReadDtos.map((item) => (
                          <li
                            key={item.id}
                            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                          >
                            <div className="flex justify-between flex-wrap gap-4">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Drug Name: {item.drugName}
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Drug NDC: {item.ndc}
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Insurance Name: {item.insuranceRxName}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-300">
                                  Amount: {item.amount}
                                </p>
                              </div>
                              <div className="text-sm text-green-600 dark:text-gray-300">
                                <p>Net Price: ${item.netPrice.toFixed(2)}</p>
                                <p>
                                  Patient Pay: ${item.patientPay.toFixed(2)}
                                </p>
                                <p>
                                  Insurance Pay: ${item.insurancePay.toFixed(2)}
                                </p>
                                <p>
                                  Acquisition Cost: $
                                  {item.acquisitionCost.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            {item.searchLogReadDto && (
                              <div className="mt-3 text-sm text-gray-500 dark:text-gray-300 border-t pt-3 border-gray-200 dark:border-gray-600">
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                  Search Log
                                </p>
                                <p>
                                  Search Type:{" "}
                                  {item.searchLogReadDto.searchType}
                                </p>
                                <p>
                                  Drug Name: {item.searchLogReadDto.drugName}
                                </p>
                                <p>Drug NDC: {item.searchLogReadDto.ndc}</p>
                                <p>
                                  BIN:{" "}
                                  {item.searchLogReadDto.binName || "NA"}
                                </p>
                                <p>
                                  PCN:{" "}
                                  {item.searchLogReadDto.pcnName || "NA"}
                                </p>
                                <p>
                                  RxGroup:{" "}
                                  {item.searchLogReadDto.rxgroupName}
                                </p>
                                <p>
                                  Date:{" "}
                                  {new Date(
                                    item.searchLogReadDto.date
                                  ).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
