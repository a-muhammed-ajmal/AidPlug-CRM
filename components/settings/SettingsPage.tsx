import React, { useState, useEffect } from 'react';
import { Smartphone, Info } from 'lucide-react';
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

    const [cycleDates, setCycleDates] = useState({ start_date: '', end_date: '' });
    const [dateError, setDateError] = useState<string | null>(null);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');

    useEffect(() => {
        if (salesCycle) {
            setCycleDates({
                start_date: salesCycle.start_date || '',
                end_date: salesCycle.end_date || '',
            });
        }
    }, [salesCycle]);

    const handlePrefChange = (key: 'mobile_sync') => {
        if (preferences) {
            const newValue = !preferences[key];
            updatePreferences({ [key]: newValue });
            
            if (key === 'mobile_sync') {
              if (newValue) {
                setSyncStatus('syncing');
                setTimeout(() => setSyncStatus('synced'), 2000);
              } else {
                setSyncStatus('idle');
              }
            }
        }
    };
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newDates = { ...cycleDates, [name]: value };
        setCycleDates(newDates);

        if (newDates.start_date && newDates.end_date) {
            const startDate = new Date(newDates.start_date);
            const endDate = new Date(newDates.end_date);
            if (endDate < startDate) {
                setDateError('End date cannot be earlier than the start date.');
            } else {
                setDateError(null);
            }
        }
    };

    const handleDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!dateError) {
            const { name, value } = e.target;
            if (salesCycle && salesCycle[name as keyof typeof salesCycle] !== value) {
                updateSalesCycle({ [name]: value });
            }
        }
    };
    
    if (prefsLoading || cycleLoading) {
        return (
            <div className="space-y-4">
                <SkeletonLoader className="h-24 rounded-xl" />
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
                    <SettingsItem icon={Smartphone} label="Mobile Sync">
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-500 w-20 text-right">
                                {preferences?.mobile_sync 
                                    ? (syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? 'Synced' : 'Enabled') 
                                    : 'Disabled'
                                }
                            </span>
                            <Toggle enabled={preferences?.mobile_sync ?? true} onChange={() => handlePrefChange('mobile_sync')} />
                        </div>
                    </SettingsItem>
                </div>
            </div>

            {/* Sales Cycle Settings */}
            <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b"><h3 className="font-semibold text-gray-900">Sales Cycle</h3></div>
                <div className="p-4 space-y-4">
                    <div>
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input type="date" id="start_date" name="start_date" value={cycleDates.start_date} onChange={handleDateChange} onBlur={handleDateBlur} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" />
                    </div>
                    <div>
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input type="date" id="end_date" name="end_date" value={cycleDates.end_date} onChange={handleDateChange} onBlur={handleDateBlur} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" />
                    </div>
                    {dateError && <p className="text-sm text-red-600 mt-2">{dateError}</p>}
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
        </div>
    );
}