import React from 'react';
import { useUI } from '../../contexts/UIContext';

// FIX: Changed to React.FC to address potential type inference issues.
const ConfirmationModal: React.FC = () => {
    const { confirmation, hideConfirmation } = useUI();
    const { isOpen, title, message, onConfirm, onCancel } = confirmation;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm animate-slide-up">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700">Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
