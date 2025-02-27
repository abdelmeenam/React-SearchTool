import { Drug, Insurance, PharmacySale } from "../types";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In production, store hashed passwords!
  role: string;
}
export const mockDrugs: Drug[] = [
  {
    id: "d1",
    name: "Lisinopril",
    className: "ACE Inhibitor",
    ndc: ["00093-0130-01", "00093-0130-05", "00093-0130-10"],
    description: "Used to treat high blood pressure and heart failure",
    netPrice: 45.99,
    pricing: {
      i1: { insuranceCoverage: 35.99, patientPay: 10.0 },
      i2: { insuranceCoverage: 20.99, patientPay: 25.0 },
      i3: { insuranceCoverage: 30.99, patientPay: 15.0 },
    },
    alternatives: [
      {
        id: "d2",
        name: "Enalapril",
        className: "ACE Inhibitor",
        ndc: ["00186-0930-01"],
        description: "Alternative ACE inhibitor for blood pressure",
        netPrice: 42.99,
        pricing: {
          i1: { insuranceCoverage: 32.99, patientPay: 10.0 },
          i2: { insuranceCoverage: 17.99, patientPay: 25.0 },
          i3: { insuranceCoverage: 27.99, patientPay: 15.0 },
        },
        alternatives: [],
      },
    ],
  },
  {
    id: "d3",
    name: "Metformin",
    className: "Biguanide",
    ndc: ["00378-0053-01", "00378-0053-05"],
    description: "First-line medication for type 2 diabetes",
    netPrice: 35.99,
    pricing: {
      i1: { insuranceCoverage: 25.99, patientPay: 10.0 },
      i2: { insuranceCoverage: 10.99, patientPay: 25.0 },
      i3: { insuranceCoverage: 20.99, patientPay: 15.0 },
    },
    alternatives: [
      {
        id: "d4",
        name: "Glipizide",
        className: "Sulfonylurea",
        ndc: ["00781-1577-01"],
        description: "Alternative diabetes medication",
        netPrice: 32.99,
        pricing: {
          i1: { insuranceCoverage: 22.99, patientPay: 10.0 },
          i2: { insuranceCoverage: 7.99, patientPay: 25.0 },
          i3: { insuranceCoverage: 17.99, patientPay: 15.0 },
        },
        alternatives: [],
      },
    ],
  },
];

export const mockInsurances: Insurance[] = [
  {
    id: "i1",
    name: "HealthFirst Plus",
    coverageDetails: "Tier 1 Coverage - $10 copay",
  },
  {
    id: "i2",
    name: "MediCare Complete",
    coverageDetails: "Tier 2 Coverage - $25 copay",
  },
  {
    id: "i3",
    name: "BlueShield Premium",
    coverageDetails: "Tier 1 Coverage - $15 copay",
  },
];

export const mockPharmacySales: PharmacySale[] = [
  {
    id: "s1",
    pharmacyId: "p1",
    pharmacyName: "HealthMart Pharmacy",
    drugId: "d1",
    drugName: "Lisinopril",
    salePrice: 42.99,
    netPrice: 45.99,
    quantity: 30,
    date: "2024-03-15",
    insuranceId: "i1",
    insuranceName: "HealthFirst Plus",
  },
  {
    id: "s2",
    pharmacyId: "p2",
    pharmacyName: "MediCare Pharmacy",
    drugId: "d1",
    drugName: "Lisinopril",
    salePrice: 47.99,
    netPrice: 45.99,
    quantity: 25,
    date: "2024-03-14",
    insuranceId: "i2",
    insuranceName: "MediCare Complete",
  },
  {
    id: "s3",
    pharmacyId: "p3",
    pharmacyName: "Community Drugs",
    drugId: "d3",
    drugName: "Metformin",
    salePrice: 33.99,
    netPrice: 35.99,
    quantity: 40,
    date: "2024-03-15",
    insuranceId: "i3",
    insuranceName: "BlueShield Premium",
  },
];

const uniqueId = uuidv4();
function generateRandomUser() {
  const names = [
    "john",
    "Bob Johnson",
    "Charlie Brown",
    "David Wilson",
    "Eve Davis",
  ];
  const emails = [
    "pharmacist@gmail.com",
    "pharmacist1@gmail.com",
    "pharmacist2@gmail.com",
    "pharmacist3@gmail.com",
    "pharmacist4@gmail.com",
  ];
  const passwords = [
    "123456789",
    "123456789",
    "123456789",
    "123456789",
    "123456789",
  ];
  const roles = ["pharmacist"];

  const randomIndex = Math.floor(Math.random() * names.length);
  return {
    id: uuidv4(),
    name: names[randomIndex],
    email: emails[randomIndex],
    password: passwords[randomIndex],
    role: roles[0],
  };
}

export const mockUsers = [
  {
    id: "u1",
    name: "admin",
    email: "admin@gmail.com",
    password: "Admin@123",
    role: "admin",
  },
  {
    id: uuidv4(),
    name: "John Doe",
    email: "john.doe@gmail.com",
    password: "Jd@78x#z",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Alice Smith",
    email: "alice.smith@gmail.com",
    password: "As#9hT2!",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Bob Johnson",
    email: "bob.johnson@gmail.com",
    password: "Bj!x4Zp3",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Charlie Brown",
    email: "charlie.brown@gmail.com",
    password: "Cb#5yT!q",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Eve Davis",
    email: "eve.davis@gmail.com",
    password: "Ed@T67p#",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Aubrey San Pedro",
    email: "aubreycspcsp@gmail.com",
    password: "Aub#Xp7@",
    role: "admin",
  },
  {
    id: uuidv4(),
    name: "Clarissa Garza",
    email: "Clarissacalderm@gmail.com",
    password: "Cg!k9Rt#",
    role: "admin",
  },
  {
    id: uuidv4(),
    name: "Maria Garcia",
    email: "Mariacalderm7@gmail.com",
    password: "Mg@P5zY#",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Salena Seeley",
    email: "Salenacalderm@gmail.com",
    password: "Ss#4yX@Q",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Marco Guevara",
    email: "CaldermMarco@gmail.com",
    password: "Mg@T8z!x",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Ariana Kelly",
    email: "Arianacalderm@gmail.com",
    password: "Ak!5tPx#",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Kailey Bojorquez",
    email: "Kaileycalderm@gmail.com",
    password: "Kb@Z7Xp#",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Jamshid Farashi",
    email: "Jamshidcalderm@gmail.com",
    password: "Jf#5kXt@",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Jennifer Cruz",
    email: "Jennifercalderm10@gmail.com",
    password: "Jc@P6zX#",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Evelyn Jaimes",
    email: "Evelyncalderm@gmail.com",
    password: "Ej!9yT@P",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Rea Clocar",
    email: "reamayclocar04@gmail.com",
    password: "Rc@T7Xp#",
    role: "admin",
  },
  {
    id: uuidv4(),
    name: "Ezekiel Antipasado",
    email: "erantipasado@gmail.com",
    password: "Ea#P8zT@",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Kaila Mae Gonzales",
    email: "gkailagonzales@gmail.com",
    password: "Kg!5Xt@Q",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Kate Lalaine Movida",
    email: "katemovida@gmail.com",
    password: "Km@Z6Xp#",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Ulysses Leif Santos",
    email: "usantos.work@gmail.com",
    password: "Us!4yT@X",
    role: "pharmacist",
  },
  {
    id: uuidv4(),
    name: "Tracey Polanco",
    email: "tracey@axiommm.com",
    password: "Tp@P9zX#",
    role: "admin",
  },
  {
    id: uuidv4(),
    name: "snf dermatology",
    email: "Snfdermatology@gmail.com",
    password: "snf@P55aX#",
    role: "pharmacist",
  }
];
