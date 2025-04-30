import { Drug } from '../types';

export const drugs: Drug[] = [
  {
    id: '1',
    name: 'Ibuprofen',
    description: 'Non-steroidal anti-inflammatory drug (NSAID) used for pain relief, fever reduction, and reducing inflammation.',
    price: 8.99,
    category: 'pain-relief',
    requiresPrescription: false,
    dosage: '200mg tablets',
    image: 'https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '2',
    name: 'Amoxicillin',
    description: 'Penicillin antibiotic used to treat a variety of bacterial infections including bronchitis, pneumonia, and infections of the ear, nose, throat, skin, or urinary tract.',
    price: 12.50,
    category: 'antibiotics',
    requiresPrescription: true,
    dosage: '500mg capsules',
    image: 'https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '3',
    name: 'Lisinopril',
    description: 'ACE inhibitor used to treat high blood pressure and heart failure, and to improve survival after a heart attack.',
    price: 15.75,
    category: 'cardiovascular',
    requiresPrescription: true,
    dosage: '10mg tablets',
    image: 'https://images.pexels.com/photos/139398/pexels-photo-139398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '4',
    name: 'Metformin',
    description: 'Oral diabetes medicine that helps control blood sugar levels, particularly for people with type 2 diabetes.',
    price: 10.25,
    category: 'diabetes',
    requiresPrescription: true,
    dosage: '500mg tablets',
    image: 'https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '5',
    name: 'Cetirizine',
    description: 'Antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, and sneezing.',
    price: 7.99,
    category: 'allergy',
    requiresPrescription: false,
    dosage: '10mg tablets',
    image: 'https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '6',
    name: 'Atorvastatin',
    description: 'Statin medication used to prevent cardiovascular disease in those at high risk and treat abnormal lipid levels.',
    price: 18.50,
    category: 'cardiovascular',
    requiresPrescription: true,
    dosage: '20mg tablets',
    image: 'https://images.pexels.com/photos/139398/pexels-photo-139398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '7',
    name: 'Acetaminophen',
    description: 'Pain reliever and fever reducer used for mild to moderate pain relief and fever reduction.',
    price: 6.75,
    category: 'pain-relief',
    requiresPrescription: false,
    dosage: '500mg tablets',
    image: 'https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '8',
    name: 'Ciprofloxacin',
    description: 'Antibiotic used to treat a variety of bacterial infections including infections of bones and joints, respiratory or urinary tract, skin, and others.',
    price: 14.99,
    category: 'antibiotics',
    requiresPrescription: true,
    dosage: '500mg tablets',
    image: 'https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];