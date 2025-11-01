// src/types/formConfig.ts
// Dynamic form configuration for consistent Lead/Deal/Client forms

import type { Lead, Deal, Client, ProductType, PipelineStage } from './models';

// ============================================================================
// FIELD DESCRIPTOR TYPES
// ============================================================================

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'textarea'
  | 'date'
  | 'chips'
  | 'currency'
  | 'percentage';

export interface FieldOption {
  value: string | number;
  label: string;
}

export interface FieldDescriptor {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: FieldOption[];
  placeholder?: string;
  helpText?: string;
  default?: any;
  min?: number;
  max?: number;
  step?: number;
  visibleWhen?: (values: Record<string, any>) => boolean;
  transformOnSave?: (value: any, values: Record<string, any>) => any;
  section?: string; // for grouping fields
  gridCols?: 1 | 2; // for responsive layout (1 = full width, 2 = half width)
}

export interface FormSection {
  title: string;
  description?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  fields: FieldDescriptor[];
}

// ============================================================================
// LEAD FORM CONFIGURATION
// ============================================================================

export const LEAD_FORM_SECTIONS: FormSection[] = [
  {
    title: 'Basic Information',
    description: 'Essential contact details',
    fields: [
      {
        name: 'contact.full_name',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'Ahmed Al Maktoum',
        gridCols: 2,
      },
      {
        name: 'contact.designation',
        label: 'Designation',
        type: 'text',
        placeholder: 'Senior Manager',
        gridCols: 2,
      },
      {
        name: 'contact.company_name',
        label: 'Company Name',
        type: 'text',
        placeholder: 'Emirates Islamic Bank',
        gridCols: 2,
      },
      {
        name: 'source',
        label: 'Lead Source',
        type: 'select',
        options: [
          { value: 'website', label: 'Website' },
          { value: 'referral', label: 'Referral' },
          { value: 'cold_call', label: 'Cold Call' },
          { value: 'social_media', label: 'Social Media' },
          { value: 'event', label: 'Event' },
          { value: 'other', label: 'Other' },
        ],
        gridCols: 2,
      },
    ],
  },
  {
    title: 'Contact Information',
    fields: [
      {
        name: 'contact.phone',
        label: 'Phone Number',
        type: 'tel',
        required: true,
        placeholder: '+971 50 123 4567',
        helpText: 'Will auto-format with +971 prefix',
        gridCols: 2,
        transformOnSave: (value) => {
          // Normalize to E.164 format
          if (!value) return null;
          const digits = value.replace(/\D/g, '');
          if (digits.startsWith('971')) return `+${digits}`;
          if (digits.startsWith('0')) return `+971${digits.slice(1)}`;
          return `+971${digits}`;
        },
      },
      {
        name: 'contact.whatsapp_number',
        label: 'WhatsApp Number',
        type: 'tel',
        placeholder: '+971 50 123 4567',
