'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CogIcon,
  LinkIcon,
  KeyIcon,
  BanknotesIcon,
  DocumentCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  TrashIcon,
  CloudIcon,
  ServerIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface SATConnection {
  id: string;
  rfc: string;
  ciec: string;
  certificate?: File;
  privateKey?: File;
  certificatePassword: string;
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  lastSync?: Date;
}

interface BankConnection {
  id: string;
  bankName: string;
  accountNumber: string;
  apiKey: string;
  apiSecret: string;
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  lastSync?: Date;
}

interface ERPConnection {
  id: string;
  erpName: string;
  apiUrl: string;
  username: string;
  password: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
}

export default function ConfigurationModule() {
  const [activeTab, setActiveTab] = useState('sat');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [satConnections, setSatConnections] = useState<SATConnection[]>([
    {
      id: '1',
      rfc: 'XAXX010101000',
      ciec: 'Mi********',
      certificatePassword: '**********',
      status: 'connected',
      lastSync: new Date('2024-11-28T10:30:00'),
    }
  ]);
  const [bankConnections, setBankConnections] = useState<BankConnection[]>([
    {
      id: '1',
      bankName: 'BBVA',
      accountNumber: '****1234',
      apiKey: 'bbva_****',
      apiSecret: '**********',
      status: 'connected',
      lastSync: new Date('2024-11-28T09:15:00'),
    }
  ]);
  const [erpConnections, setErpConnections] = useState<ERPConnection[]>([]);
  const [isAddingConnection, setIsAddingConnection] = useState(false);

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const tabs = [
    { id: 'sat', name: 'SAT', icon: DocumentCheckIcon, description: 'Conexión con el Servicio de Administración Tributaria' },
    { id: 'banks', name: 'Bancos', icon: BanknotesIcon, description: 'Conexiones bancarias para cálculo de IVA' },
    { id: 'erp', name: 'ERP', icon: ServerIcon, description: 'Integración con sistemas ERP empresariales' },
  ];

  const testConnection = async (type: string, id: string) => {
    // Simulate connection test
    if (type === 'sat') {
      setSatConnections(prev => prev.map(conn => 
        conn.id === id ? { ...conn, status: 'connecting' } : conn
      ));

      await new Promise(resolve => setTimeout(resolve, 2000));

      const success = Math.random() > 0.3; // 70% success rate
      setSatConnections(prev => prev.map(conn => 
        conn.id === id ? { 
          ...conn, 
          status: success ? 'connected' : 'error',
          lastSync: success ? new Date() : conn.lastSync
        } : conn
      ));
    } else if (type === 'banks') {
      setBankConnections(prev => prev.map(conn => 
        conn.id === id ? { ...conn, status: 'connecting' } : conn
      ));

      await new Promise(resolve => setTimeout(resolve, 2000));

      const success = Math.random() > 0.3; // 70% success rate
      setBankConnections(prev => prev.map(conn => 
        conn.id === id ? { 
          ...conn, 
          status: success ? 'connected' : 'error',
          lastSync: success ? new Date() : conn.lastSync
        } : conn
      ));
    }
  };

  const renderSATTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Conexiones SAT</h3>
          <p className="text-sm text-gray-600">Configura las credenciales para acceder al SAT</p>
        </div>
        <button
          onClick={() => setIsAddingConnection(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Agregar Conexión</span>
        </button>
      </div>

      {/* Existing SAT Connections */}
      <div className="space-y-4">
        {satConnections.map((connection) => (
          <div key={connection.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  connection.status === 'connected' ? 'bg-success-500' :
                  connection.status === 'error' ? 'bg-danger-500' :
                  connection.status === 'connecting' ? 'bg-blue-500 animate-pulse' :
                  'bg-warning-500'
                }`}></div>
                <div>
                  <h4 className="font-medium text-gray-900">RFC: {connection.rfc}</h4>
                  <p className="text-sm text-gray-600">
                    {connection.status === 'connected' && connection.lastSync && 
                      `Última sincronización: ${connection.lastSync.toLocaleString('es-MX')}`
                    }
                    {connection.status === 'error' && 'Error de conexión'}
                    {connection.status === 'disconnected' && 'Desconectado'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  connection.status === 'connected' ? 'bg-success-100 text-success-800' :
                  connection.status === 'error' ? 'bg-danger-100 text-danger-800' :
                  connection.status === 'connecting' ? 'bg-blue-100 text-blue-800' :
                  'bg-warning-100 text-warning-800'
                }`}>
                  {connection.status === 'connected' ? 'Conectado' :
                   connection.status === 'error' ? 'Error' : 
                   connection.status === 'connecting' ? 'Conectando...' : 'Desconectado'}
                </span>
                <button
                  onClick={() => testConnection('sat', connection.id)}
                  className="btn-secondary text-sm px-3 py-1"
                  disabled={connection.status === 'connecting'}
                >
                  {connection.status === 'connecting' ? 'Probando...' : 'Probar'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CIEC</label>
                <div className="relative">
                  <input
                    type={showPasswords[`ciec-${connection.id}`] ? 'text' : 'password'}
                    value={connection.ciec}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                  <button
                    onClick={() => togglePasswordVisibility(`ciec-${connection.id}`)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords[`ciec-${connection.id}`] ? (
                      <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña del Certificado</label>
                <div className="relative">
                  <input
                    type={showPasswords[`cert-${connection.id}`] ? 'text' : 'password'}
                    value={connection.certificatePassword}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                  <button
                    onClick={() => togglePasswordVisibility(`cert-${connection.id}`)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords[`cert-${connection.id}`] ? (
                      <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <strong>Certificados instalados:</strong> Se detectaron certificados .cer y .key válidos para este RFC
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New SAT Connection Form */}
      {isAddingConnection && (
        <div className="card border-2 border-primary-200">
          <h4 className="font-medium text-gray-900 mb-4">Nueva Conexión SAT</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RFC</label>
              <input
                type="text"
                placeholder="XAXX010101000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CIEC</label>
              <input
                type="password"
                placeholder="Clave de Identificación Electrónica Confidencial"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificado (.cer)</label>
                <label className="btn-secondary cursor-pointer w-full inline-block text-center">
                  <KeyIcon className="h-4 w-4 mr-2 inline" />
                  Seleccionar Archivo
                  <input type="file" className="hidden" accept=".cer" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Llave Privada (.key)</label>
                <label className="btn-secondary cursor-pointer w-full inline-block text-center">
                  <ShieldCheckIcon className="h-4 w-4 mr-2 inline" />
                  Seleccionar Archivo
                  <input type="file" className="hidden" accept=".key" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña del Certificado</label>
              <input
                type="password"
                placeholder="Contraseña de la llave privada"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAddingConnection(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button className="btn-primary">
                Guardar y Probar Conexión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBanksTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Conexiones Bancarias</h3>
          <p className="text-sm text-gray-600">Configura las APIs bancarias para cálculo de IVA</p>
        </div>
        <button
          onClick={() => setIsAddingConnection(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Agregar Banco</span>
        </button>
      </div>

      {/* Existing Bank Connections */}
      <div className="space-y-4">
        {bankConnections.map((connection) => (
          <div key={connection.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  connection.status === 'connected' ? 'bg-success-500' :
                  connection.status === 'error' ? 'bg-danger-500' :
                  connection.status === 'connecting' ? 'bg-blue-500 animate-pulse' :
                  'bg-warning-500'
                }`}></div>
                <div>
                  <h4 className="font-medium text-gray-900">{connection.bankName}</h4>
                  <p className="text-sm text-gray-600">Cuenta: {connection.accountNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  connection.status === 'connected' ? 'bg-success-100 text-success-800' :
                  connection.status === 'error' ? 'bg-danger-100 text-danger-800' :
                  connection.status === 'connecting' ? 'bg-blue-100 text-blue-800' :
                  'bg-warning-100 text-warning-800'
                }`}>
                  {connection.status === 'connected' ? 'Conectado' :
                   connection.status === 'error' ? 'Error' : 
                   connection.status === 'connecting' ? 'Conectando...' : 'Desconectado'}
                </span>
                <button
                  onClick={() => testConnection('banks', connection.id)}
                  className="btn-secondary text-sm px-3 py-1"
                  disabled={connection.status === 'connecting'}
                >
                  {connection.status === 'connecting' ? 'Probando...' : 'Probar'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input
                  type="password"
                  value={connection.apiKey}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Secret</label>
                <input
                  type="password"
                  value={connection.apiSecret}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderERPTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Conexiones ERP</h3>
          <p className="text-sm text-gray-600">Integra con sistemas empresariales</p>
        </div>
        <button
          onClick={() => setIsAddingConnection(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Agregar ERP</span>
        </button>
      </div>

      {erpConnections.length === 0 ? (
        <div className="text-center py-12">
          <ServerIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay conexiones ERP</h3>
          <p className="text-gray-600 mb-4">Agrega una conexión a tu sistema ERP para sincronizar datos</p>
          <button className="btn-primary">Agregar Primera Conexión</button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* ERP connections would be rendered here */}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'sat':
        return renderSATTab();
      case 'banks':
        return renderBanksTab();
      case 'erp':
        return renderERPTab();
      default:
        return renderSATTab();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Configuración de Conexiones</h1>
        <div className="flex items-center space-x-2">
          <CloudIcon className="h-5 w-5 text-success-600" />
          <span className="text-sm text-success-600 font-medium">Todas las conexiones están seguras</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <div className="text-left">
                  <div>{tab.name}</div>
                  <div className="text-xs font-normal text-gray-500">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {renderContent()}
    </motion.div>
  );
} 