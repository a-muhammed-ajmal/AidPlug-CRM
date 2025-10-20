import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productDetailsData } from '../../lib/productData';
import { Star, Percent, Shield, Award, Briefcase, FileText, ChevronUp, ChevronDown, CheckCircle, ArrowLeft } from 'lucide-react';
import EmptyState from '../common/EmptyState';

// FIX: Changed InfoSection to be a React.FC to handle special props like 'key' correctly.
const InfoSection: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white rounded-xl border shadow-sm">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left"
            >
                <div className="flex items-center space-x-3">
                    <div className="text-blue-600">{icon}</div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-100">
                    {children}
                </div>
            )}
        </div>
    );
};

// FIX: Changed to React.FC to address type inference issues with the `key` prop.
const DetailsTable: React.FC<{ table: any }> = ({ table }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-800 uppercase bg-gray-50">
                <tr>
                    {table.headers.map((header: string, i: number) => (
                        <th key={i} scope="col" className="px-4 py-3">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {table.rows.map((row: (string|number)[], i: number) => (
                    <tr key={i} className="bg-white border-b last:border-b-0">
                        {row.map((cell, j: number) => (
                           <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-medium text-gray-900' : ''}`}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// FIX: Changed to React.FC to address type inference issues with the `key` prop.
const DetailsList: React.FC<{ items: string[] }> = ({ items }) => (
    <ul className="space-y-2">
        {items.map((item, i) => (
            <li key={i} className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
            </li>
        ))}
    </ul>
);

export default function ProductDetailPage() {
    const { productSlug, bankSlug, typeSlug } = useParams();
    const product = productDetailsData.find(p => p.slug === productSlug);

    if (!product) {
        return (
             <EmptyState
                icon={<FileText className="w-12 h-12 text-gray-300" />}
                title="Product Not Found"
                message="The product details could not be found."
            />
        );
    }
    
    const iconMap: { [key: string]: React.ReactNode } = {
        'star': <Star className="w-5 h-5" />,
        'percent': <Percent className="w-5 h-5" />,
        'shield': <Shield className="w-5 h-5" />,
        'award': <Award className="w-5 h-5" />,
        'briefcase': <Briefcase className="w-5 h-5" />,
    };

    return (
        <div className="space-y-4">
            <Link to={`/products/${bankSlug}/${typeSlug}`} className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline mb-2">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to all cards
            </Link>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="opacity-90 mt-1">{product.tagline}</p>
            </div>
            
            <InfoSection title="Product Highlights" icon={<Star className="w-5 h-5"/>}>
                <div className="space-y-3">
                    {product.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                {iconMap[highlight.icon] || <Star className="w-4 h-4" />}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">{highlight.title}</h4>
                                <p className="text-sm text-gray-600">{highlight.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </InfoSection>

            {product.sections.map((section, i) => (
                 // FIX: Replaced recursive call to InfoSection with a valid fallback icon to prevent rendering errors.
                 <InfoSection key={i} title={section.title} icon={iconMap[section.icon] || <FileText className="w-5 h-5"/>}>
                     <div className="space-y-4">
                        {section.content.map((contentItem: any, j: number) => {
                            if (contentItem.headers) { // It's a table
                                return <DetailsTable key={j} table={contentItem} />;
                            }
                            if (contentItem.type === 'list') { // It's a list
                                return <DetailsList key={j} items={contentItem.items} />;
                            }
                            // Default to feature list item
                            return (
                                <div key={j}>
                                    <h4 className="font-semibold text-gray-800 mb-1">{contentItem.title}</h4>
                                    <p className="text-sm text-gray-600">{contentItem.description}</p>
                                </div>
                            );
                        })}
                     </div>
                 </InfoSection>
            ))}
        </div>
    );
}