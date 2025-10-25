import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, ChevronRight } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';

const banks = [
  {
    name: 'Emirates Islamic Bank',
    slug: 'emirates-islamic-bank',
    productCount: 13,
  },
];

export default function ProductsPage() {
  const { setTitle } = useUI();
  useEffect(() => {
    setTitle('Product Hub');
  }, [setTitle]);
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Product Hub</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select a bank to view its product offerings.
        </p>
      </div>

      <div className="space-y-3">
        {banks.map((bank) => (
          <Link
            key={bank.slug}
            to={`/products/${bank.slug}`}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 active:scale-98"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{bank.name}</h3>
                <p className="text-sm text-gray-500">
                  {bank.productCount} products
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
