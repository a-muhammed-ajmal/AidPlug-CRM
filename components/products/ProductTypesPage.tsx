import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CreditCard, ChevronRight } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';

// In a real app, this would be fetched based on the bankSlug
const productTypes = [
  {
    name: 'Credit Cards',
    slug: 'credit-cards',
    icon: CreditCard,
    productCount: 13,
  },
];

export default function ProductTypesPage() {
  const { bankSlug } = useParams();
  const { setTitle } = useUI();

  useEffect(() => {
    if (bankSlug) {
      const formattedTitle = bankSlug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
      setTitle(formattedTitle);
    }
  }, [bankSlug, setTitle]);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Product Categories</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select a product type to see the available options.
        </p>
      </div>

      <div className="space-y-3">
        {productTypes.map((type) => (
          <Link
            key={type.slug}
            to={`/products/${bankSlug}/${type.slug}`}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 active:scale-98"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <type.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{type.name}</h3>
                <p className="text-sm text-gray-500">
                  {type.productCount} products
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
