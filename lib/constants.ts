import {
  User, CreditCard, DollarSign, Car, Home, Building, CheckCircle, List, Users, Briefcase, FileText, Activity, Award, Star, Gift, Phone, Shield, Clock, Inbox, Zap, Upload, Folder
} from 'lucide-react';

export const mockProducts = [
  {
    id: 1,
    name: "Personal Account",
    key: "savings_account",
    icon: User,
    color: "blue",
    description: "Everyday banking with savings and checking options.",
    total_clients: 1250,
    total_value: 15000000,
    growth: 2.5,
  },
  {
    id: 2,
    name: "Credit Card",
    key: "credit_card",
    icon: CreditCard,
    color: "purple",
    description: "Flexible credit solutions with rewards and benefits.",
    total_clients: 980,
    total_value: 5200000,
    growth: 5.1,
  },
  {
    id: 3,
    name: "Personal Finance",
    key: "personal_loan",
    icon: DollarSign,
    color: "green",
    description: "Personal loans for various needs and aspirations.",
    total_clients: 450,
    total_value: 25000000,
    growth: 1.8,
  },
  {
    id: 4,
    name: "Auto Finance",
    key: "car_loan",
    icon: Car,
    color: "orange",
    description: "Financing options to get your clients on the road.",
    total_clients: 320,
    total_value: 12800000,
    growth: -0.5,
  },
  {
    id: 5,
    name: "Home Finance",
    key: "home_loan",
    icon: Home,
    color: "red",
    description: "Mortgages and home equity loans for property owners.",
    total_clients: 210,
    total_value: 85000000,
    growth: 3.2,
  },
  {
    id: 6,
    name: "Business Banking",
    key: "business_loan",
    icon: Building,
    color: "indigo",
    description: "Comprehensive solutions for small and large businesses.",
    total_clients: 150,
    total_value: 150000000,
    growth: 4.5,
  }
];

export const mockReferrals = [
    { id: 'ref-1', name: 'Ali Bin Zayed', type: 'Bank Representative' },
    { id: 'ref-2', name: 'Sara Khan', type: 'Friend' },
    { id: 'ref-3', name: 'Hassan Iqbal', type: 'Relative' }
];

export const mockActivity: { id: number; type: string; text: string; time: string; }[] = [];

// Data for Add Lead Form
export const UAE_BANK_NAMES = [
  'Emirates Islamic Bank',
  'Emirates NBD',
  'Abu Dhabi Commercial Bank (ADCB)',
  'Dubai Islamic Bank (DIB)',
  'First Abu Dhabi Bank (FAB)',
  'RAKBANK',
  'Mashreq Bank',
  'Commercial Bank of Dubai (CBD)',
  'Abu Dhabi Islamic Bank (ADIB)',
  'Standard Chartered UAE',
  'HSBC Middle East',
  'National Bank of Fujairah (NBF)',
  'Ajman Bank',
];

export const EIB_CREDIT_CARDS: { name: string; slug: string; subtitle: string; }[] = [
  { name: 'Skywards Black Credit Card', slug: 'skywards-black-credit-card', subtitle: 'Ultra Premium | 3.5 Miles/USD' },
  { name: 'Skywards Infinite Credit Card', slug: 'skywards-infinite-credit-card', subtitle: 'Premium | 2 Miles/USD' },
  { name: 'Skywards Signature Credit Card', slug: 'skywards-signature-credit-card', subtitle: 'Mid-Tier | Details coming soon' },
  { name: 'Etihad Guest Premium', slug: 'etihad-guest-premium', subtitle: 'Ultra Premium | 3.5 Miles/USD' },
  { name: 'Etihad Guest Saqer', slug: 'etihad-guest-saqer', subtitle: 'Mid-Premium | 3 Miles/USD' },
  { name: 'Etihad Guest Ameera', slug: 'etihad-guest-ameera', subtitle: 'For Women | Details coming soon' },
  { name: 'Etihad Guest Platinum', slug: 'etihad-guest-platinum', subtitle: 'Entry Level | Details coming soon' },
  { name: 'Cashback Plus', slug: 'cashback-plus', subtitle: 'Premium Cashback | AED 299/yr' },
  { name: 'RTA Credit Card', slug: 'rta-credit-card', subtitle: 'Transport & Fuel | No Annual Fee' },
  { name: 'Switch Cashback Visa Signature', slug: 'switch-cashback-visa-signature', subtitle: 'Flexible Cashback | AED 299/yr' },
  { name: 'Flex Elite', slug: 'flex-elite', subtitle: 'Premium SmartMiles | AED 700/yr' },
  { name: 'Emarati Credit Card', slug: 'emarati-credit-card', subtitle: 'UAE Nationals | No Annual Fee' },
  { name: 'Flex Credit Card', slug: 'flex-credit-card', subtitle: 'Flexible Rewards | No Annual Fee' },
];

export const PRODUCT_TYPES = ['Credit Card', 'Personal Loan', 'Home Loan', 'Auto Loan', 'Account Opening'];
export const UAE_EMIRATES = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];

export const VISA_STATUS_OPTIONS = ["Employment Visa", "Investor Visa", "Dependent Visa", "Golden Visa", "Other"];

export const KANBAN_STAGES = [
    { id: 'application_processing', title: 'Application Processing', color: 'border-t-blue-500' },
    { id: 'verification_needed', title: 'Verification Needed', color: 'border-t-yellow-500' },
    { id: 'activation_needed', title: 'Activation Needed', color: 'border-t-purple-500' },
    { id: 'completed', title: 'Completed', color: 'border-t-green-500' },
    { id: 'unsuccessful', title: 'Unsuccessful', color: 'border-t-red-500' }
 ];