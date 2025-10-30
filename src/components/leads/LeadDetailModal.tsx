import React, { useState, useEffect } from 'react';
import { X, Trash2, Save } from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { Lead } from '../../types';
import { useUI } from '../../contexts/UIContextDefinitions';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
}) => {
  const { updateLead, deleteLead } = useLeads();
  const { showConfirmation, addNotification } = useUI();
  const [formData, setFormData] = useState<Partial<Lead>>({});

  useEffect(() => {
    if (lead) {
      setFormData(lead);
    }
  }, [lead]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
            ? value === ''
              ? null
              : Number(value)
            : value,
    }));
  };

  const handleDocumentChange = (document: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      documents_available: checked
        ? [...(prev.documents_available || []), document]
        : (prev.documents_available || []).filter((doc) => doc !== document),
    }));
  };

  const handleSave = () => {
    if (!lead) return;

    updateLead.mutate(
      { id: lead.id, updates: formData },
      {
        onSuccess: () => {
          addNotification(
            'Lead Updated',
            'Lead details have been saved successfully.'
          );
          onClose();
        },
        onError: (error: Error) => {
          addNotification('Update Failed', error.message);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!lead) return;

    showConfirmation(
      'Delete Lead',
      `Are you sure you want to delete "${lead.full_name}"? This action cannot be undone.`,
      () => {
        deleteLead.mutate(lead.id, {
          onSuccess: () => {
            addNotification(
              'Lead Deleted',
              'Lead has been deleted successfully.'
            );
            onClose();
          },
          onError: (error: Error) => {
            addNotification('Delete Failed', error.message);
          },
        });
      }
    );
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Lead Details: {lead.full_name}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Lead"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form className="space-y-6">
            {/* Personal Information */}
            <fieldset className="border border-gray-200 rounded-lg p-4">
              <legend className="text-sm font-semibold text-[#1a68c7] px-2">
                Personal Information
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  />
                </div>
              </div>
            </fieldset>

            {/* Product Information */}
            <fieldset className="border border-gray-200 rounded-lg p-4">
              <legend className="text-sm font-semibold text-[#1a68c7] px-2">
                Product Information
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Bank Applying
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Product Type
                  </label>
                  <input
                    type="text"
                    name="product_type"
                    value={formData.product_type || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Specific Product
                  </label>
                  <input
                    type="text"
                    name="product"
                    value={formData.product || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  />
                </div>
              </div>
            </fieldset>

            {/* Salary Information */}
            <fieldset className="border border-gray-200 rounded-lg p-4">
              <legend className="text-sm font-semibold text-[#1a68c7] px-2">
                Salary Information
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Salary (AED)
                  </label>
                  <input
                    type="number"
                    name="monthly_salary"
                    value={formData.monthly_salary || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Salary getting from (months)
                  </label>
                  <input
                    type="number"
                    name="salary_months"
                    value={formData.salary_months || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Any variations in salary?
                  </label>
                  <select
                    name="salary_variations"
                    value={formData.salary_variations ? 'yes' : 'no'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salary_variations: e.target.value === 'yes',
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    If yes, last 3 months payslips are required to confirm the
                    reason.
                  </p>
                </div>
              </div>
            </fieldset>

            {/* Existing Credit & EMI */}
            <fieldset className="border border-gray-200 rounded-lg p-4">
              <legend className="text-sm font-semibold text-[#1a68c7] px-2">
                Existing Credit & EMI
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Already using credit cards?
                  </label>
                  <select
                    name="existing_cards"
                    value={formData.existing_cards ? 'yes' : 'no'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        existing_cards: e.target.value === 'yes',
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    If yes, from how long?
                  </label>
                  <input
                    type="text"
                    name="cards_duration"
                    value={formData.cards_duration || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 years"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Total credit limit (AED)
                  </label>
                  <input
                    type="number"
                    name="total_credit_limit"
                    value={formData.total_credit_limit || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Any EMI/Loan paying?
                  </label>
                  <select
                    name="has_emi"
                    value={formData.has_emi ? 'yes' : 'no'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_emi: e.target.value === 'yes',
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Total EMI amount (AED)
                  </label>
                  <input
                    type="number"
                    name="emi_amount"
                    value={formData.emi_amount || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  />
                </div>
              </div>
            </fieldset>

            {/* Application History & Documents */}
            <fieldset className="border border-gray-200 rounded-lg p-4">
              <legend className="text-sm font-semibold text-[#1a68c7] px-2">
                Application History & Documents
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Applied same bank/product in last 60 days?
                  </label>
                  <select
                    name="applied_recently"
                    value={formData.applied_recently ? 'yes' : 'no'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        applied_recently: e.target.value === 'yes',
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a68c7] focus:border-transparent"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-2">
                    Documents Available?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      'Emirates ID',
                      'Passport Photo',
                      'Salary Certificate',
                      'Labor Contract',
                      'Payslips',
                    ].map((doc) => (
                      <label key={doc} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={(
                            formData.documents_available || []
                          ).includes(doc)}
                          onChange={(e) =>
                            handleDocumentChange(doc, e.target.checked)
                          }
                          className="rounded border-gray-300 text-[#1a68c7] focus:ring-[#1a68c7]"
                        />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </fieldset>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#1a68c7] text-white hover:bg-[#1455a6] rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
