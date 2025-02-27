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
  drugId: number;
  ndcCode: string;
  drugName: string;
  drugClassId: number;
  insuranceName: string;
  net: number;
  date: string; // Alternatively, use Date if you parse this value
  prescriber: string;
  quantity: number;
  acquisitionCost: number;
  discount: number;
  insurancePayment: number;
  patientPayment: number;
  drugClass: string;
  branchName: string;
}

export interface DrugInsuranceInfo {
  insuranceId: number;
  drugId: number;
  ndcCode: string;
  drugName: string;
  drugClassId: number;
  insuranceName: string;
  net: number;
  date: string;
  prescriber: string;
  quantity: number;
  acquisitionCost: number;
  discount: number;
  insurancePayment: number;
  patientPayment: number;
  drugClass: string;
  insurance: any | null;
  drug: any | null;
}
export interface Insurance {
  id: number;
  name: string;
  description: string;
  bin: string;
  pcn: string;
  helpDeskNumber: string;
}

export interface DrugTransaction {
  date: string;
  scriptCode: string;
  rxNumber: string;
  user: string;
  drugName: string;
  drugId: number;
  insurance: string;
  pf: string;
  prescriber: string;
  quantity: number;
  acquisitionCost: number;
  discount: number;
  insurancePayment: number;
  patientPayment: number;
  branchCode: string;
  ndcCode: string;
  netProfit: number;
  drugClass: string;
  highstDrugNDC: string;
  highstDrugName: string;
  highstDrugId: number;
  highstNet: number;
  highstScriptCode: string;
  highstScriptDate: string;
}

export interface ScriptData {
  id: number;
  drugName: string;
  insuranceName: string;
  drugClassName: string;
  prescriberName: string;
  userName: string;
  pf: string;
  quantity: number;
  acquisitionCost: number;
  discount: number;
  insurancePayment: number;
  patientPayment: number;
  netProfit: number;
  ndcCode: string;
  branchName: string;
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
