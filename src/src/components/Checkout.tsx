import React, { useState } from 'react';
import { ArrowLeft, Check, FileText } from 'lucide-react';
import { CartItem, PatientInfo, PrescriptionInfo } from '../types';
import { formatCurrency, calculateSubtotal, calculateTax, calculateTotal } from '../utils/helpers';

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onComplete: (patientInfo: PatientInfo, prescriptionInfo: PrescriptionInfo) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    insuranceProvider: '',
    insuranceNumber: '',
  });
  
  const [prescriptionInfo, setPrescriptionInfo] = useState<PrescriptionInfo>({
    doctorName: '',
    doctorLicense: '',
    prescriptionNumber: '',
    prescriptionDate: '',
    notes: '',
  });
  
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);
  
  const hasRequiredPrescriptions = items.some(item => item.drug.requiresPrescription);
  
  const handlePatientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePrescriptionInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrescriptionInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNextStep = () => {
    if (step === 1) {
      if (!patientInfo.name || !patientInfo.email || !patientInfo.phone || !patientInfo.address || !patientInfo.dateOfBirth) {
        alert('Please fill in all required fields');
        return;
      }
      setStep(hasRequiredPrescriptions ? 2 : 3);
    } else if (step === 2) {
      if (!prescriptionInfo.doctorName || !prescriptionInfo.doctorLicense || !prescriptionInfo.prescriptionNumber || !prescriptionInfo.prescriptionDate) {
        alert('Please fill in all required prescription information');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      onComplete(patientInfo, prescriptionInfo);
    }
  };
  
  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(hasRequiredPrescriptions ? 2 : 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Shopping
      </button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
        
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} mr-2`}>
              {step > 1 ? <Check className="h-5 w-5" /> : '1'}
            </div>
            <span className={`font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-600'}`}>Patient Information</span>
            
            <div className="flex-1 mx-4 h-0.5 bg-gray-200">
              <div className={`h-full bg-blue-600 transition-all ${step > 1 ? 'w-full' : 'w-0'}`}></div>
            </div>
            
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} mr-2`}>
              {step > 2 ? <Check className="h-5 w-5" /> : '2'}
            </div>
            <span className={`font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-600'} ${!hasRequiredPrescriptions ? 'opacity-50' : ''}`}>
              {hasRequiredPrescriptions ? 'Prescription Information' : 'Review'}
            </span>
            
            {hasRequiredPrescriptions && (
              <>
                <div className="flex-1 mx-4 h-0.5 bg-gray-200">
                  <div className={`h-full bg-blue-600 transition-all ${step > 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} mr-2`}>
                  {step > 3 ? <Check className="h-5 w-5" /> : '3'}
                </div>
                <span className={`font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-600'}`}>Review Order</span>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={patientInfo.name}
                    onChange={handlePatientInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={patientInfo.email}
                    onChange={handlePatientInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={patientInfo.phone}
                    onChange={handlePatientInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={patientInfo.dateOfBirth}
                    onChange={handlePatientInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={patientInfo.address}
                    onChange={handlePatientInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider (Optional)</label>
                  <input
                    type="text"
                    id="insuranceProvider"
                    name="insuranceProvider"
                    value={patientInfo.insuranceProvider}
                    onChange={handlePatientInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="insuranceNumber" className="block text-sm font-medium text-gray-700 mb-1">Insurance Policy Number (Optional)</label>
                  <input
                    type="text"
                    id="insuranceNumber"
                    name="insuranceNumber"
                    value={patientInfo.insuranceNumber}
                    onChange={handlePatientInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && hasRequiredPrescriptions && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Prescription Information</h2>
              </div>
              
              <div className="p-4 bg-blue-50 text-blue-700 rounded-md mb-6">
                <p>The following items in your order require a valid prescription:</p>
                <ul className="list-disc list-inside mt-2">
                  {items
                    .filter(item => item.drug.requiresPrescription)
                    .map(item => (
                      <li key={item.drug.id} className="text-sm">{item.drug.name} ({item.drug.dosage})</li>
                    ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-1">Doctor's Name *</label>
                  <input
                    type="text"
                    id="doctorName"
                    name="doctorName"
                    value={prescriptionInfo.doctorName}
                    onChange={handlePrescriptionInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="doctorLicense" className="block text-sm font-medium text-gray-700 mb-1">Doctor's License Number *</label>
                  <input
                    type="text"
                    id="doctorLicense"
                    name="doctorLicense"
                    value={prescriptionInfo.doctorLicense}
                    onChange={handlePrescriptionInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="prescriptionNumber" className="block text-sm font-medium text-gray-700 mb-1">Prescription Number *</label>
                  <input
                    type="text"
                    id="prescriptionNumber"
                    name="prescriptionNumber"
                    value={prescriptionInfo.prescriptionNumber}
                    onChange={handlePrescriptionInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="prescriptionDate" className="block text-sm font-medium text-gray-700 mb-1">Prescription Date *</label>
                  <input
                    type="date"
                    id="prescriptionDate"
                    name="prescriptionDate"
                    value={prescriptionInfo.prescriptionDate}
                    onChange={handlePrescriptionInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Prescription Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={prescriptionInfo.notes}
                    onChange={handlePrescriptionInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          
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
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.drug.image}
                            alt={item.drug.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-800">{item.drug.name}</h4>
                          <p className="text-sm text-gray-500">{item.drug.dosage}</p>
                          {item.drug.requiresPrescription && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                              Prescription
                            </span>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{formatCurrency(item.drug.price)} × {item.quantity}</p>
                          <p className="text-blue-600 font-medium">{formatCurrency(item.drug.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="rounded-md border border-gray-200">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-medium text-gray-800">Patient Information</h3>
                      </div>
                      
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Name</p>
                          <p className="font-medium text-gray-800">{patientInfo.name}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="font-medium text-gray-800">{patientInfo.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-500">Phone</p>
                          <p className="font-medium text-gray-800">{patientInfo.phone}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-500">Date of Birth</p>
                          <p className="font-medium text-gray-800">{patientInfo.dateOfBirth}</p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <p className="text-gray-500">Delivery Address</p>
                          <p className="font-medium text-gray-800">{patientInfo.address}</p>
                        </div>
                        
                        {patientInfo.insuranceProvider && (
                          <div>
                            <p className="text-gray-500">Insurance</p>
                            <p className="font-medium text-gray-800">{patientInfo.insuranceProvider}</p>
                          </div>
                        )}
                        
                        {patientInfo.insuranceNumber && (
                          <div>
                            <p className="text-gray-500">Policy Number</p>
                            <p className="font-medium text-gray-800">{patientInfo.insuranceNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {hasRequiredPrescriptions && (
                      <div className="rounded-md border border-gray-200">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <h3 className="font-medium text-gray-800">Prescription Information</h3>
                        </div>
                        
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Doctor's Name</p>
                            <p className="font-medium text-gray-800">{prescriptionInfo.doctorName}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-500">Doctor's License</p>
                            <p className="font-medium text-gray-800">{prescriptionInfo.doctorLicense}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-500">Prescription Number</p>
                            <p className="font-medium text-gray-800">{prescriptionInfo.prescriptionNumber}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-500">Prescription Date</p>
                            <p className="font-medium text-gray-800">{prescriptionInfo.prescriptionDate}</p>
                          </div>
                          
                          {prescriptionInfo.notes && (
                            <div className="md:col-span-2">
                              <p className="text-gray-500">Notes</p>
                              <p className="font-medium text-gray-800">{prescriptionInfo.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 rounded-md border border-gray-200 p-4">
                    <h3 className="font-medium text-gray-800 mb-4">Order Summary</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-800 font-medium">{formatCurrency(subtotal)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (7%)</span>
                        <span className="text-gray-800 font-medium">{formatCurrency(tax)}</span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span className="text-blue-600">{formatCurrency(total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevStep}
              className={`px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors ${step === 1 ? 'invisible' : ''}`}
            >
              Back
            </button>
            
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {step === 3 ? 'Place Order' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;