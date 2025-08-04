'use client';

import {
  HomeIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  FolderIcon,
  BellIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { mockUser } from '@/lib/mockData';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const navigationItems = [
  {
    id: 'dashboard',
    name: 'Panel Principal',
    icon: HomeIcon,
    description: 'Vista general y métricas',
  },
  {
    id: 'compliance',
    name: 'Cumplimiento',
    icon: DocumentCheckIcon,
    description: 'CFDI y declaraciones',
  },
  {
    id: 'optimization',
    name: 'Optimización',
    icon: ChartBarIcon,
    description: 'IA y simulaciones',
  },
  {
    id: 'documents',
    name: 'Documentos',
    icon: FolderIcon,
    description: 'Gestión documental',
  },
  {
    id: 'alerts',
    name: 'Alertas',
    icon: BellIcon,
    description: 'Notificaciones y riesgos',
  },
  {
    id: 'configuration',
    name: 'Configuración',
    icon: CogIcon,
    description: 'Conexiones SAT, bancos y ERP',
  },
];

export default function Sidebar({ isOpen, onToggle, activeModule, onModuleChange }: SidebarProps) {
  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-gradient-smartax-primary border-r border-smartax-blue-graphite/20 shadow-sm relative z-10"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-smartax-blue-graphite/20">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-3"
                >
                  <div className="h-10 w-10 bg-gradient-smartax-warm rounded-xl flex items-center justify-center animate-smartax-glow">
                    <svg className="h-6 w-6 text-smartax-ivory" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-smartax-display font-semibold text-smartax-ivory">SmarTax AI</h1>
                    <p className="text-xs font-smartax-secondary text-smartax-ivory/70">Gestión Fiscal</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-10 w-10 bg-gradient-smartax-warm rounded-xl flex items-center justify-center mx-auto animate-smartax-glow"
                >
                  <svg className="h-6 w-6 text-smartax-ivory" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-smartax-blue-graphite/20 transition-colors"
            >
              {isOpen ? (
                <ChevronLeftIcon className="h-5 w-5 text-smartax-ivory/70" />
              ) : (
                <ChevronRightIcon className="h-5 w-5 text-smartax-ivory/70" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = activeModule === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onModuleChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-smartax-accent border border-smartax-copper/30 text-smartax-ivory'
                    : 'hover:bg-smartax-ivory/10 text-smartax-ivory hover:text-white'
                }`}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-smartax-ivory' : 'text-smartax-ivory group-hover:text-white'
                  }`}
                />
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      key="nav-text"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 text-left"
                    >
                      <div className="font-smartax-text font-medium text-sm">{item.name}</div>
                      {isActive && (
                        <div className="text-xs font-smartax-secondary text-smartax-ivory/80 mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-smartax-blue-graphite/20">
          <AnimatePresence>
            {isOpen ? (
              <motion.div
                key="user-expanded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3 p-3 rounded-xl bg-smartax-blue-graphite/20 hover:bg-smartax-blue-graphite/30 transition-colors cursor-pointer"
                onClick={() => onModuleChange('configuration')}
              >
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="h-10 w-10 rounded-full border-2 border-smartax-copper shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-smartax-text font-medium text-smartax-ivory truncate">
                    {mockUser.name}
                  </p>
                  <p className="text-xs font-smartax-secondary text-smartax-ivory/70 truncate">
                    {mockUser.company.name}
                  </p>
                </div>
                <CogIcon className="h-5 w-5 text-smartax-ivory/60" />
              </motion.div>
            ) : (
              <motion.div
                key="user-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center"
              >
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="h-10 w-10 rounded-full border-2 border-smartax-copper shadow-sm cursor-pointer hover:ring-2 hover:ring-smartax-terracotta/50 transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
} 