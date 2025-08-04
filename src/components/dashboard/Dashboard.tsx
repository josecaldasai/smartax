'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import DashboardContent from './DashboardContent';
import ComplianceModule from '../compliance/ComplianceModule';
import OptimizationModule from '../optimization/OptimizationModule';
import DocumentsModule from '../documents/DocumentsModule';
import AlertsModule from '../alerts/AlertsModule';
import VirtualAssistant from '../assistant/VirtualAssistant';
import ConfigurationModule from '../configuration/ConfigurationModule';

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const modules = {
    dashboard: <DashboardContent />,
    optimization: <OptimizationModule />,
    documents: <DocumentsModule />,
    compliance: <ComplianceModule />,
    alerts: <AlertsModule />,
    assistant: <VirtualAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />,
    configuration: <ConfigurationModule />,
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardContent />;
      case 'compliance':
        return <ComplianceModule />;
      case 'optimization':
        return <OptimizationModule />;
      case 'documents':
        return <DocumentsModule />;
      case 'alerts':
        return <AlertsModule />;
      case 'configuration':
        return <ConfigurationModule />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="h-screen flex bg-gradient-smartax-light">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onChatToggle={() => setIsChatOpen(!isChatOpen)}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderActiveModule()}
        </main>
      </div>

      {/* Virtual Assistant */}
      <VirtualAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
} 