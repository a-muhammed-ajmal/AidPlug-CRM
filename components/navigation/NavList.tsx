import React, { useState } from 'react';
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

// Import the account modal
import AccountModal from '../account/AccountModal';

interface NavListProps {
    onClose?: () => void;
}

// A helper component to keep the NavLink logic clean
const NavListItem: React.FC<{ 
  item: NavItem, 
  count?: number | null, 
  onClick: () => void,
  isAccount?: boolean 
}> = ({ item, count, onClick, isAccount }) => {
  if (isAccount) {
    // Account item uses button instead of NavLink
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-3 rounded-lg mb-1 text-left transition-all text-gray-700 hover:bg-gray-100"
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
      </button>
    );
  }

  return (
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
};


export default function NavList({ onClose }: NavListProps) {
  const { leads } = useLeads();
  const { clients } = useClients();
  const { deals } = useDeals();
  const { tasks } = useTasks();
  const { signOut } = useAuth();
  const { showConfirmation } = useUI();
  
  // Add account modal state
  const [showAccountModal, setShowAccountModal] = useState(false);

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

  const handleAccountClick = () => {
    setShowAccountModal(true);
    if (onClose) onClose();
  }

  const handleSignOut = () => {
    showConfirmation('Sign Out', 'Are you sure you want to sign out?', signOut);
  }

  return (
    <>
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
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Account</h3>
            <NavListItem 
              item={secondaryNavItems.find(item => item.key === 'account')!}
              onClick={handleAccountClick}
              isAccount={true}
            />
            <NavListItem 
              item={secondaryNavItems.find(item => item.key === 'settings')!}
              onClick={handleLinkClick}
            />
            
            {/* Sign Out Button */}
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center justify-between p-3 rounded-lg mb-1 text-left transition-all text-red-600 hover:bg-red-50"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Account Modal */}
      {showAccountModal && (
        <AccountModal onClose={() => setShowAccountModal(false)} />
      )}
    </>
  );
};