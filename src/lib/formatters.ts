// src/lib/formatters.ts
// Centralized formatting, normalization, and validation utilities

// ============================================================================
// PHONE NUMBER FORMATTING
// ============================================================================

/**
 * Normalize phone number to E.164 format for UAE
 * @param phone - Raw phone input
 * @returns Formatted phone in E.164 (+971XXXXXXXXX) or null
 */
export function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Handle empty result
  if (!digits) return null;

  // Already in international format with +971
  if (digits.startsWith('971')) {
    return `+${digits}`;
  }

  // Local format starting with 0 (e.g., 0501234567)
  if (digits.startsWith('0')) {
    return `+971${digits.slice(1)}`;
  }

  // Assume local without leading 0
  return `+971${digits}`;
}

/**
 * Format phone for display (removes +971, adds spaces)
 * @param phone - E.164 formatted phone
 * @returns Display format: "50 123 4567"
 */
export function formatPhoneDisplay(phone: string | null | undefined): string {
  if (!phone) return '';

  const digits = phone.replace(/\D/g, '');

  // Remove country code if present
  const local = digits.startsWith('971') ? digits.slice(3) : digits.replace(/^0+/, '');

  // Format as XX XXX XXXX
  if (local.length === 9) {
    return `${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
  }

  return local;
}

/**
 * Validate UAE phone number
 * @param phone - Phone number to validate
 * @returns true if valid UAE number
 */
export function isValidUAEPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;

  const digits = phone.replace(/\D/g, '');
  const localDigits = digits.startsWith('971') ? digits.slice(3) : digits.replace(/^0+/, '');

  // UAE mobile: starts with 50, 52, 54, 55, 56, 58
  // UAE landline: starts with 2, 3, 4, 6, 7, 9
  return /^(5[024568]|[2-46-9])\d{7}$/.test(localDigits);
}

// ============================================================================
// EMAIL FORMATTING
// ============================================================================

/**
 * Normalize email (lowercase, trim)
 * @param email - Raw email input
 * @returns Normalized email or null
 */
export function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  return email.toLowerCase().trim();
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns true if valid format
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Format amount as AED currency
 * @param amount - Numeric amount
 * @param showCurrency - Whether to show "AED" prefix
 * @returns Formatted string: "AED 12,345" or "12,345"
 */
export function formatCurrency(
  amount: number | null | undefined,
  showCurrency: boolean = true
): string {
  if (amount === null || amount === undefined) return '';

  const formatted = new Intl.NumberFormat('en-AE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return showCurrency ? `AED ${formatted}` : formatted;
}

/**
 * Parse currency input to number
 * @param value - String input (may contain AED, commas, etc.)
 * @returns Numeric value or null
 */
export function parseCurrency(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') return value;

  // Remove currency symbols, commas, and whitespace
  const cleaned = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? null : parsed;
}

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Format ISO date to display format
 * @param date - ISO date string (YYYY-MM-DD)
 * @param format - 'short' | 'long'
 * @returns Formatted date string
 */
export function formatDate(
  date: string | null | undefined,
  format: 'short' | 'long' = 'short'
): string {
  if (!date) return '';

  const d = new Date(date);

  if (isNaN(d.getTime())) return '';

  if (format === 'long') {
    return new Intl.DateTimeFormat('en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  }

  return new Intl.DateTimeFormat('en-AE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 * @param date - Date object or string
 * @returns ISO date string
 */
export function toISODate(date: Date | string | null | undefined): string | null {
  if (!date) return null;

  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) return null;

  return d.toISOString().split('T')[0];
}

/**
 * Get date N days from now
 * @param days - Number of days to add (can be negative)
 * @returns ISO date string
 */
export function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toISODate(date)!;
}

/**
 * Calculate days between two dates
 * @param date1 - First date (ISO string)
 * @param date2 - Second date (ISO string)
 * @returns Number of days difference
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ============================================================================
// PERCENTAGE FORMATTING
// ============================================================================

/**
 * Format percentage
 * @param value - Numeric percentage (0-100)
 * @returns Formatted string: "25%"
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return `${Math.round(value)}%`;
}

/**
 * Parse percentage input
 * @param value - String input (may contain %)
 * @returns Numeric value (0-100) or null
 */
export function parsePercentage(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') {
    return Math.max(0, Math.min(100, value));
  }

  const cleaned = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);

  if (isNaN(parsed)) return null;

  return Math.max(0, Math.min(100, parsed));
}

// ============================================================================
// NAME FORMATTING
// ============================================================================

/**
 * Get initials from full name
 * @param name - Full name
 * @returns Initials (max 2 characters)
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Capitalize first letter of each word
 * @param str - Input string
 * @returns Title cased string
 */
export function titleCase(str: string | null | undefined): string {
  if (!str) return '';

  return str
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 * @param value - Value to check
 * @returns true if empty
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Validate required field
 * @param value - Value to validate
 * @param fieldName - Field name for error message
 * @returns Error message or null
 */
export function validateRequired(value: unknown, fieldName: string): string | null {
  return isEmpty(value) ? `${fieldName} is required` : null;
}

/**
 * Validate numeric range
 * @param value - Numeric value
 * @param min - Minimum value
 * @param max - Maximum value
 * @param fieldName - Field name for error message
 * @returns Error message or null
 */
export function validateRange(
  value: number | null | undefined,
  min: number | undefined,
  max: number | undefined,
  fieldName: string
): string | null {
  if (value === null || value === undefined) return null;

  if (min !== undefined && value < min) {
    return `${fieldName} must be at least ${min}`;
  }

  if (max !== undefined && value > max) {
    return `${fieldName} must be at most ${max}`;
  }

  return null;
}

// ============================================================================
// EMIRATES ID VALIDATION
// ============================================================================

/**
 * Format Emirates ID (784-XXXX-XXXXXXX-X)
 * @param id - Raw Emirates ID input
 * @returns Formatted Emirates ID or null
 */
export function formatEmiratesID(id: string | null | undefined): string | null {
  if (!id) return null;

  const digits = id.replace(/\D/g, '');

  if (digits.length !== 15) return null;

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 14)}-${digits.slice(14)}`;
}

/**
 * Validate Emirates ID
 * @param id - Emirates ID to validate
 * @returns true if valid format
 */
export function isValidEmiratesID(id: string | null | undefined): boolean {
  if (!id) return false;

  const digits = id.replace(/\D/g, '');

  // Must be 15 digits starting with 784
  return /^784\d{12}$/.test(digits);
}

// ============================================================================
// TAG UTILITIES
// ============================================================================

/**
 * Normalize tag (lowercase, trim, remove special chars)
 * @param tag - Raw tag input
 * @returns Normalized tag or null
 */
export function normalizeTag(tag: string | null | undefined): string | null {
  if (!tag) return null;

  return tag
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

/**
 * Normalize array of tags
 * @param tags - Array of raw tag inputs
 * @returns Array of normalized unique tags
 */
export function normalizeTags(tags: string[] | null | undefined): string[] {
  if (!tags || !Array.isArray(tags)) return [];

  return Array.from(
    new Set(
      tags
        .map(normalizeTag)
        .filter((t): t is string => t !== null && t !== '')
    )
  );
}
