import { Building } from 'lucide-react';
import NavList from './NavList';

export default function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 flex-col">
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AidPlug CRM</h2>
            <p className="text-sm text-blue-100">Banking Solutions</p>
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        <NavList />
      </div>
    </aside>
  );
}
