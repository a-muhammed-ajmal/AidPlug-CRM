import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Building, X
} from 'lucide-react';
import NavList from './NavList';
import { mainNavItems, bottomNavKeys } from '../../lib/navigation';


interface MobileNavigationProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
    const bottomNavTabs = mainNavItems.filter(item => bottomNavKeys.includes(item.key));

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
                    <div className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl transform transition-transform flex flex-col">
                    <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0">
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
                    <div className="flex-grow overflow-y-auto">
                        <NavList onClose={onClose} />
                    </div>
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
