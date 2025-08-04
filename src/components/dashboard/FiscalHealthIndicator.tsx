'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { mockFiscalHealth } from '@/lib/mockData';

export default function FiscalHealthIndicator() {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);
  
  const { overall, score, factors, recommendations } = mockFiscalHealth;

  const getHealthColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-success-600';
      case 'medium':
        return 'text-warning-600';
      case 'low':
        return 'text-danger-600';
      default:
        return 'text-gray-600';
    }
  };

  const getHealthBgColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-success-50 border-success-200';
      case 'medium':
        return 'bg-warning-50 border-warning-200';
      case 'low':
        return 'bg-danger-50 border-danger-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getHealthLabel = (level: string) => {
    switch (level) {
      case 'high':
        return 'Excelente';
      case 'medium':
        return 'Buena';
      case 'low':
        return 'Requiere Atención';
      default:
        return 'Sin Evaluar';
    }
  };

  const chartData = [
    { name: 'Score', value: score, color: '#22c55e' },
    { name: 'Remaining', value: 100 - score, color: '#e5e7eb' },
  ];

  const factorsData = [
    { name: 'Cumplimiento', value: factors.compliance, color: '#0ea5e9', description: 'Nivel de cumplimiento con obligaciones fiscales' },
    { name: 'Documentación', value: factors.documentation, color: '#8b5cf6', description: 'Organización y completitud de documentos' },
    { name: 'Declaraciones', value: factors.declarations, color: '#f59e0b', description: 'Puntualidad en presentación de declaraciones' },
    { name: 'Deducciones', value: factors.deductions, color: '#ef4444', description: 'Aprovechamiento de deducciones fiscales' },
  ];

  const monthlyTrend = [
    { month: 'Jul', score: 78 },
    { month: 'Ago', score: 82 },
    { month: 'Sep', score: 80 },
    { month: 'Oct', score: 83 },
    { month: 'Nov', score: 85 },
  ];

  const riskAreas = [
    {
      area: 'Complementos de Pago',
      risk: 'Alto',
      description: '3 facturas sin complemento de pago detectadas',
      action: 'Generar complementos',
      color: 'danger'
    },
    {
      area: 'Retenciones ISR',
      risk: 'Medio',
      description: 'Verificar cálculo de retenciones del mes',
      action: 'Revisar cálculos',
      color: 'warning'
    },
    {
      area: 'Clasificación de Gastos',
      risk: 'Bajo',
      description: 'Algunos gastos requieren mejor clasificación',
      action: 'Optimizar clasificación',
      color: 'primary'
    }
  ];

  const handleRecommendationClick = (recommendation: string) => {
    // Simulate navigation or action
    alert(`Implementando recomendación: ${recommendation}`);
  };

  const handleFactorClick = (factorName: string) => {
    setSelectedFactor(selectedFactor === factorName ? null : factorName);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Salud Fiscal</h3>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getHealthBgColor(overall)} ${getHealthColor(overall)}`}>
            {getHealthLabel(overall)}
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showDetails ? (
              <ChevronUpIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Main Score */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{score}%</div>
              <div className="text-xs text-gray-500">General</div>
            </div>
          </div>
        </div>
      </div>

      {/* Factors Breakdown */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-gray-900">Factores de Evaluación</h4>
        {factorsData.map((factor, index) => (
          <motion.div
            key={factor.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <button
              onClick={() => handleFactorClick(factor.name)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{factor.name}</span>
                <span className="text-sm font-medium text-gray-900">{factor.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.value}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-2 rounded-full"
                  style={{ backgroundColor: factor.color }}
                />
              </div>
            </button>
            
            <AnimatePresence>
              {selectedFactor === factor.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {factor.value < 70 ? 'Necesita mejora' : 
                       factor.value < 85 ? 'Buen nivel' : 'Excelente'}
                    </span>
                    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                      Ver detalles
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Monthly Trend */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Tendencia Mensual</h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="score" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Areas */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Áreas de Riesgo</h4>
              <div className="space-y-3">
                {riskAreas.map((risk, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200"
                  >
                    <div className="flex items-start space-x-3">
                      {risk.color === 'danger' && <ExclamationTriangleIcon className="h-5 w-5 text-danger-500 mt-0.5" />}
                      {risk.color === 'warning' && <ExclamationTriangleIcon className="h-5 w-5 text-warning-500 mt-0.5" />}
                      {risk.color === 'primary' && <CheckCircleIcon className="h-5 w-5 text-primary-500 mt-0.5" />}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="text-sm font-medium text-gray-900">{risk.area}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            risk.color === 'danger' ? 'bg-danger-100 text-danger-800' :
                            risk.color === 'warning' ? 'bg-warning-100 text-warning-800' :
                            'bg-primary-100 text-primary-800'
                          }`}>
                            Riesgo {risk.risk}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{risk.description}</p>
                      </div>
                    </div>
                    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1">
                      <span>{risk.action}</span>
                      <ArrowRightIcon className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendations */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <LightBulbIcon className="h-4 w-4 mr-2 text-warning-500" />
          Recomendaciones
        </h4>
        <div className="space-y-3">
          {recommendations.slice(0, 3).map((recommendation, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              onClick={() => handleRecommendationClick(recommendation)}
              className="w-full text-left flex items-start space-x-3 p-3 rounded-lg bg-primary-50 border border-primary-100 hover:bg-primary-100 transition-colors"
            >
              <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2" />
              <p className="text-sm text-gray-700 leading-relaxed flex-1">{recommendation}</p>
              <ArrowRightIcon className="h-4 w-4 text-primary-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
        <button className="btn-primary w-full">
          Ver Análisis Completo
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-secondary text-sm">
            Exportar Reporte
          </button>
          <button className="btn-secondary text-sm">
            Programar Revisión
          </button>
        </div>
      </div>
    </div>
  );
} 