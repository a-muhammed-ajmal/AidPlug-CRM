import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { mockProducts } from '../../lib/constants';
import ProductCard from './ProductCard';
import { useUI } from '../../contexts/UIContext';

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const { addNotification } = useUI();

    const filteredProducts = useMemo(() => {
        return mockProducts.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
                <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border text-center">
                <p className="text-2xl font-bold text-blue-600">
                    {mockProducts.length}
                </p>
                <p className="text-xs text-gray-600">Total Products</p>
                </div>
                <div className="bg-white p-3 rounded-lg border text-center">
                <p className="text-2xl font-bold text-green-600">
                    AED {(mockProducts.reduce((sum, p) => sum + p.total_value, 0) / 1000000).toFixed(0)}M
                </p>
                <p className="text-xs text-gray-600">Total Portfolio</p>
                </div>
            </div>

            <div className="space-y-4">
                {filteredProducts.map((product) => (
                <ProductCard 
                    key={product.id}
                    product={product}
                    onClick={() => addNotification('Coming Soon', `Detailed view for ${product.name} will be available soon.`)}
                />
                ))}
            </div>
        </div>
    );
}
