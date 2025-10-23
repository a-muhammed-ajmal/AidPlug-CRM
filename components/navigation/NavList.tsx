import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { useClients } from '../../hooks/useClients';
import { useDeals } from '../../hooks/useDeals';
import { useTasks } from '../../hooks/useTasks';
import { mockProducts } from '../../lib/constants';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { mainNavItems, secondaryNavItems, NavItem } from '../../lib/navigation';

interface NavListProps {
    onClose?: () => void;
}

// A helper component to keep the NavLink logic clean
const NavListItem: React.FC<{ item: NavItem, count?: number | null, onClick: () => void }> = ({ item, count, onClick }) => (
    <NavLink
        to={item.path}
        onClick={onClick}
        className={({ isActive }) => `w-full flex items-center justify-between p-3 rounded-lg mb-1 text-left transition-all ${
            isActive ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
        }`}
    >
        <div className="flex items-center space-x-3">
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
        </div>
        {count !== null && count !== undefined && (
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-200 text-gray-600">
                {count}
            </span>
        )}
    </NavLink>
);


export default function NavList({ onClose }: NavListProps) {
  const { leads } = useLeads();
  const { clients } = useClients();
  const { deals } = useDeals();
  const { tasks } = useTasks();

  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;

  const itemCounts: { [key: string]: number } = {
      leads: leads.length,
      clients: clients.length,
      deals: deals.length,
      tasks: pendingTasksCount,
      products: mockProducts.length,
  };
  
  const handleLinkClick = () => {
      if (onClose) onClose();
  }

  return (
    <div className="p-2 h-full flex flex-col">
      <div className="flex-grow overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Main Menu</h3>
          {mainNavItems.map((item) => (
             <NavListItem 
              key={item.key}
              item={item}
              count={itemCounts[item.key]}
              onClick={handleLinkClick}
            />
          ))}
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Tools</h3>
          {secondaryNavItems.map((item) => (
             <NavListItem 
              key={item.key}
              item={item}
              onClick={handleLinkClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};