export interface Drug {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'pain-relief' | 'antibiotics' | 'allergy' | 'cardiovascular' | 'diabetes';
  requiresPrescription: boolean;
  dosage: string;
  image: string;
}

export interface CartItem {
  drug: Drug;
  quantity: number;
}

export interface PatientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

export interface PrescriptionInfo {
  doctorName: string;
  doctorLicense: string;
  prescriptionNumber: string;
  prescriptionDate: string;
  notes?: string;
}

export interface OrderSummary {
  patientInfo: PatientInfo;
  prescriptionInfo: PrescriptionInfo;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  orderId: string;
  orderDate: string;
}