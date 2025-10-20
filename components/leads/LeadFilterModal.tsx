import React from 'react';
import { X } from 'lucide-react';
import { mockProducts } from '../../lib/constants';

interface LeadFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (filters: any) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function LeadFilterModal({ isOpen, onClose, filters, setFilters, onApply, onClear }: LeadFilterModalProps) {
  if (!isOpen) return null;

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFilters((prev: any) => {
        const newProducts = checked 
            ? [...prev.products, value]
            : prev.products.filter((p: string) => p !== value);
        return { ...prev, products: newProducts };
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-2xl shadow-xl p-6 transform transition-transform animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Filter Leads</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Urgency</label>
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg mt-2">
              {['all', 'high', 'medium', 'low'].map(urgency => (
                <button
                  key={urgency}
                  onClick={() => setFilters((prev: any) => ({...prev, urgency }))}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all ${
                    filters.urgency === urgency ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="salary" className="text-sm font-medium text-gray-700 flex justify-between">
              <span>Minimum Monthly Salary (AED)</span>
              <span className="font-bold text-blue-600">{(filters.salaryRange[0] / 1000).toFixed(0)}K</span>
            </label>
            <input
              id="salary"
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={filters.salaryRange[0]}
              onChange={(e) => setFilters((prev: any) => ({...prev, salaryRange: [parseInt(e.target.value), 100000]}))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2 accent-blue-600"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Product Interest</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {mockProducts.map(product => (
                <label key={product.key} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    value={product.key}
                    checked={filters.products.includes(product.key)}
                    onChange={handleProductChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-800 capitalize">{product.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex space-x-3">
          <button 
            onClick={onClear}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all active:scale-95"
          >
            Clear All
          </button>
          <button 
            onClick={onApply}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all active:scale-95 shadow"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
