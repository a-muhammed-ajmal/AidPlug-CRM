import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Info,
  Mail,
  ChevronRight,
  HelpCircle,
  Shield,
  X,
} from 'lucide-react';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useSalesCycle } from '../../hooks/useSalesCycle';
import { useUI } from '../../contexts/UIContext';
import SkeletonLoader from '../common/SkeletonLoader';

const Toggle = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
  >
    <div
      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${enabled ? 'transform translate-x-6' : 'transform translate-x-0.5'}`}
    ></div>
  </button>
);

const SettingsItem = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-gray-600" />
      <span className="font-medium text-gray-700">{label}</span>
    </div>
    {children}
  </div>
);

const HelpCenterModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
    <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">Help Center</h2>
        <button
          onClick={onClose}
          className="p-2 -mr-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              • <strong>Adding Leads:</strong> Go to Leads page and click "Add
              Lead" button
            </p>
            <p>
              • <strong>Managing Clients:</strong> Use the Clients page to view
              and edit client information
            </p>
            <p>
              • <strong>Deal Pipeline:</strong> Track your sales deals in the
              Deals section
            </p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <p className="font-medium">How do I backup my data?</p>
              <p>Your data is automatically synced to our secure servers.</p>
            </div>
            <div>
              <p className="font-medium">Can I export my leads?</p>
              <p>Data export functionality is coming in a future update.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PrivacyPolicyModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
    <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">Privacy Policy</h2>
        <button
          onClick={onClose}
          className="p-2 -mr-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-sm text-gray-600">
        <p>
          <strong>Effective Date:</strong> October 2024
        </p>
        <h3 className="font-semibold text-lg text-gray-900 mt-4">
          Information We Collect
        </h3>
        <p>
          We collect information you provide directly to us, such as when you
          create an account, use our services, or contact us for support.
        </p>
        <h3 className="font-semibold text-lg text-gray-900 mt-4">
          How We Use Your Information
        </h3>
        <p>
          We use the information we collect to provide, maintain, and improve
          our services, process transactions, and communicate with you.
        </p>
        <h3 className="font-semibold text-lg text-gray-900 mt-4">
          Data Security
        </h3>
        <p>
          We implement appropriate security measures to protect your personal
          information against unauthorized access, alteration, disclosure, or
          destruction.
        </p>
        <h3 className="font-semibold text-lg text-gray-900 mt-4">Contact Us</h3>
        <p>
          If you have questions about this Privacy Policy, please contact us at
          privacy@aidplug.com
        </p>
      </div>
    </div>
  </div>
);

const TermsOfServiceModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
    <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">Terms of Service</h2>
        <button
          onClick={onClose}
          className="p-2 -mr-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-sm text-gray-600">
        <p>
          <strong>Effective Date:</strong> October 2024
        </p>
        <h3 className="font-semibold text-lg text-gray-900 mt-4">
          Acceptance of Terms
        </h3>
        <p>
          By accessing and using AidPlug CRM, you accept and agree to be bound
          by the terms and provision of this agreement.
        </p>
        <h3 className="font-semibold text-lg text-gray-900 mt-4">
          Use License
        </h3>
        <p>
          Permission is granted to temporarily use AidPlug CRM for personal and
          business use, subject to restrictions stated in these terms.
        </p>
        <h3 className="font-semibold text-lg text-gray-900 mt-4">Disclaimer</h3>
        <p>
          The materials on AidPlug CRM are provided on an 'as is' basis. AidPlug
          makes no warranties, expressed or implied, and hereby disclaims all
          other warranties.
        </p>
        <h3 className="font-semibold text-lg text-gray-900 mt-4">
          Limitations
        </h3>
        <p>
          In no event shall AidPlug be liable for any damages arising out of the
          use or inability to use AidPlug CRM.
        </p>
      </div>
    </div>
  </div>
);

export default function SettingsPage() {
  const { setTitle } = useUI();
  useEffect(() => {
    setTitle('Settings');
  }, [setTitle]);
  const {
    preferences,
    updatePreferences,
    isLoading: prefsLoading,
  } = useUserPreferences();
  const {
    salesCycle,
    updateSalesCycle,
    isLoading: cycleLoading,
  } = useSalesCycle();

  const [cycleDates, setCycleDates] = useState({
    start_date: salesCycle?.start_date || '',
    end_date: salesCycle?.end_date || '',
  });
  const [dateError, setDateError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>(
    'idle'
  );

  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);

  useEffect(() => {
    if (salesCycle) {
      setCycleDates({
        start_date: salesCycle.start_date || '',
        end_date: salesCycle.end_date || '',
      });
    } else {
      setCycleDates({
        start_date: '',
        end_date: '',
      });
    }
  }, [salesCycle]);

  const handlePrefChange = (key: 'mobile_sync') => {
    if (preferences) {
      const newValue = !preferences[key];
      updatePreferences.mutate({ [key]: newValue });

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
      if (value && (salesCycle?.[name as keyof typeof salesCycle] !== value)) {
        updateSalesCycle.mutate({ [name]: value });
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
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Preferences</h3>
        </div>
        <div className="p-4 space-y-4">
          <SettingsItem icon={Smartphone} label="Mobile Sync">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 w-20 text-right">
                {preferences?.mobile_sync
                  ? syncStatus === 'syncing'
                    ? 'Syncing...'
                    : syncStatus === 'synced'
                      ? 'Synced'
                      : 'Enabled'
                  : 'Disabled'}
              </span>
              <Toggle
                enabled={preferences?.mobile_sync ?? true}
                onChange={() => handlePrefChange('mobile_sync')}
              />
            </div>
          </SettingsItem>
        </div>
      </div>

      {/* Sales Cycle Settings */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Sales Cycle</h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={cycleDates.start_date}
              onChange={handleDateChange}
              onBlur={handleDateBlur}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={cycleDates.end_date}
              onChange={handleDateChange}
              onBlur={handleDateBlur}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            />
          </div>
          {dateError && (
            <p className="text-sm text-red-600 mt-2">{dateError}</p>
          )}
        </div>
      </div>

      {/* Support & Help */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Support & Help</h3>
        </div>
        <div className="p-2">
          <button
            onClick={() => setShowHelpCenter(true)}
            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <SettingsItem icon={HelpCircle} label="Help Center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </SettingsItem>
          </button>
          <button
            onClick={() =>
              (window.location.href = 'mailto:support@aidplug.com')
            }
            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <SettingsItem icon={Mail} label="Contact Support">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </SettingsItem>
          </button>
          <button
            onClick={() => setShowPrivacyPolicy(true)}
            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <SettingsItem icon={Shield} label="Privacy Policy">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </SettingsItem>
          </button>
          <button
            onClick={() => setShowTermsOfService(true)}
            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <SettingsItem icon={Info} label="Terms of Service">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </SettingsItem>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">App Information</h3>
        </div>
        <div className="p-4 space-y-4">
          <SettingsItem icon={Info} label="Version">
            <span className="font-medium text-gray-800 text-sm">1.0.0</span>
          </SettingsItem>
          <SettingsItem icon={Info} label="Last Updated">
            <span className="font-medium text-gray-800 text-sm">
              Oct 01, 2024
            </span>
          </SettingsItem>
          <SettingsItem icon={Info} label="Data Sync">
            <span className="font-medium text-green-600 flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Connected
            </span>
          </SettingsItem>
        </div>
      </div>

      {showHelpCenter && (
        <HelpCenterModal onClose={() => setShowHelpCenter(false)} />
      )}
      {showPrivacyPolicy && (
        <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />
      )}
      {showTermsOfService && (
        <TermsOfServiceModal onClose={() => setShowTermsOfService(false)} />
      )}
    </div>
  );
}
