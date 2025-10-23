
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

export default function KPICard({ icon: Icon, label, value, color }: KPICardProps) {
  const colorClasses: { [key: string]: string } = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}