import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Drug } from '../types';
import DrugItem from './DrugItem';

interface DrugsListProps {
  drugs: Drug[];
  onAddToCart: (drug: Drug) => void;
}

const DrugsList: React.FC<DrugsListProps> = ({ drugs, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [prescriptionFilter, setPrescriptionFilter] = useState<string>('all');
  
  const categories = ['all', 'pain-relief', 'antibiotics', 'allergy', 'cardiovascular', 'diabetes'];
  
  const filteredDrugs = drugs.filter((drug) => {
    const matchesSearch = drug.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          drug.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || drug.category === selectedCategory;
    
    const matchesPrescription = prescriptionFilter === 'all' || 
                               (prescriptionFilter === 'prescription' && drug.requiresPrescription) ||
                               (prescriptionFilter === 'otc' && !drug.requiresPrescription);
    
    return matchesSearch && matchesCategory && matchesPrescription;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Medications</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medications..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <select
            value={prescriptionFilter}
            onChange={(e) => setPrescriptionFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Medications</option>
            <option value="prescription">Prescription Only</option>
            <option value="otc">Over-the-counter</option>
          </select>
        </div>
      </div>
      
      {filteredDrugs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No medications found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDrugs.map((drug) => (
            <DrugItem
              key={drug.id}
              drug={drug}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DrugsList;