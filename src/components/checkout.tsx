// components/Checkout.tsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { CreditCard, Loader2, CheckCircle, FileText, Check, ArrowLeft } from "lucide-react";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

interface PatientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  // Add other patient fields as needed
}

interface PrescriptionInfo {
  doctorName: string;
  // Add other prescription fields as needed
}

export const Checkout = ({ onBack }: { onBack: () => void }) => {
  const { items, closeCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [prescriptionInfo, setPrescriptionInfo] = useState<PrescriptionInfo>({
    doctorName: ''
  });

  const total = items.reduce(
    (sum, item) => sum + item.drug.acq * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsSuccess(true);
    // Clear cart after 2 seconds
    setTimeout(() => {
      closeCart();
      setIsSuccess(false);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="p-6 text-center mt-11">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Order Placed Successfully!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Thank you for your purchase.
        </p>
      </div>
    );
  }

  return (
    <div className="container  px-4 py-8 mt-11 ">
      <button
        onClick={onBack}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Shopping
      </button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
        
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                } mr-2`}>
                  {step > stepNumber ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                <span className={`font-medium ${
                  step >= stepNumber ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {stepNumber === 1 ? 'Patient Info' : 
                   stepNumber === 2 ? 'Prescription' : 'Review'}
                </span>
                
                {stepNumber < 3 && (
                  <div className="flex-1 mx-4 h-0.5 bg-gray-200">
                    <div className={`h-full bg-blue-600 transition-all ${
                      step > stepNumber ? 'w-full' : 'w-0'
                    }`}></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: Patient Information */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={patientInfo.email}
                    onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={patientInfo.phone}
                    onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    value={patientInfo.address}
                    onChange={(e) => setPatientInfo({...patientInfo, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Prescription Information */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Prescription Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor's Name *</label>
                  <input
                    type="text"
                    value={prescriptionInfo.doctorName}
                    onChange={(e) => setPrescriptionInfo({...prescriptionInfo, doctorName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Order Review */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Review Your Order</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="rounded-md border border-gray-200 divide-y">
                    <div className="p-4 bg-gray-50">
                      <h3 className="font-medium text-gray-800">Order Items</h3>
                    </div>
                    
                    {items.map((item) => (
                      <div key={item.drug.id} className="p-4 flex items-center">
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-800">{item.drug.name}</h4>
                          <p className="text-sm text-gray-500">Strength: {item.drug.strength}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {formatCurrency(item.drug.acq)} × {item.quantity}
                          </p>
                          <p className="text-blue-600 font-medium">
                            {formatCurrency(item.drug.acq * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Patient Info Review */}
                  <div className="mt-6 rounded-md border border-gray-200">
                    <div className="p-4 bg-gray-50 border-b">
                      <h3 className="font-medium text-gray-800">Patient Information</h3>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium">{patientInfo.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{patientInfo.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium">{patientInfo.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Address</p>
                        <p className="font-medium">{patientInfo.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Prescription Info Review */}
                  {step >= 2 && (
                    <div className="mt-4 rounded-md border border-gray-200">
                      <div className="p-4 bg-gray-50 border-b">
                        <h3 className="font-medium text-gray-800">Prescription Information</h3>
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Doctor's Name</p>
                          <p className="font-medium">{prescriptionInfo.doctorName}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="bg-gray-50 rounded-md border border-gray-200 p-4">
                    <h3 className="font-medium text-gray-800 mb-4">Order Summary</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-800 font-medium">
                          {formatCurrency(items.reduce((sum, item) => sum + item.drug.acq * item.quantity, 0))}
                        </span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span className="text-blue-600">
                            {formatCurrency(total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className={`w-full mt-6 py-2 px-4 rounded-md text-white ${
                        isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step < 3 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setStep(step > 1 ? step - 1 : 1)}
                className={`px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors ${
                  step === 1 ? 'invisible' : ''
                }`}
              >
                Back
              </button>
              
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};