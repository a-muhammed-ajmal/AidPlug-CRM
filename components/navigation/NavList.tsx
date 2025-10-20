
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Users, Briefcase, List, User as UserIcon, Building, Inbox, Settings, LogOut, PieChart
} from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { useClients } from '../../hooks/useClients';
import { useDeals } from '../../hooks/useDeals';
import { useTasks } from '../../hooks/useTasks';
import { mockProducts } from '../../lib/constants';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';

interface NavListProps {
    onClose?: () => void;
}

export default function NavList({ onClose }: NavListProps) {
  const { leads } = useLeads();
  const { clients } = useClients();
  const { deals } = useDeals();
  const { tasks } = useTasks();
  const { signOut } = useAuth();
  const { showConfirmation } = useUI();

  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;

  const handleSignOut = () => {
    if (onClose) onClose(); // Close sidebar first
    showConfirmation(
      'Sign Out',
      'Are you sure you want to sign out?',
      () => {
        signOut();
      }
    );
  };
  
  const handleLinkClick = () => {
      if (onClose) onClose();
  }

  const navItems = [
    { key: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard', count: null, color: 'text-blue-600' },
    { key: 'leads', icon: Users, label: 'Leads', path: '/leads', count: leads.length, color: 'text-green-600' },
    { key: 'clients', icon: Inbox, label: 'Clients', path: '/clients', count: clients.length, color: 'text-purple-600' },
    { key: 'products', icon: PieChart, label: 'Products', path: '/products', count: mockProducts.length, color: 'text-teal-600' },
    { key: 'deals', icon: Briefcase, label: 'Deals', path: '/deals', count: deals.length, color: 'text-orange-600' },
    { key: 'tasks', icon: List, label: 'Tasks', path: '/tasks', count: pendingTasksCount, color: 'text-red-600' },
    { key: 'account', icon: UserIcon, label: 'My Account', path: '/account', count: null, color: 'text-gray-600' },
    { key: 'settings', icon: Settings, label: 'Settings', path: '/settings', count: null, color: 'text-gray-600' },
  ];

  return (
    <div className="p-2 h-full flex flex-col">
      <div className="overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Main Menu</h3>
          {navItems.slice(0, 7).map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) => `w-full flex items-center justify-between p-3 rounded-lg mb-1 text-left transition-all ${
                isActive ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5`} />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count !== null && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium bg-gray-200 text-gray-600`}>
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Tools</h3>
          {navItems.slice(7).map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) => `w-full flex items-center justify-between p-3 rounded-lg mb-1 text-left transition-all ${
                isActive ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5`} />
                <span className="font-medium">{item.label}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="mt-auto border-t pt-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 p-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
