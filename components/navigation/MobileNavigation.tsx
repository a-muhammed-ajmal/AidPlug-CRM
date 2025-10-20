
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, TrendingUp, DollarSign, CheckSquare, LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export default function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs: Tab[] = [
    { id: 'dashboard', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'leads', label: 'Leads', icon: Users, path: '/leads' },
    { id: 'clients', label: 'Clients', icon: TrendingUp, path: '/clients' },
    { id: 'deals', label: 'Deals', icon: DollarSign, path: '/deals' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/tasks' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname.startsWith(tab.path);
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors w-1/5 ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
