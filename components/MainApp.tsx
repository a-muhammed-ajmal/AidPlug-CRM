
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MobileHeader from './navigation/MobileHeader';
import MobileNavigation from './navigation/MobileNavigation';
import Dashboard from './dashboard/Dashboard';
import LeadsPage from './leads/LeadsPage';
import ClientsPage from './clients/ClientsPage';
import DealsPage from './deals/DealsPage';
import TasksPage from './tasks/TasksPage';
import PWAInstallPrompt from './common/PWAInstallPrompt';

export default function MainApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      <main className="pb-20 pt-16">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      <MobileNavigation />
      <PWAInstallPrompt />
    </div>
  );
}
