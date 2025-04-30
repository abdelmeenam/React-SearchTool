import React from 'react';
import { Download, Check } from 'lucide-react';
import { OrderSummary } from '../types';
import { formatCurrency } from '../utils/helpers';

interface ReceiptProps {
  orderSummary: OrderSummary;
  onReturnToShopping: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ orderSummary, onReturnToShopping }) => {
  const { orderId, orderDate, patientInfo, prescriptionInfo, items, subtotal, tax, total } = orderSummary;
  
  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-center">
          <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-green-800">Order Confirmed!</h2>
            <p className="text-green-700">Thank you for your order. Your prescription has been received and is being processed.</p>
          </div>
        </div>
        
        <div id="receipt" className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start pb-6 border-b border-gray-200 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Receipt</h1>
              <p className="text-gray-600">Order #{orderId}</p>
              <p className="text-gray-600">Date: {orderDate}</p>
            </div>
            
            <div className="text-right">
              <h2 className="text-xl font-bold text-blue-600">MediScript</h2>
              <p className="text-gray-600">Online Pharmacy</p>
              <p className="text-gray-600">support@mediscript.com</p>
              <p className="text-gray-600">1-800-MEDI-RX</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Patient Information</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><span className="text-gray-600">Name:</span> {patientInfo.name}</p>
                <p><span className="text-gray-600">Email:</span> {patientInfo.email}</p>
                <p><span className="text-gray-600">Phone:</span> {patientInfo.phone}</p>
                <p><span className="text-gray-600">Address:</span> {patientInfo.address}</p>
                {patientInfo.insuranceProvider && (
                  <p><span className="text-gray-600">Insurance:</span> {patientInfo.insuranceProvider}</p>
                )}
              </div>
            </div>
            
            {prescriptionInfo.doctorName && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Prescription Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><span className="text-gray-600">Doctor:</span> {prescriptionInfo.doctorName}</p>
                  <p><span className="text-gray-600">License:</span> {prescriptionInfo.doctorLicense}</p>
                  <p><span className="text-gray-600">Prescription #:</span> {prescriptionInfo.prescriptionNumber}</p>
                  <p><span className="text-gray-600">Date:</span> {prescriptionInfo.prescriptionDate}</p>
                </div>
              </div>
            )}
          </div>
          
          <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
          <div className="bg-gray-50 rounded-md mb-6 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Item</th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">Quantity</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">Price</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{item.drug.name}</p>
                        <p className="text-sm text-gray-500">{item.drug.dosage}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(item.drug.price)}</td>
                    <td className="py-3 px-4 text-right font-medium">{formatCurrency(item.drug.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax (7%)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-semibold border-t border-gray-200">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600">
            <p>Thank you for choosing MediScript for your medication needs.</p>
            <p className="mt-1">If you have any questions, please contact our customer service at 1-800-MEDI-RX.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <button
            onClick={handlePrintReceipt}
            className="mb-4 sm:mb-0 flex items-center px-6 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Print Receipt
          </button>
          
          <button
            onClick={onReturnToShopping}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;