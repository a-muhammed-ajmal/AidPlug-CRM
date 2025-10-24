import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password?: string;
  onValidationChange: (isValid: boolean) => void;
}

const requirements = [
  { text: 'At least 8 characters', regex: /.{8,}/ },
  { text: 'At least one uppercase letter', regex: /[A-Z]/ },
  { text: 'At least one lowercase letter', regex: /[a-z]/ },
  { text: 'At least one number', regex: /[0-9]/ },
  { text: 'At least one special character', regex: /[^A-Za-z0-9]/ },
];

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '', onValidationChange }) => {
  const [validation, setValidation] = useState(
    requirements.map(req => ({ ...req, valid: false }))
  );

  useEffect(() => {
    const newValidation = requirements.map(req => ({
      ...req,
      valid: req.regex.test(password),
    }));
    setValidation(newValidation);
    onValidationChange(newValidation.every(req => req.valid));
  }, [password, onValidationChange]);

  return (
    <div className="space-y-1 mt-2">
      {validation.map(({ text, valid }) => (
        <div key={text} className={`flex items-center text-sm transition-colors ${valid ? 'text-green-600' : 'text-gray-500'}`}>
          {valid ? <Check className="w-4 h-4 mr-2 flex-shrink-0" /> : <X className="w-4 h-4 mr-2 flex-shrink-0" />}
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
};

export default PasswordStrengthIndicator;
