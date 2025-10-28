import React from 'react';
import {
  Home,
  Users,
  Briefcase,
  List,
  Inbox,
  Settings,
  User as UserIcon,
  PieChart,
} from 'lucide-react';

export interface NavItem {
  key: string;
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}

export const mainNavItems: NavItem[] = [
  { key: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
  { key: 'leads', icon: Users, label: 'Leads', path: '/leads' },
  { key: 'clients', icon: Inbox, label: 'Clients', path: '/clients' },
  { key: 'products', icon: PieChart, label: 'Products', path: '/products' },
  { key: 'deals', icon: Briefcase, label: 'Deals', path: '/deals' },
  { key: 'tasks', icon: List, label: 'Tasks', path: '/tasks' },
];

export const secondaryNavItems: NavItem[] = [
  { key: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

// Define which items appear in the bottom nav by their key
export const bottomNavKeys: string[] = [
  'dashboard',
  'leads',
  'deals',
  'clients',
  'tasks',
];
