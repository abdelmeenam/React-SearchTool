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
export interface BestAlternative {
  classId: number;
  date: string; // ISO date string, e.g., "2024-01-01T00:00:00Z"
  branchId: number;
  className: string;
  bestNet: number;
  drugId: number;
  scriptCode: string;
  scriptDateTime: string; // ISO date string, e.g., "2024-01-15T22:00:00Z"
  drugName: string;
  drugClass: string;
  branchName: string;
  ndc: string;
  binId: number;
  pcnId: number;
  rxGroupId: number;
  binFullName: string;
  bin: string;
  pcn: string;
  rxgroup: string;
}
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderRequestBody {
  orderItems: OrderItem[];
  searchLogs: SearchLog[];
}

export interface OrderItem {
  drugId: number;
  netPrice: number;
  patientPay: number;
  insurancePay: number;
  acquisitionCost: number;
  additionalCost: number;
  insuranceRxId: number;
  amount: number;
}

export interface SearchLog {
  rxgroupId: number;
  binId: number;
  pcnId: number;
  drugId: number;
  date: string;
  searchType: string;
}

export interface Prescription {
  insuranceId: number;
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
  insurance: any | null;
  bin: string;
  pcn: string;
  binFullName: string;
  binId: number;
  pcnId: number;

  rxgroupId: number;
  rxgroup: string;
  applicationNumber: string;
  applicationType: string;
  strength: string;
  form: string;
  route: string;
  teCode: string;
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
  rxGroup: string; //code
  description: string; //full name
  insuranceBin: string;
  insurancePCN: string;
  insuranceFullName: string;
  helpDeskNumber: string;
}
export interface Bin {
  id: number;
  rxGroup: string; //code
  name: string; //full name
  bin: string;
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
  insuranceId: number;
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
export interface RxGroupModel {
  id: number;
  rxGroup: string;
  insurancePCNId: number;
}
export interface PCNModel {
  id: number;
  pcn: string;
  insuranceId: number;
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
