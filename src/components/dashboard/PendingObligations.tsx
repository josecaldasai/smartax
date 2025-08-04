'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClockIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  FunnelIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  PlayIcon,
  BanknotesIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { mockFiscalObligations } from '@/lib/mockData';

type FilterType = 'all' | 'pending' | 'overdue' | 'high-priority';
type SortType = 'dueDate' | 'priority' | 'amount';

export default function PendingObligations() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('dueDate');
  const [showFilters, setShowFilters] = useState(false);
  const [processingObligation, setProcessingObligation] = useState<string | null>(null);
  const [progressSteps, setProgressSteps] = useState<{ [key: string]: number }>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return ClockIcon;
      case 'completed':
        return CheckCircleIcon;
      case 'overdue':
        return ExclamationTriangleIcon;
      default:
        return ClockIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'completed':
        return 'text-success-600 bg-success-50 border-success-200';
      case 'overdue':
        return 'text-danger-600 bg-danger-50 border-danger-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-danger-500 bg-danger-50';
      case 'medium':
        return 'border-l-warning-500 bg-warning-50';
      case 'low':
        return 'border-l-primary-500 bg-primary-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getFilteredObligations = () => {
    let filtered = mockFiscalObligations;

    switch (filter) {
      case 'pending':
        filtered = filtered.filter(o => o.status === 'pending');
        break;
      case 'overdue':
        filtered = filtered.filter(o => o.status === 'overdue');
        break;
      case 'high-priority':
        filtered = filtered.filter(o => o.priority === 'high');
        break;
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
        case 'amount':
          return (b.amount || 0) - (a.amount || 0);
        default:
          return 0;
      }
    });
  };

  const handleProcessObligation = (obligationId: string) => {
    setProcessingObligation(obligationId);
    setProgressSteps(prev => ({ ...prev, [obligationId]: 0 }));

    // Simulate processing steps
    const steps = [
      'Validando documentos...',
      'Calculando impuestos...',
      'Generando formato...',
      'Procesando pago...',
      'Completado'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setProgressSteps(prev => ({ ...prev, [obligationId]: index + 1 }));
        if (index === steps.length - 1) {
          setTimeout(() => {
            setProcessingObligation(null);
            alert('Obligación procesada exitosamente');
          }, 1000);
        }
      }, (index + 1) * 1000);
    });
  };

  const filteredObligations = getFilteredObligations();

  const stats = {
    total: mockFiscalObligations.length,
    pending: mockFiscalObligations.filter(o => o.status === 'pending').length,
    overdue: mockFiscalObligations.filter(o => o.status === 'overdue').length,
    totalAmount: mockFiscalObligations
      .filter(o => o.status === 'pending' && o.amount)
      .reduce((sum, o) => sum + (o.amount || 0), 0),
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Obligaciones Fiscales</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {filteredObligations.length} de {stats.total}
          </span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FunnelIcon className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Total</span>
          </div>
          <div className="text-lg font-bold text-blue-900">{stats.total}</div>
        </div>
        
        <div className="p-3 bg-warning-50 rounded-lg border border-warning-200">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-4 w-4 text-warning-600" />
            <span className="text-xs text-warning-600 font-medium">Pendientes</span>
          </div>
          <div className="text-lg font-bold text-warning-900">{stats.pending}</div>
        </div>
        
        <div className="p-3 bg-danger-50 rounded-lg border border-danger-200">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-danger-600" />
            <span className="text-xs text-danger-600 font-medium">Vencidas</span>
          </div>
          <div className="text-lg font-bold text-danger-900">{stats.overdue}</div>
        </div>
        
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Monto</span>
          </div>
          <div className="text-sm font-bold text-green-900">{formatCurrency(stats.totalAmount)}</div>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por estado
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Todas</option>
                  <option value="pending">Pendientes</option>
                  <option value="overdue">Vencidas</option>
                  <option value="high-priority">Alta prioridad</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="dueDate">Fecha de vencimiento</option>
                  <option value="priority">Prioridad</option>
                  <option value="amount">Monto</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Obligations List */}
      <div className="space-y-4">
        {filteredObligations.map((obligation, index) => {
          const StatusIcon = getStatusIcon(obligation.status);
          const daysUntilDue = getDaysUntilDue(obligation.dueDate);
          const isProcessing = processingObligation === obligation.id;
          const currentStep = progressSteps[obligation.id] || 0;
          
          return (
            <motion.div
              key={obligation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 bg-white border border-gray-200 hover:shadow-soft transition-all ${getPriorityColor(obligation.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <StatusIcon className="h-5 w-5 text-gray-500" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      {obligation.title}
                    </h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(obligation.status)}`}>
                      {obligation.status === 'pending' ? 'Pendiente' :
                       obligation.status === 'completed' ? 'Completada' : 'Vencida'}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      obligation.priority === 'high' ? 'bg-danger-100 text-danger-800' :
                      obligation.priority === 'medium' ? 'bg-warning-100 text-warning-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {obligation.priority === 'high' ? 'Alta' :
                       obligation.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {obligation.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <CalendarDaysIcon className="h-4 w-4" />
                        <span>Vence: {format(new Date(obligation.dueDate), 'dd MMM yyyy', { locale: es })}</span>
                      </div>
                      {obligation.amount && (
                        <div className="flex items-center space-x-1">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          <span>{formatCurrency(obligation.amount)}</span>
                        </div>
                      )}
                      <span className="text-xs">{obligation.type}</span>
                    </div>
                    
                    {obligation.status === 'pending' && (
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        daysUntilDue <= 3 ? 'bg-danger-100 text-danger-800' : 
                        daysUntilDue <= 7 ? 'bg-warning-100 text-warning-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {daysUntilDue > 0 ? `${daysUntilDue} días` : 'Vencida'}
                      </div>
                    )}
                  </div>

                  {/* Processing Progress */}
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                        <span className="text-sm font-medium text-primary-900">
                          Procesando obligación...
                        </span>
                      </div>
                      <div className="w-full bg-primary-200 rounded-full h-2">
                        <motion.div
                          className="bg-primary-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentStep / 5) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="text-xs text-primary-700 mt-1">
                        Paso {currentStep} de 5
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {obligation.status === 'pending' && !isProcessing && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="btn-secondary text-xs px-3 py-2 flex items-center space-x-1">
                      <EyeIcon className="h-3 w-3" />
                      <span>Ver</span>
                    </button>
                    <button 
                      onClick={() => handleProcessObligation(obligation.id)}
                      className="btn-primary text-xs px-3 py-2 flex items-center space-x-1"
                    >
                      <PlayIcon className="h-3 w-3" />
                      <span>Procesar</span>
                    </button>
                    {obligation.amount && (
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <BanknotesIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredObligations.length === 0 && (
        <div className="text-center py-8">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No hay obligaciones' : 'No hay obligaciones que coincidan con el filtro'}
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'Todas las obligaciones fiscales están al día.' 
              : 'Prueba cambiando los filtros para ver otras obligaciones.'}
          </p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button className="btn-secondary flex items-center space-x-2">
            <DocumentTextIcon className="h-4 w-4" />
            <span>Ver Calendario Completo</span>
          </button>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary text-sm">
              Exportar Lista
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <BanknotesIcon className="h-4 w-4" />
              <span>Procesar Pagos Masivos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 