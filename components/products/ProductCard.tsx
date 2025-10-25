import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  key: string;
  icon: LucideIcon;
  color: string;
  description: string;
  total_clients: number;
  total_value: number;
  growth: number;
}

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const colorClasses: {
    [key: string]: { border: string; text: string; bg: string };
  } = {
    blue: {
      border: 'border-blue-500',
      text: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    purple: {
      border: 'border-purple-500',
      text: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    green: {
      border: 'border-green-500',
      text: 'text-green-600',
      bg: 'bg-green-50',
    },
    orange: {
      border: 'border-orange-500',
      text: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    red: { border: 'border-red-500', text: 'text-red-600', bg: 'bg-red-50' },
    indigo: {
      border: 'border-indigo-500',
      text: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
  };

  const colors = colorClasses[product.color] || colorClasses.blue;
  const Icon = product.icon;

  return (
    <div
      onClick={() => onClick(product)}
      className={`bg-white border-l-4 ${colors.border} rounded-xl p-4 hover:shadow-md transition-all duration-200 active:scale-98`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`w-12 h-12 ${colors.bg} ${colors.text} rounded-lg flex items-center justify-center flex-shrink-0`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600">{product.description}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 divide-x divide-gray-100 text-center">
        <div>
          <p className="text-sm text-gray-500">Clients</p>
          <p className="font-bold text-gray-800">
            {product.total_clients.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Value</p>
          <p className="font-bold text-gray-800">
            {(product.total_value / 1_000_000).toFixed(1)}M
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Growth</p>
          <p
            className={`font-bold flex items-center justify-center ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {product.growth > 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {product.growth}%
          </p>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
