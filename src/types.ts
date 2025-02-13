export interface Drug {
  id: number;
  name: string;
  ndc: string;
  form: string;
  strength: string;
  classId: number;
  drugClass: string | null;
  acq: number;
  awp: number;
  rxcui: number;
}
export interface Prescription {
  netProfit: any;
  insuranceId: number;
  drugId: number;
  ndcCode: string;
  drugName: string;
  classId: number;
  net: number;
  date: string; // Consider using Date if you plan to parse it: Date | string
  prescriber: string;
  quantity: number;
  acquisitionCost: number;
  rxCui: number;
  insuranceName: string;
  discount: number;
  insurancePayment: number;
  patientPayment: number;
  drugClass: string;
  insurance: any | null; // Define a specific type if available
  drug: any | null; // Define a specific type if available
}
export interface DrugInsuranceInfo {
  insuranceId: number;
  drugId: number;
  ndcCode: string;
  drugName: string;
  drugClassId: number;
  insuranceName: string;
  net: number;
  date: string; // Consider using Date if parsing is needed
  prescriber: string;
  quantity: number;
  acquisitionCost: number;
  discount: number;
  insurancePayment: number;
  patientPayment: number;
  drugClass: string;
  insurance: any | null; // Adjust `any` to a specific type if known
  drug: any | null; // Adjust `any` to a specific type if known
}
export interface DrugTransaction {
  date: string; // ISO 8601 format (e.g., "2025-01-01T22:00:00Z")
  scriptCode: string;
  rxNumber: string;
  user: string;
  drugName: string;
  insurance: string;
  pf: string;
  prescriber: string;
  quantity: number;
  acquisitionCost: number;
  discount: number;
  insurancePayment: number;
  patientPayment: number;
  ndcCode: string;
  netProfit: number;
  drugClass: string;
  highstDrugNDC: string;
  highstDrugName: string;
  highstDrugId: number;
  highstNet: number;
  highstScriptCode: string;
  highstScriptDate: string; // ISO 8601 format
}

export interface Insurance {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface PharmacySale {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  drugId: string;
  drugName: string;
  salePrice: number;
  netPrice: number;
  quantity: number;
  date: string;
  insuranceId: string;
  insuranceName: string;
}

export interface SalesAnalytics {
  totalSales: number;
  totalScripts: number;
  totalRevenue: number;
  belowNetPriceCount: number;
  salesByDrug: {
    [drugName: string]: {
      scripts: number;
      revenue: number;
    };
  };
}
