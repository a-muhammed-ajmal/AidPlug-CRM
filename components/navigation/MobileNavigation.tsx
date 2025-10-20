import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Users, Briefcase, List, User as UserIcon, Building, CreditCard, PieChart,
  DollarSign, Inbox, Settings, X, LogOut
} from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { useClients } from '../../hooks/useClients';
import { useDeals } from '../../hooks/useDeals';
import { useTasks } from '../../hooks/useTasks';
import { mockProducts } from '../../lib/constants';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';

const MobileNavList = ({ onClose }: { onClose: () => void }) => {
  const { leads } = useLeads();
  const { clients } = useClients();
  const { deals } = useDeals();
  const { tasks } = useTasks();
  const { signOut } = useAuth();
  const { showConfirmation } = useUI();

  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;

  const handleSignOut = () => {
    onClose(); // Close sidebar first
    showConfirmation(
      'Sign Out',
      'Are you sure you want to sign out?',
      () => {
        signOut();
      }
    );
  };

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
              onClick={onClose}
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
              onClick={onClose}
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


interface MobileNavigationProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
    const bottomNavTabs = [
        { key: 'dashboard', icon: Home, label: 'Home', path: '/dashboard' },
        { key: 'leads', icon: Users, label: 'Leads', path: '/leads' },
        { key: 'deals', icon: Briefcase, label: 'Deals', path: '/deals' },
        { key: 'tasks', icon: List, label: 'Tasks', path: '/tasks' },
        { key: 'account', icon: UserIcon, label: 'Account', path: '/account' }
    ];

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
                    <div className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl transform transition-transform">
                    <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-white" />
                            </div>
                            <div>
                            <h2 className="text-lg font-bold text-white">AidPlug CRM</h2>
                            <p className="text-sm text-blue-100">Banking Solutions</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white hover:bg-opacity-20 text-white">
                            <X className="w-5 h-5" />
                        </button>
                        </div>
                    </div>
                    <MobileNavList onClose={onClose} />
                    </div>
                </div>
            )}
            
            {/* Bottom Navigation for Mobile */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden shadow-lg">
                <div className="grid grid-cols-5 gap-1">
                    {bottomNavTabs.map((tab) => (
                        <NavLink
                            key={tab.key}
                            to={tab.path}
                            className={({ isActive }) => `flex flex-col items-center justify-end h-14 py-2 px-1 text-xs transition-all ${
                                isActive
                                ? 'text-blue-600 bg-blue-50 border-t-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <tab.icon className="w-5 h-5 mb-1" />
                            <span className="font-medium leading-none">{tab.label}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>
        </>
    );
}