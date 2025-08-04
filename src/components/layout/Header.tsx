'use client';

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { mockNotifications, mockUser } from '@/lib/mockData';

interface HeaderProps {
  onSidebarToggle: () => void;
  onChatToggle: () => void;
}

export default function Header({ onSidebarToggle, onChatToggle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifications = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="bg-smartax-ivory border-b border-smartax-blue-graphite/20 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-smartax-blue-graphite/60" />
            <input
              type="text"
              placeholder="Buscar facturas, documentos, normativas..."
              className="w-full pl-10 pr-4 py-2.5 border border-smartax-blue-graphite/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-smartax-copper focus:border-transparent bg-white hover:bg-smartax-ivory transition-colors font-smartax-secondary placeholder:text-smartax-blue-graphite/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Virtual Assistant */}
          <button
            onClick={onChatToggle}
            className="p-2.5 rounded-xl hover:bg-smartax-blue-graphite/10 transition-colors relative group"
            title="Asistente Virtual"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-smartax-blue-graphite group-hover:text-smartax-copper" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-smartax-copper rounded-full animate-smartax-pulse"></span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl hover:bg-smartax-blue-graphite/10 transition-colors relative group"
              title="Notificaciones"
            >
              <BellIcon className="h-5 w-5 text-smartax-blue-graphite group-hover:text-smartax-copper" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-smartax-copper text-smartax-ivory text-xs rounded-full flex items-center justify-center font-smartax-secondary font-medium">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 smartax-card z-50"
                >
                  <div className="p-4 border-b border-smartax-blue-graphite/20">
                    <h3 className="text-sm font-smartax-text font-semibold text-smartax-blue-prussia">Notificaciones</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-smartax-blue-graphite/10 hover:bg-smartax-blue-graphite/5 transition-colors ${
                          !notification.read ? 'bg-smartax-copper/5' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'success' ? 'bg-smartax-copper' :
                            notification.type === 'warning' ? 'bg-smartax-terracotta' :
                            notification.type === 'error' ? 'bg-smartax-copper' :
                            'bg-smartax-blue-graphite'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-smartax-text font-medium text-smartax-blue-prussia">
                              {notification.title}
                            </p>
                            <p className="text-sm font-smartax-secondary text-smartax-blue-graphite mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs font-smartax-secondary text-smartax-blue-graphite/60 mt-2">
                              {new Date(notification.createdAt).toLocaleDateString('es-MX')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-smartax-blue-graphite/20">
                    <button className="text-sm font-smartax-secondary text-smartax-copper hover:text-smartax-copper font-medium">
                      Ver todas las notificaciones
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-smartax-blue-graphite/10 transition-colors"
            >
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className="h-8 w-8 rounded-full border-2 border-smartax-copper shadow-sm"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-smartax-text font-medium text-smartax-blue-prussia">{mockUser.name}</p>
                <p className="text-xs font-smartax-secondary text-smartax-blue-graphite">{mockUser.role === 'user' ? 'Usuario' : mockUser.role}</p>
              </div>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-64 smartax-card z-50"
                >
                  <div className="p-4 border-b border-smartax-blue-graphite/20">
                    <div className="flex items-center space-x-3">
                      <img
                        src={mockUser.avatar}
                        alt={mockUser.name}
                        className="h-12 w-12 rounded-full border-2 border-smartax-copper shadow-sm"
                      />
                      <div>
                        <p className="text-sm font-smartax-text font-semibold text-smartax-blue-prussia">{mockUser.name}</p>
                        <p className="text-xs font-smartax-secondary text-smartax-blue-graphite">{mockUser.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-smartax-blue-graphite/10 transition-colors">
                      <Cog6ToothIcon className="h-4 w-4 text-smartax-blue-graphite" />
                      <span className="text-sm font-smartax-secondary text-smartax-blue-graphite">Configuración</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-smartax-blue-graphite/10 transition-colors text-left">
                      <svg className="h-4 w-4 text-smartax-blue-graphite" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-sm font-smartax-secondary text-smartax-blue-graphite">Cerrar Sesión</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
} 