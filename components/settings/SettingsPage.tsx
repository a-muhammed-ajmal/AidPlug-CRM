import React from 'react';
import { Bell, Mail, Smartphone, Globe, FileText, ChevronRight, HelpCircle, Shield, Info } from 'lucide-react';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useSalesCycle } from '../../hooks/useSalesCycle';
import SkeletonLoader from '../common/SkeletonLoader';

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${enabled ? 'transform translate-x-6' : 'transform translate-x-0.5'}`}></div>
    </button>
);

const SettingsItem = ({ icon: Icon, label, children }: { icon: React.ElementType, label: string, children?: React.ReactNode }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">{label}</span>
        </div>
        {children}
    </div>
);

export default function SettingsPage() {
    const { preferences, updatePreferences, isLoading: prefsLoading } = useUserPreferences();
    const { salesCycle, updateSalesCycle, isLoading: cycleLoading } = useSalesCycle();

    const handlePrefChange = (key: 'push_notifications' | 'email_notifications' | 'mobile_sync') => {
        if (preferences) {
            updatePreferences({ [key]: !preferences[key] });
        }
    };
    
    const handleCycleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(salesCycle) {
            updateSalesCycle({ ...salesCycle, [e.target.name]: e.target.value });
        }
    };
    
    if (prefsLoading || cycleLoading) {
        return (
            <div className="space-y-4">
                <SkeletonLoader className="h-40 rounded-xl" />
                <SkeletonLoader className="h-40 rounded-xl" />
                <SkeletonLoader className="h-40 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Preferences */}
            <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b"><h3 className="font-semibold text-gray-900">Preferences</h3></div>
                <div className="p-4 space-y-4">
                    <SettingsItem icon={Bell} label="Push Notifications">
                        <Toggle enabled={preferences?.push_notifications ?? true} onChange={() => handlePrefChange('push_notifications')} />
                    </SettingsItem>
                    <SettingsItem icon={Mail} label="Email Notifications">
                        <Toggle enabled={preferences?.email_notifications ?? false} onChange={() => handlePrefChange('email_notifications')} />
                    </SettingsItem>
                    <SettingsItem icon={Smartphone} label="Mobile Sync">
                        <Toggle enabled={preferences?.mobile_sync ?? true} onChange={() => handlePrefChange('mobile_sync')} />
                    </SettingsItem>
                </div>
            </div>

            {/* Sales Cycle Settings */}
            <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b"><h3 className="font-semibold text-gray-900">Sales Cycle</h3></div>
                <div className="p-4 space-y-4">
                    <div><label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">Start Date</label><input type="date" id="start_date" name="start_date" value={salesCycle?.start_date || ''} onChange={handleCycleChange} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" /></div>
                    <div><label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">End Date</label><input type="date" id="end_date" name="end_date" value={salesCycle?.end_date || ''} onChange={handleCycleChange} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" /></div>
                </div>
            </div>

             <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b"><h3 className="font-semibold text-gray-900">App Information</h3></div>
                <div className="p-4 space-y-4">
                    <SettingsItem icon={Info} label="Version">
                        <span className="font-medium text-gray-800 text-sm">1.0.0</span>
                    </SettingsItem>
                    <SettingsItem icon={Info} label="Last Updated">
                        <span className="font-medium text-gray-800 text-sm">Oct 01, 2024</span>
                    </SettingsItem>
                    <SettingsItem icon={Info} label="Data Sync">
                        <span className="font-medium text-green-600 flex items-center text-sm"><div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Connected</span>
                    </SettingsItem>
                </div>
            </div>

            {/* Support & Help */}
            <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b"><h3 className="font-semibold text-gray-900">Support & Help</h3></div>
                <div className="p-2">
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <SettingsItem icon={HelpCircle} label="Help Center">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                      </SettingsItem>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <SettingsItem icon={Mail} label="Contact Support">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                      </SettingsItem>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <SettingsItem icon={Shield} label="Privacy Policy">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                      </SettingsItem>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <SettingsItem icon={Info} label="Terms of Service">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                      </SettingsItem>
                    </button>
                </div>
            </div>
        </div>
    );
}