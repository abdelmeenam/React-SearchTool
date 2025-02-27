import axios from "axios";
import { Drug, Insurance, PharmacySale, SalesAnalytics } from "../types";
import { mockDrugs, mockInsurances, mockPharmacySales, mockUsers, User } from "./mockData";

const API_BASE_URL = "http://localhost:5107/";
interface LoginResponse {
  user: Pick<User, "id" | "email" | "role">;
}
export const api = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const user = mockUsers.find((user) => user.email === email);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.password !== password) {
      throw new Error("Invalid credentials");
    }

    return {
      user: { id: user.id, email: user.email, role: user.role },
    };
  },

  searchDrugsSuggestions: async (query: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const results = mockDrugs.filter(
      (drug) =>
        drug.name.toLowerCase().includes(query.toLowerCase()) ||
        drug.className.toLowerCase().includes(query.toLowerCase()) ||
        drug.ndc.some((code) => code.includes(query))
    );
    return results;
  },

  searchDrugs: async (query: string) => {
    const results = mockDrugs.filter(
      (drug) =>
        drug.name.toLowerCase().includes(query.toLowerCase()) ||
        drug.className.toLowerCase().includes(query.toLowerCase())
    );
    return results;
  },

  uploadDrugsExcel: async (file: File) => {
    // In a real implementation, this would send the file to the server
    // For now, we'll just return a success message
    return { message: "File uploaded successfully" };
  },

  getInsuranceForDrug: async (drugId: string) => {
    return mockInsurances;
  },

  getDrugDetails: async (drugId: string, ndcCode: string) => {
    const drug = mockDrugs.find((d) => d.id === drugId);
    if (!drug) {
      throw new Error("Drug not found");
    }
    return drug;
  },

  getPharmacySales: async () => {
    return mockPharmacySales;
  },

  getSalesAnalytics: async (): Promise<SalesAnalytics> => {
    const sales = mockPharmacySales;
    const analytics: SalesAnalytics = {
      totalSales: sales.reduce((sum, sale) => sum + sale.quantity, 0),
      totalScripts: sales.length,
      totalRevenue: sales.reduce(
        (sum, sale) => sum + sale.salePrice * sale.quantity,
        0
      ),
      belowNetPriceCount: sales.filter((sale) => sale.salePrice < sale.netPrice)
        .length,
      salesByDrug: {},
    };

    sales.forEach((sale) => {
      if (!analytics.salesByDrug[sale.drugName]) {
        analytics.salesByDrug[sale.drugName] = {
          scripts: 0,
          revenue: 0,
        };
      }
      analytics.salesByDrug[sale.drugName].scripts++;
      analytics.salesByDrug[sale.drugName].revenue +=
        sale.salePrice * sale.quantity;
    });

    return analytics;
  },
};
