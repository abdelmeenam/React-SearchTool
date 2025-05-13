import { useState } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiClock, FiCheckCircle, FiTruck, FiPackage } from 'react-icons/fi';

const OrderHistoryPage = () => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Sample order data
  type Order = {
    id: string;
    date: string;
    status: 'delivered' | 'shipped' | 'processing';
    total: number;
    items: { name: string; price: number; quantity: number }[];
    shipping: string;
    payment: string;
  };

  const orders: Order[] = [
    {
      id: 'ORD-2023-8765',
      date: '2023-11-15',
      status: 'delivered',
      total: 148.75,
      items: [
        { name: 'Amoxicillin 500mg Capsules', price: 24.99, quantity: 3 },
        { name: 'Lisinopril 10mg Tablets', price: 12.50, quantity: 2 },
      ],
      shipping: 'Express Delivery',
      payment: 'Credit Card (•••• 4242)'
    },
    {
      id: 'ORD-2023-6543',
      date: '2023-10-28',
      status: 'shipped',
      total: 89.97,
      items: [
        { name: 'Atorvastatin 20mg Tablets', price: 29.99, quantity: 2 },
        { name: 'Metformin 500mg Tablets', price: 9.99, quantity: 3 },
      ],
      shipping: 'Standard Delivery',
      payment: 'PayPal'
    },
    {
      id: 'ORD-2023-4321',
      date: '2023-09-05',
      status: 'processing',
      total: 56.25,
      items: [
        { name: 'Omeprazole 20mg Capsules', price: 18.75, quantity: 3 },
      ],
      shipping: 'Standard Delivery',
      payment: 'PayPal'

    },
  ];

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => 
      (filterStatus === 'all' || order.status === filterStatus) &&
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'highest') return b.total - a.total;
      if (sortBy === 'lowest') return a.total - b.total;
      return 0;
    });

  const getStatusBadge = (status: 'delivered' | 'shipped' | 'processing' | 'unknown') => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
          <FiCheckCircle className="text-green-500" /> Delivered
        </span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
          <FiTruck className="text-blue-500" /> Shipped
        </span>;
      case 'processing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <FiClock className="text-yellow-500" /> Processing
        </span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Order History</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage your past and current orders
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders or medications..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                {/* Order Summary */}
                <div 
                  className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <FiPackage className="text-blue-500 dark:text-blue-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{order.id}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(order.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <div className="text-right hidden md:block">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                      <p className="font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                      {expandedOrder === order.id ? (
                        <FiChevronUp className="text-gray-500" />
                      ) : (
                        <FiChevronDown className="text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Order Details (Expanded) */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Medications</h4>
                        <ul className="space-y-3">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                              <div>
                                <p className="text-gray-900 dark:text-white">{item.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Order Info */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Order Information</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Shipping Method</p>
                            <p className="text-gray-900 dark:text-white">{order.shipping}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                            <p className="text-gray-900 dark:text-white">{order.payment}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Order Total</p>
                            <div className="mt-1 space-y-1">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                                <span className="text-gray-900 dark:text-white">
                                  ${(order.total * 0.9).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Tax</span>
                                <span className="text-gray-900 dark:text-white">
                                  ${(order.total * 0.1).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span className="font-medium text-gray-900 dark:text-white">Total</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  ${order.total.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex flex-wrap gap-3">
                          <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition">
                            Track Order
                          </button>
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                            Download Invoice
                          </button>
                          {order.status === 'delivered' && (
                            <button className="px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition">
                              Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
              <div className="max-w-md mx-auto">
                <FiPackage className="mx-auto text-gray-400 text-4xl mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm ? 
                    "No orders match your search criteria" : 
                    "You haven't placed any orders yet"}
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Browse Medications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;