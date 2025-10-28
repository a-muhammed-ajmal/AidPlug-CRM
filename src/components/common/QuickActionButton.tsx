import React from 'react';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  colorClass: string;
  onClick: () => void;
}

export default function QuickActionButton({
  icon,
  title,
  subtitle,
  colorClass,
  onClick,
}: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-200 active:scale-95 text-left w-full"
    >
      <div
        className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900 text-[10px]">{title}</p>
        <p className="text-[10px] text-gray-500">{subtitle}</p>
      </div>
    </button>
  );
}
