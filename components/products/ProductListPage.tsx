import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Info } from 'lucide-react';
import { EIB_CREDIT_CARDS } from '../../lib/constants';
import { productDetailsData } from '../../lib/productData';
import { useUI } from '../../contexts/UIContext';

export default function ProductListPage() {
    const { bankSlug, typeSlug } = useParams();
    const { setTitle } = useUI();

    useEffect(() => {
        if (typeSlug) {
            const formattedTitle = typeSlug.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            setTitle(formattedTitle);
        }
    }, [typeSlug, setTitle]);

    const detailedSlugs = productDetailsData.map(p => p.slug);

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Credit Cards</h2>
                <p className="text-sm text-gray-500 mt-1">Select a card to view its details.</p>
            </div>

            <div className="space-y-3">
                {EIB_CREDIT_CARDS.map((card) => {
                    const hasDetails = detailedSlugs.includes(card.slug);
                    if (hasDetails) {
                        return (
                            <Link 
                                key={card.slug}
                                to={`/products/${bankSlug}/${typeSlug}/${card.slug}`}
                                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 active:scale-98"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-800">{card.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>
                        );
                    }
                    return (
                        <div 
                            key={card.slug}
                            className="p-4 bg-gray-100 border border-gray-200 rounded-xl opacity-70"
                        >
                            <div>
                                <h3 className="font-medium text-gray-500">{card.name}</h3>
                                <p className="text-sm text-gray-400 mt-1">{card.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}