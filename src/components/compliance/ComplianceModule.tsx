'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { mockCFDIs, mockFiscalObligations } from '@/lib/mockData';

export default function ComplianceModule() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const tabs = [
    { id: 'overview', name: 'Resumen General', icon: ChartBarIcon },
    { id: 'cfdi', name: 'Validación CFDI', icon: DocumentCheckIcon },
    { id: 'obligations', name: 'Obligaciones', icon: ClockIcon },
    { id: 'reports', name: 'Reportes', icon: DocumentTextIcon },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircleIcon className="h-5 w-5 text-smartax-copper" />;
      case 'invalid':
        return <XCircleIcon className="h-5 w-5 text-smartax-copper" />;
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-5 w-5 text-smartax-terracotta" />;
      default:
        return <ClockIcon className="h-5 w-5 text-smartax-blue-graphite" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-smartax-copper/20 text-smartax-copper';
      case 'invalid':
        return 'bg-smartax-copper/20 text-smartax-copper';
      case 'cancelled':
        return 'bg-smartax-terracotta/20 text-smartax-terracotta';
      case 'pending':
        return 'bg-smartax-terracotta/20 text-smartax-terracotta';
      case 'completed':
        return 'bg-smartax-copper/20 text-smartax-copper';
      case 'overdue':
        return 'bg-smartax-copper/20 text-smartax-copper';
      default:
        return 'bg-smartax-blue-graphite/20 text-smartax-blue-graphite';
    }
  };

  const complianceStats = {
    cfdiValid: mockCFDIs.filter(c => c.status === 'valid').length,
    cfdiInvalid: mockCFDIs.filter(c => c.status === 'invalid').length,
    obligationsPending: mockFiscalObligations.filter(o => o.status === 'pending').length,
    obligationsOverdue: mockFiscalObligations.filter(o => o.status === 'overdue').length,
    totalIncome: mockCFDIs.filter(c => c.type === 'issued').reduce((sum, c) => sum + c.total, 0),
    totalExpenses: mockCFDIs.filter(c => c.type === 'received').reduce((sum, c) => sum + c.total, 0),
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">
            {complianceStats.cfdiValid}
          </div>
          <div className="text-sm text-gray-600">CFDI Válidos</div>
          <div className="mt-2">
            <CheckCircleIcon className="h-6 w-6 text-success-500 mx-auto" />
          </div>
        </div>

        <div className="card text-center">
          <div className="text-3xl font-bold text-danger-600 mb-2">
            {complianceStats.cfdiInvalid}
          </div>
          <div className="text-sm text-gray-600">CFDI con Errores</div>
          <div className="mt-2">
            <XCircleIcon className="h-6 w-6 text-danger-500 mx-auto" />
          </div>
        </div>

        <div className="card text-center">
          <div className="text-3xl font-bold text-warning-600 mb-2">
            {complianceStats.obligationsPending}
          </div>
          <div className="text-sm text-gray-600">Obligaciones Pendientes</div>
          <div className="mt-2">
            <ClockIcon className="h-6 w-6 text-warning-500 mx-auto" />
          </div>
        </div>

        <div className="card text-center">
          <div className="text-3xl font-bold text-danger-600 mb-2">
            {complianceStats.obligationsOverdue}
          </div>
          <div className="text-sm text-gray-600">Obligaciones Vencidas</div>
          <div className="mt-2">
            <ExclamationTriangleIcon className="h-6 w-6 text-danger-500 mx-auto" />
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Financiero</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ingresos Totales</span>
              <span className="text-lg font-semibold text-success-600">
                {formatCurrency(complianceStats.totalIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gastos Totales</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(complianceStats.totalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-gray-600 font-medium">Utilidad Bruta</span>
              <span className="text-xl font-bold text-primary-600">
                {formatCurrency(complianceStats.totalIncome - complianceStats.totalExpenses)}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Cumplimiento</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Facturación Electrónica</span>
              <span className="bg-success-100 text-success-800 text-xs px-2 py-1 rounded-full">
                Cumpliendo
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Declaraciones Mensuales</span>
              <span className="bg-warning-100 text-warning-800 text-xs px-2 py-1 rounded-full">
                Pendiente
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Libro de Ingresos y Gastos</span>
              <span className="bg-success-100 text-success-800 text-xs px-2 py-1 rounded-full">
                Actualizado
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Complemento de Pago</span>
              <span className="bg-danger-100 text-danger-800 text-xs px-2 py-1 rounded-full">
                Requiere Atención
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas de Cumplimiento</h3>
        <div className="space-y-3">
          {[
            {
              type: 'error',
              title: 'Facturas sin complemento de pago',
              description: '3 facturas detectadas que requieren complemento de pago',
              action: 'Revisar facturas',
            },
            {
              type: 'warning',
              title: 'Declaración mensual próxima a vencer',
              description: 'La declaración de noviembre vence en 3 días',
              action: 'Preparar declaración',
            },
            {
              type: 'info',
              title: 'Nuevos requisitos SAT',
              description: 'Actualización en los requisitos de facturación',
              action: 'Ver detalles',
            },
          ].map((alert, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50">
              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                alert.type === 'error' ? 'bg-danger-500' :
                alert.type === 'warning' ? 'bg-warning-500' :
                'bg-primary-500'
              }`} />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{alert.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
              </div>
              <button className="btn-secondary text-sm px-3 py-1">
                {alert.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCFDI = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Validación de CFDI</h3>
        <div className="flex items-center space-x-3">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Todos los CFDI</option>
            <option>Emitidos</option>
            <option>Recibidos</option>
          </select>
          <button className="btn-primary">Validar Nuevos CFDI</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockCFDIs.map((cfdi) => (
          <div key={cfdi.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getStatusIcon(cfdi.status)}
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">
                      {cfdi.type === 'issued' ? 'Emitido' : 'Recibido'}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(cfdi.status)}`}>
                      {cfdi.status === 'valid' ? 'Válido' :
                       cfdi.status === 'invalid' ? 'Inválido' :
                       'Cancelado'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>UUID: {cfdi.uuid}</div>
                    <div>RFC: {cfdi.rfc}</div>
                    <div>Concepto: {cfdi.concept}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(cfdi.total)}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(cfdi.issueDate).toLocaleDateString('es-MX')}
                </div>
                <div className="text-xs text-gray-500">
                  IVA: {formatCurrency(cfdi.taxAmount)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderObligations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Obligaciones Fiscales</h3>
        <select 
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="current">Período Actual</option>
          <option value="next">Próximo Período</option>
          <option value="all">Todas</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockFiscalObligations.map((obligation) => (
          <div key={obligation.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{obligation.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(obligation.status)}`}>
                    {obligation.status === 'pending' ? 'Pendiente' :
                     obligation.status === 'completed' ? 'Completada' :
                     'Vencida'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    obligation.priority === 'high' ? 'bg-danger-100 text-danger-800' :
                    obligation.priority === 'medium' ? 'bg-warning-100 text-warning-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    Prioridad {obligation.priority === 'high' ? 'Alta' :
                              obligation.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{obligation.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>
                    Vence: {new Date(obligation.dueDate).toLocaleDateString('es-MX')}
                  </span>
                  {obligation.amount && (
                    <span>Monto: {formatCurrency(obligation.amount)}</span>
                  )}
                  <span>Tipo: {obligation.type}</span>
                </div>
              </div>
              
              {obligation.status === 'pending' && (
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary text-sm px-3 py-1">
                    Ver Detalles
                  </button>
                  <button className="btn-primary text-sm px-3 py-1">
                    Procesar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Reportes de Cumplimiento</h3>
        <button className="btn-primary">
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Generar Reporte Personalizado
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          {
            title: 'Declaración Mensual ISR',
            description: 'Reporte para declaración mensual del Impuesto Sobre la Renta',
            period: 'Noviembre 2024',
            status: 'ready',
          },
          {
            title: 'Declaración Informativa DIOT',
            description: 'Declaración Informativa de Operaciones con Terceros',
            period: 'Noviembre 2024',
            status: 'ready',
          },
          {
            title: 'Libro de Ingresos y Gastos',
            description: 'Registro detallado de ingresos y gastos del período',
            period: 'Noviembre 2024',
            status: 'processing',
          },
          {
            title: 'Balanza de Comprobación',
            description: 'Balanza de comprobación para el período fiscal',
            period: 'Noviembre 2024',
            status: 'ready',
          },
        ].map((report, index) => (
          <div key={index} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{report.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Período: {report.period}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'ready' ? 'bg-success-100 text-success-800' :
                    'bg-warning-100 text-warning-800'
                  }`}>
                    {report.status === 'ready' ? 'Listo' : 'Procesando'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button className="btn-primary text-sm px-3 py-1" disabled={report.status !== 'ready'}>
                  Descargar
                </button>
                <button className="btn-secondary text-sm px-3 py-1">
                  Vista Previa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'cfdi':
        return renderCFDI();
      case 'obligations':
        return renderObligations();
      case 'reports':
        return renderReports();
      default:
        return renderOverview();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-smartax-display font-bold text-smartax-blue-prussia">Cumplimiento Fiscal</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-smartax-text font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-smartax-copper text-smartax-copper'
                    : 'border-transparent text-smartax-blue-graphite/70 hover:text-smartax-blue-graphite hover:border-smartax-copper/30'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
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