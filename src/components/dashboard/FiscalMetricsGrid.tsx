'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  FunnelIcon,
  CalendarIcon,
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CalculatorIcon,
  BanknotesIcon,
  ReceiptRefundIcon,
} from '@heroicons/react/24/outline';

interface FiscalFilter {
  timeRange: 'month' | 'year' | 'quarter' | 'custom';
  startDate?: string;
  endDate?: string;
  selectedMonth?: string;
  selectedYear?: string;
  selectedQuarter?: string;
  taxTypes: string[];
  categories: string[];
  rfcFilter: string;
  amountRange: {
    min: string;
    max: string;
  };
}

interface MetricData {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
  category: string;
  taxType: string;
}

export default function FiscalMetricsGrid() {
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);
  const [filters, setFilters] = useState<FiscalFilter>({
    timeRange: 'month',
    selectedMonth: new Date().toISOString().slice(0, 7), // YYYY-MM format
    selectedYear: new Date().getFullYear().toString(),
    selectedQuarter: 'Q' + Math.ceil((new Date().getMonth() + 1) / 3),
    taxTypes: [],
    categories: [],
    rfcFilter: '',
    amountRange: {
      min: '',
      max: ''
    }
  });

  const [filteredMetrics, setFilteredMetrics] = useState<MetricData[]>([]);

  // Mock data generator based on filters
  const generateMetricsData = (appliedFilters: FiscalFilter): MetricData[] => {
    const baseMetrics = [
      {
        id: 'total-revenue',
        name: 'Ingresos Totales',
        value: 2847650,
        previousValue: 2543210,
        change: 12.0,
        changeType: 'increase' as const,
        icon: 'BanknotesIcon',
        color: 'success',
        category: 'ingresos',
        taxType: 'iva'
      },
      {
        id: 'isr-paid',
        name: 'ISR Pagado',
        value: 342850,
        previousValue: 298430,
        change: 14.9,
        changeType: 'increase' as const,
        icon: 'CalculatorIcon',
        color: 'primary',
        category: 'impuestos',
        taxType: 'isr'
      },
      {
        id: 'iva-collected',
        name: 'IVA Recaudado',
        value: 455624,
        previousValue: 407313,
        change: 11.9,
        changeType: 'increase' as const,
        icon: 'ReceiptRefundIcon',
        color: 'warning',
        category: 'impuestos',
        taxType: 'iva'
      },
      {
        id: 'deductions',
        name: 'Deducciones',
        value: 185420,
        previousValue: 203450,
        change: -8.9,
        changeType: 'decrease' as const,
        icon: 'DocumentTextIcon',
        color: 'danger',
        category: 'deducciones',
        taxType: 'isr'
      },
      {
        id: 'ieps-paid',
        name: 'IEPS Pagado',
        value: 45250,
        previousValue: 39800,
        change: 13.7,
        changeType: 'increase' as const,
        icon: 'BanknotesIcon',
        color: 'primary',
        category: 'impuestos',
        taxType: 'ieps'
      },
      {
        id: 'retained-taxes',
        name: 'Retenciones',
        value: 89340,
        previousValue: 95200,
        change: -6.2,
        changeType: 'decrease' as const,
        icon: 'CalculatorIcon',
        color: 'warning',
        category: 'retenciones',
        taxType: 'isr'
      }
    ];

    // Apply filters
    let filtered = baseMetrics;

    // Filter by tax types
    if (appliedFilters.taxTypes.length > 0) {
      filtered = filtered.filter(metric => 
        appliedFilters.taxTypes.includes(metric.taxType)
      );
    }

    // Filter by categories
    if (appliedFilters.categories.length > 0) {
      filtered = filtered.filter(metric => 
        appliedFilters.categories.includes(metric.category)
      );
    }

    // Apply time range adjustments (simulate different values for different periods)
    const timeMultipliers = {
      month: 1,
      quarter: 3.2,
      year: 12.5,
      custom: 1.8
    };

    const multiplier = timeMultipliers[appliedFilters.timeRange];

    return filtered.map(metric => ({
      ...metric,
      value: Math.round(metric.value * multiplier),
      previousValue: Math.round(metric.previousValue * multiplier)
    }));
  };

  useEffect(() => {
    const metrics = generateMetricsData(filters);
    setFilteredMetrics(metrics);

    // Count applied filters
    let count = 0;
    if (filters.taxTypes.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.rfcFilter) count++;
    if (filters.amountRange.min || filters.amountRange.max) count++;
    if (filters.timeRange === 'custom' && filters.startDate && filters.endDate) count++;

    setAppliedFiltersCount(count);
  }, [filters]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === 'increase' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  };

  const getChangeColor = (changeType: string) => {
    return changeType === 'increase' ? 'text-emerald-600' : 'text-rose-600';
  };

  const getMetricColor = (color: string) => {
    const colors = {
      success: 'bg-gradient-smartax-warm border-smartax-copper/30 shadow-sm',
      primary: 'bg-gradient-smartax-primary border-smartax-blue-graphite/30 shadow-sm',
      warning: 'bg-gradient-smartax-accent border-smartax-terracotta/30 shadow-sm',
      danger: 'bg-gradient-to-br from-smartax-copper/20 via-smartax-terracotta/20 to-smartax-copper/20 border-smartax-copper/30 shadow-sm',
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  const getIconColor = (color: string) => {
    const colors = {
      success: 'text-smartax-copper',
      primary: 'text-smartax-blue-prussia',
      warning: 'text-smartax-terracotta',
      danger: 'text-smartax-copper',
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  const getAccentColor = (color: string) => {
    const colors = {
      success: 'bg-smartax-copper',
      primary: 'bg-smartax-blue-prussia',
      warning: 'bg-smartax-terracotta',
      danger: 'bg-smartax-copper',
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  const renderIcon = (iconName: string, className: string) => {
    const icons = {
      BanknotesIcon: <BanknotesIcon className={className} />,
      CalculatorIcon: <CalculatorIcon className={className} />,
      DocumentTextIcon: <DocumentTextIcon className={className} />,
      ReceiptRefundIcon: <ReceiptRefundIcon className={className} />
    };
    return icons[iconName as keyof typeof icons] || <BanknotesIcon className={className} />;
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayFilterChange = (key: 'taxTypes' | 'categories', value: string) => {
    setFilters(prev => {
      const currentArray = prev[key];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [key]: newArray
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      timeRange: 'month',
      selectedMonth: new Date().toISOString().slice(0, 7),
      selectedYear: new Date().getFullYear().toString(),
      selectedQuarter: 'Q' + Math.ceil((new Date().getMonth() + 1) / 3),
      taxTypes: [],
      categories: [],
      rfcFilter: '',
      amountRange: {
        min: '',
        max: ''
      }
    });
  };

  const getPeriodText = () => {
    switch (filters.timeRange) {
      case 'month':
        return filters.selectedMonth ? new Date(filters.selectedMonth + '-01').toLocaleDateString('es-MX', { year: 'numeric', month: 'long' }) : 'Mes actual';
      case 'year':
        return `Año ${filters.selectedYear}`;
      case 'quarter':
        return `${filters.selectedQuarter} ${filters.selectedYear}`;
      case 'custom':
        return filters.startDate && filters.endDate ? 
          `${new Date(filters.startDate).toLocaleDateString('es-MX')} - ${new Date(filters.endDate).toLocaleDateString('es-MX')}` : 
          'Período personalizado';
      default:
        return 'Período actual';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{getPeriodText()}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {appliedFiltersCount > 0 && (
            <span className="px-3 py-1 text-xs font-smartax-secondary font-medium bg-smartax-copper/20 text-smartax-copper rounded-full">
              {appliedFiltersCount} filtro{appliedFiltersCount !== 1 ? 's' : ''} aplicado{appliedFiltersCount !== 1 ? 's' : ''}
            </span>
          )}
          
                      <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-smartax-copper/10 border-smartax-copper/30' : ''}`}
            >
            <FunnelIcon className="h-4 w-4" />
            <span>Filtros</span>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card bg-gray-50"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              
              {/* Time Range Filters */}
              <div className="space-y-4">
                <h4 className="font-smartax-text font-medium text-smartax-blue-prussia flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Período de Tiempo
                </h4>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'month', label: 'Mensual' },
                      { value: 'quarter', label: 'Trimestral' },
                      { value: 'year', label: 'Anual' },
                      { value: 'custom', label: 'Personalizado' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange('timeRange', option.value)}
                        className={`p-2 text-sm font-smartax-secondary rounded-lg border transition-colors ${
                          filters.timeRange === option.value
                            ? 'bg-smartax-copper text-smartax-ivory border-smartax-copper'
                            : 'bg-smartax-ivory text-smartax-blue-graphite border-smartax-blue-graphite/30 hover:border-smartax-copper/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic time selectors */}
                  {filters.timeRange === 'month' && (
                    <input
                      type="month"
                      value={filters.selectedMonth}
                      onChange={(e) => handleFilterChange('selectedMonth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  )}

                  {filters.timeRange === 'year' && (
                    <select
                      value={filters.selectedYear}
                      onChange={(e) => handleFilterChange('selectedYear', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  )}

                  {filters.timeRange === 'quarter' && (
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={filters.selectedQuarter}
                        onChange={(e) => handleFilterChange('selectedQuarter', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                      </select>
                      <select
                        value={filters.selectedYear}
                        onChange={(e) => handleFilterChange('selectedYear', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {filters.timeRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Fecha inicio</label>
                        <input
                          type="date"
                          value={filters.startDate || ''}
                          onChange={(e) => handleFilterChange('startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Fecha fin</label>
                        <input
                          type="date"
                          value={filters.endDate || ''}
                          onChange={(e) => handleFilterChange('endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tax Types and Categories */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Tipos de Impuesto</h4>
                <div className="space-y-2">
                  {[
                    { value: 'isr', label: 'ISR', color: 'bg-smartax-blue-graphite/20 text-smartax-blue-graphite' },
                    { value: 'iva', label: 'IVA', color: 'bg-smartax-copper/20 text-smartax-copper' },
                    { value: 'ieps', label: 'IEPS', color: 'bg-smartax-terracotta/20 text-smartax-terracotta' }
                  ].map((tax) => (
                    <label key={tax.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.taxTypes.includes(tax.value)}
                        onChange={() => handleArrayFilterChange('taxTypes', tax.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${tax.color}`}>
                        {tax.label}
                      </span>
                    </label>
                  ))}
                </div>

                <h4 className="font-medium text-gray-900 mt-4">Categorías</h4>
                <div className="space-y-2">
                  {[
                    { value: 'ingresos', label: '💰 Ingresos' },
                    { value: 'impuestos', label: '📊 Impuestos' },
                    { value: 'deducciones', label: '📝 Deducciones' },
                    { value: 'retenciones', label: '🔒 Retenciones' }
                  ].map((category) => (
                    <label key={category.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category.value)}
                        onChange={() => handleArrayFilterChange('categories', category.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Filtros Adicionales
                </h4>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">RFC Específico</label>
                  <input
                    type="text"
                    value={filters.rfcFilter}
                    onChange={(e) => handleFilterChange('rfcFilter', e.target.value)}
                    placeholder="XAXX010101000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Rango de Montos</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={filters.amountRange.min}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        amountRange: { ...prev.amountRange, min: e.target.value }
                      }))}
                      placeholder="Mínimo"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      value={filters.amountRange.max}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        amountRange: { ...prev.amountRange, max: e.target.value }
                      }))}
                      placeholder="Máximo"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <button
                  onClick={clearAllFilters}
                  className="w-full btn-secondary flex items-center justify-center space-x-2 text-sm"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Limpiar Filtros</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Statistics Panel */}
      {filteredMetrics.length > 0 && (
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Total Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-smartax-primary rounded-2xl p-8 text-smartax-ivory relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <pattern id="summary-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                    <circle cx="10" cy="10" r="1" fill="currentColor" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#summary-pattern)" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-smartax-display font-bold mb-2">Resumen Fiscal</h3>
                    <p className="text-smartax-ivory/70 font-smartax-secondary">{getPeriodText()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-smartax-ivory/70 font-smartax-secondary mb-1">Total General</p>
                    <p className="text-3xl font-smartax-display font-black">
                      {formatCurrency(filteredMetrics.reduce((sum, m) => sum + m.value, 0))}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {['ingresos', 'impuestos', 'deducciones', 'retenciones'].map((category, index) => {
                    const categoryMetrics = filteredMetrics.filter(m => m.category === category);
                    const categoryTotal = categoryMetrics.reduce((sum, m) => sum + m.value, 0);
                    const categoryIcon = {
                      'ingresos': '💰',
                      'impuestos': '📊',
                      'deducciones': '📝',
                      'retenciones': '🔒'
                    }[category] || '📈';
                    
                    return (
                      <div key={category} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{categoryIcon}</span>
                          <div>
                            <h4 className="font-semibold capitalize">{category}</h4>
                            <p className="text-sm text-gray-300">{categoryMetrics.length} métricas</p>
                          </div>
                        </div>
                        <p className="text-xl font-bold">{formatCurrency(categoryTotal)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Floating Glow Effects */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Metrics Grid with Integrated Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="wait">
          {filteredMetrics.map((metric, index) => {
            const ChangeIcon = getChangeIcon(metric.changeType);
            const progressPercentage = ((metric.value - metric.previousValue) / metric.previousValue) * 100;
            const normalizedProgress = Math.min(Math.abs(progressPercentage), 100);
            
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className="relative group"
              >
                {/* Modern Card Container */}
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 h-full shadow-sm hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden">
                  
                  {/* Animated Background Gradient */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    metric.color === 'success' ? 'bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-green-50/80' :
                    metric.color === 'primary' ? 'bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-sky-50/80' :
                    metric.color === 'warning' ? 'bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-yellow-50/80' :
                    'bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-red-50/80'
                  }`}></div>

                  {/* Floating Particles Effect */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-1000 ${
                          metric.color === 'success' ? 'bg-emerald-400' :
                          metric.color === 'primary' ? 'bg-blue-400' :
                          metric.color === 'warning' ? 'bg-amber-400' :
                          'bg-rose-400'
                        }`}
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${10 + i * 12}%`,
                          animationDelay: `${i * 200}ms`,
                          animation: 'float 3s ease-in-out infinite'
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10">
                    {/* Header with Icon and Change */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 rounded-xl shadow-lg ring-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                        metric.color === 'success' ? 'bg-gradient-to-br from-emerald-500 to-teal-600 ring-emerald-100' :
                        metric.color === 'primary' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 ring-blue-100' :
                        metric.color === 'warning' ? 'bg-gradient-to-br from-amber-500 to-orange-600 ring-amber-100' :
                        'bg-gradient-to-br from-rose-500 to-pink-600 ring-rose-100'
                      }`}>
                        {renderIcon(metric.icon, "h-6 w-6 text-white drop-shadow-sm")}
                      </div>
                      
                      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm transition-all duration-300 group-hover:scale-105 ${
                        metric.changeType === 'increase' 
                          ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200' 
                          : 'bg-gradient-to-r from-rose-100 to-red-100 text-rose-700 border border-rose-200'
                      }`}>
                        <ChangeIcon className="h-4 w-4" />
                        <span>{Math.abs(metric.change)}%</span>
                      </div>
                    </div>

                    {/* Metric Title and Value */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-600 mb-3 tracking-wide uppercase">
                        {metric.name}
                      </h3>
                      <p className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                        {formatCurrency(metric.value)}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {getPeriodText()}
                      </p>
                    </div>

                    {/* Mini Sparkline Chart */}
                    <div className="mb-6">
                      <div className="h-16 relative">
                        <svg className="w-full h-full" viewBox="0 0 200 60">
                          <defs>
                            <linearGradient id={`sparkline-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={
                                metric.color === 'success' ? '#10b981' :
                                metric.color === 'primary' ? '#3b82f6' :
                                metric.color === 'warning' ? '#f59e0b' :
                                '#ef4444'
                              } stopOpacity="0.3"/>
                              <stop offset="100%" stopColor={
                                metric.color === 'success' ? '#10b981' :
                                metric.color === 'primary' ? '#3b82f6' :
                                metric.color === 'warning' ? '#f59e0b' :
                                '#ef4444'
                              } stopOpacity="0.05"/>
                            </linearGradient>
                          </defs>
                          
                          {/* Generate sparkline points */}
                          {(() => {
                            const points = Array.from({ length: 12 }, (_, i) => {
                              const x = (i / 11) * 180 + 10;
                              const baseY = 30;
                              const variation = Math.sin(i * 0.5 + index) * 15 + Math.cos(i * 0.3) * 8;
                              const y = Math.max(5, Math.min(55, baseY + variation));
                              return `${x},${y}`;
                            });
                            
                            const pathData = `M ${points.join(' L ')}`;
                            const areaData = `${pathData} L 190,55 L 10,55 Z`;
                            
                            return (
                              <g className="transition-all duration-1000 group-hover:scale-105">
                                {/* Area fill */}
                                <path
                                  d={areaData}
                                  fill={`url(#sparkline-${metric.id})`}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                />
                                
                                {/* Line */}
                                <path
                                  d={pathData}
                                  fill="none"
                                  stroke={
                                    metric.color === 'success' ? '#10b981' :
                                    metric.color === 'primary' ? '#3b82f6' :
                                    metric.color === 'warning' ? '#f59e0b' :
                                    '#ef4444'
                                  }
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="drop-shadow-sm"
                                />
                                
                                {/* Data points */}
                                {points.map((point, i) => {
                                  const [x, y] = point.split(',').map(Number);
                                  return (
                                    <circle
                                      key={i}
                                      cx={x}
                                      cy={y}
                                      r="3"
                                      fill="white"
                                      stroke={
                                        metric.color === 'success' ? '#10b981' :
                                        metric.color === 'primary' ? '#3b82f6' :
                                        metric.color === 'warning' ? '#f59e0b' :
                                        '#ef4444'
                                      }
                                      strokeWidth="2"
                                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:r-4"
                                      style={{ transitionDelay: `${i * 50}ms` }}
                                    />
                                  );
                                })}
                              </g>
                            );
                          })()}
                        </svg>
                      </div>
                    </div>

                    {/* Comparison with Previous Period */}
                    <div className="mb-6 p-4 rounded-xl bg-gray-50/50 border border-gray-100/50">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                        <span className="font-medium">Comparación Período Anterior</span>
                        <span className="font-semibold">{formatCurrency(metric.previousValue)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 delay-${index * 100} ${
                              metric.changeType === 'increase' 
                                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                                : 'bg-gradient-to-r from-rose-400 to-rose-500'
                            }`}
                            style={{ width: `${normalizedProgress}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-bold ${getChangeColor(metric.changeType)}`}>
                          {metric.changeType === 'increase' ? '+' : ''}{metric.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          metric.changeType === 'increase' ? 'bg-emerald-500' : 'bg-rose-500'
                        } animate-pulse`}></div>
                        <span className="text-xs font-medium text-gray-600">
                          {metric.changeType === 'increase' ? 'Creciendo' : 'Decreciendo'}
                        </span>
                      </div>
                      
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        normalizedProgress > 15 
                          ? metric.changeType === 'increase' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-rose-100 text-rose-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {normalizedProgress > 15 ? 'Alto impacto' : 'Estable'}
                      </div>
                    </div>
                  </div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* No results message */}
      {filteredMetrics.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <DocumentTextIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay métricas disponibles</h3>
          <p className="text-gray-600 mb-4">Ajusta los filtros para ver métricas fiscales</p>
          <button
            onClick={clearAllFilters}
            className="btn-primary"
          >
            Limpiar Filtros
          </button>
        </motion.div>
      )}
    </div>
  );
} 