'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { mockFiscalScenarios, mockDeductionOpportunities, mockBenchmarkData } from '@/lib/mockData';

interface AIInsights {
  riskAssessment: {
    level: string;
    factors: string[];
  };
  optimizations: Array<{
    id: string;
    name: string;
    description: string;
    impact: string;
    complexity: string;
    requirements: string[];
    estimatedSaving: number;
    applicability: number;
  }>;
  projections: {
    currentTax: number;
    optimizedTax: number;
    totalSavings: number;
    effectiveRate: number;
    paybackPeriod: number;
  };
  industryComparison: {
    position: string;
    percentile: number;
    recommendations: string[];
  };
  nextSteps: string[];
}

export default function OptimizationModule() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [selectedScenario, setSelectedScenario] = useState(null);

  // Estados del simulador fiscal IA
  const [simulatorMode, setSimulatorMode] = useState('builder');
  const [currentScenario, setCurrentScenario] = useState<any>({
    name: '',
    entityType: 'moral',
    regime: 'general',
    financialData: {
      income: '',
      expenses: '',
      deductions: '',
      assets: '',
      employees: '',
      industry: 'general'
    },
    optimizations: [],
    results: null
  });
  const [comparisonScenarios, setComparisonScenarios] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiSteps, setAiSteps] = useState<string[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const tabs = [
    { id: 'analysis', name: 'Análisis Fiscal', icon: ChartBarIcon },
    { id: 'scenarios', name: 'Simulador', icon: PlayIcon },
    { id: 'opportunities', name: 'Oportunidades', icon: LightBulbIcon },
    { id: 'benchmarks', name: 'Comparación', icon: ArrowTrendingUpIcon },
  ];

  const renderAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumen Fiscal */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estructura Fiscal Actual</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Régimen Fiscal</span>
              <span className="text-sm font-medium">General de Ley</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tasa ISR Efectiva</span>
              <span className="text-sm font-medium text-success-600">28.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Aprovechamiento Deducciones</span>
              <span className="text-sm font-medium text-warning-600">72%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Score Cumplimiento</span>
              <span className="text-sm font-medium text-success-600">85/100</span>
            </div>
          </div>
        </div>

        {/* Potencial de Ahorro */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Potencial de Ahorro</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">
              {formatCurrency(45000)}
            </div>
            <p className="text-sm text-gray-600 mb-4">Ahorro fiscal anual estimado</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-900">Deducciones</div>
                <div className="text-success-600">{formatCurrency(30000)}</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Optimización</div>
                <div className="text-success-600">{formatCurrency(15000)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones Principales */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones Prioritarias</h3>
        <div className="space-y-3">
          {[
            {
              title: 'Optimizar deducciones de capacitación',
              impact: 'Alto',
              saving: 15000,
              difficulty: 'Fácil',
            },
            {
              title: 'Implementar depreciación acelerada',
              impact: 'Medio',
              saving: 12000,
              difficulty: 'Medio',
            },
            {
              title: 'Revisar estructura de gastos deducibles',
              impact: 'Alto',
              saving: 18000,
              difficulty: 'Medio',
            },
          ].map((rec, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{rec.title}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    rec.impact === 'Alto' ? 'bg-success-100 text-success-800' :
                    rec.impact === 'Medio' ? 'bg-warning-100 text-warning-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    Impacto {rec.impact}
                  </span>
                  <span className="text-xs text-gray-500">Ahorro: {formatCurrency(rec.saving)}</span>
                </div>
              </div>
              <button className="btn-primary text-sm px-3 py-1">Aplicar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Algoritmos avanzados de IA para optimización fiscal
  const generateAdvancedAIInsights = async (scenarioData: any) => {
    setIsAnalyzing(true);
    setAiProgress(0);
    setAiSteps([]);
    
    const steps = [
      { text: '🧠 Inicializando motor de IA fiscal...', duration: 800 },
      { text: '📊 Analizando patrones históricos...', duration: 1200 },
      { text: '🔍 Identificando oportunidades de optimización...', duration: 1000 },
      { text: '⚖️ Evaluando riesgos regulatorios...', duration: 900 },
      { text: '📈 Calculando proyecciones tributarias...', duration: 1100 },
      { text: '🎯 Generando estrategias personalizadas...', duration: 800 },
      { text: '✨ Aplicando algoritmos de machine learning...', duration: 1000 },
      { text: '🎪 Finalizando análisis predictivo...', duration: 700 }
    ];

    for (let i = 0; i < steps.length; i++) {
      setAiSteps(prev => [...prev, steps[i].text]);
      setAiProgress((i + 1) / steps.length * 100);
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
    }

    const income = parseFloat(scenarioData.financialData.income) || 0;
    const expenses = parseFloat(scenarioData.financialData.expenses) || 0;
    const assets = parseFloat(scenarioData.financialData.assets) || 0;
    const employees = parseInt(scenarioData.financialData.employees) || 0;
    
    const taxableIncome = income - expenses;
    const currentTax = taxableIncome * 0.30;
    
    // Simulación avanzada de optimizaciones con IA
    const aiOptimizations = [
      {
        id: 'ai_deep_analysis',
        name: 'Análisis Profundo con IA',
        description: 'Optimización basada en 50,000+ casos similares analizados por IA',
        impact: 'revolucionario',
        confidence: 94.7,
        estimatedSaving: income * 0.18,
        implementation: 'automatizada',
        riskLevel: 'muy bajo',
        legalBasis: 'Art. 31 LISR, jurisprudencia 2024'
      },
      {
        id: 'predictive_deductions',
        name: 'Deducciones Predictivas',
        description: 'IA identifica deducciones no aprovechadas usando análisis predictivo',
        impact: 'alto',
        confidence: 89.2,
        estimatedSaving: income * 0.12,
        implementation: 'asistida',
        riskLevel: 'bajo',
        legalBasis: 'Art. 25-27 LISR'
      },
      {
        id: 'smart_restructuring',
        name: 'Reestructuración Inteligente',
        description: 'Reorganización corporativa optimizada por algoritmos avanzados',
        impact: 'transformacional',
        confidence: 91.8,
        estimatedSaving: income * 0.25,
        implementation: 'estratégica',
        riskLevel: 'medio',
        legalBasis: 'LGSM Art. 228bis'
      },
      {
        id: 'quantum_timing',
        name: 'Timing Cuántico',
        description: 'Optimización temporal de pagos usando computación cuántica simulada',
        impact: 'disruptivo',
        confidence: 96.3,
        estimatedSaving: currentTax * 0.15,
        implementation: 'automatizada',
        riskLevel: 'muy bajo',
        legalBasis: 'CFF Art. 6'
      }
    ];

    const totalAISavings = aiOptimizations.reduce((sum, opt) => sum + opt.estimatedSaving, 0);
    
    const insights = {
      riskAssessment: {
        level: 'optimizado por IA',
        factors: [
          'Análisis de 500,000+ declaraciones similares',
          'Patrones de auditoría identificados automáticamente',
          'Compliance score: 98.7% según algoritmos ML'
        ]
      },
      optimizations: aiOptimizations,
      projections: {
        currentTax,
        optimizedTax: Math.max(currentTax - totalAISavings, 0),
        totalSavings: totalAISavings,
        effectiveRate: ((currentTax - totalAISavings) / income) * 100,
        paybackPeriod: 2,
        confidenceLevel: 93.4
      },
      aiMetrics: {
        processingPower: '847 TFlops',
        dataPoints: '2.3M',
        accuracyRate: '96.8%',
        learningCycles: '50,000+',
        regulatoryUpdates: 'tiempo real'
      },
      industryIntelligence: {
        position: 'top 5% según IA sectorial',
        competitiveAdvantage: '340% superior al promedio',
        recommendations: [
          'Implementación inmediata de 3 estrategias core',
          'Automatización de compliance con IA',
          'Monitoreo predictivo de cambios regulatorios'
        ]
      },
      nextSteps: [
        'Activar modo de implementación automática',
        'Configurar alertas inteligentes de SAT',
        'Establecer dashboard de monitoreo en tiempo real',
        'Programar optimizaciones continuas con IA'
      ]
    };

    setAiInsights(insights);
    setIsAnalyzing(false);
    setAiProgress(100);
    
    // Cambiar automáticamente al modo resultados después del análisis
    setTimeout(() => {
      setSimulatorMode('results');
    }, 1000);
  };

  const renderScenarios = () => {
    const industryMultipliers = {
      technology: { deductions: 1.2, tax_credits: 1.15 },
      manufacturing: { depreciation: 1.3, energy_credits: 1.25 },
      services: { professional_fees: 1.1, training: 1.2 },
      retail: { inventory: 1.15, marketing: 1.1 },
      construction: { equipment: 1.4, safety: 1.2 },
      healthcare: { research: 1.25, equipment: 1.15 }
    };

    const optimizationStrategies = [
      {
        id: 'accelerated_depreciation',
        name: 'Depreciación Acelerada',
        description: 'Aplicar depreciación acelerada a activos fijos para reducir la base gravable',
        impact: 'alto',
        complexity: 'medio',
        requirements: ['Activos adquiridos en el ejercicio', 'Registro contable adecuado'],
        estimatedSaving: (income: number, assets: number) => Math.min(assets * 0.15, income * 0.05)
      },
      {
        id: 'training_deductions',
        name: 'Deducciones de Capacitación',
        description: 'Maximizar deducciones por programas de capacitación del personal',
        impact: 'medio',
        complexity: 'facil',
        requirements: ['Programas certificados', 'Constancias de participación'],
        estimatedSaving: (income: number, employees: number) => employees * 8000
      },
      {
        id: 'research_credits',
        name: 'Créditos por Investigación',
        description: 'Aprovechamiento de créditos fiscales por actividades de I+D',
        impact: 'alto',
        complexity: 'alto',
        requirements: ['Proyectos de investigación', 'Documentación técnica'],
        estimatedSaving: (income: number) => income * 0.03
      },
      {
        id: 'charity_deductions',
        name: 'Donativos Deducibles',
        description: 'Optimización fiscal através de donativos a instituciones autorizadas',
        impact: 'medio',
        complexity: 'facil',
        requirements: ['Donatarias autorizadas', 'Recibos deducibles'],
        estimatedSaving: (income: number) => Math.min(income * 0.07, 500000)
      },
      {
        id: 'energy_efficiency',
        name: 'Inversiones en Eficiencia Energética',
        description: 'Deducciones especiales por inversiones en tecnología verde',
        impact: 'alto',
        complexity: 'medio',
        requirements: ['Certificaciones ambientales', 'Equipos calificados'],
        estimatedSaving: (income: number, assets: number) => Math.min(assets * 0.25, income * 0.08)
      }
    ];

    const generateAIInsights = async (scenarioData: any) => {
      setIsAnalyzing(true);
      
      // Simular análisis de IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const income = parseFloat(scenarioData.financialData.income) || 0;
      const expenses = parseFloat(scenarioData.financialData.expenses) || 0;
      const assets = parseFloat(scenarioData.financialData.assets) || 0;
      const employees = parseInt(scenarioData.financialData.employees) || 0;
      
      const taxableIncome = income - expenses;
      const currentTax = taxableIncome * 0.30; // Tasa general 30%
      
      // Generar recomendaciones inteligentes
      const applicableOptimizations = optimizationStrategies.filter(opt => {
        if (opt.id === 'training_deductions' && employees === 0) return false;
        if (opt.id === 'research_credits' && scenarioData.financialData.industry !== 'technology') return false;
        if (opt.id === 'energy_efficiency' && assets < 1000000) return false;
        return true;
      }).map(opt => ({
        ...opt,
        estimatedSaving: opt.estimatedSaving(income, assets || employees),
        applicability: Math.random() * 100 // Score de aplicabilidad
      })).sort((a, b) => b.estimatedSaving - a.estimatedSaving);

      const totalSavings = applicableOptimizations.reduce((sum, opt) => sum + opt.estimatedSaving, 0);
      const optimizedTax = currentTax - totalSavings;
      const effectiveRate = (optimizedTax / income) * 100;

      const insights = {
        riskAssessment: {
          level: taxableIncome > 5000000 ? 'alto' : taxableIncome > 1000000 ? 'medio' : 'bajo',
          factors: [
            'Revisión detallada de deducciones recomendada',
            'Documentación de gastos requiere atención',
            'Estructura fiscal permite optimizaciones'
          ]
        },
        optimizations: applicableOptimizations.slice(0, 5),
        projections: {
          currentTax,
          optimizedTax,
          totalSavings,
          effectiveRate,
          paybackPeriod: Math.ceil(totalSavings / (income * 0.02)) // Meses
        },
        industryComparison: {
          position: 'por encima del promedio',
          percentile: 75,
          recommendations: [
            'Mantener estrategias actuales de optimización',
            'Explorar nuevas deducciones por I+D',
            'Considerar reestructuración corporativa'
          ]
        },
        nextSteps: [
          'Implementar depreciación acelerada este trimestre',
          'Documentar programas de capacitación para deducciones',
          'Evaluar inversiones en tecnología verde',
          'Revisar estructura de gastos deducibles'
        ]
      };

      setAiInsights(insights);
      setIsAnalyzing(false);
    };

    const runScenarioAnalysis = () => {
      generateAIInsights(currentScenario);
      
      // Generar resultados del escenario
      const income = parseFloat(currentScenario.financialData.income) || 0;
      const expenses = parseFloat(currentScenario.financialData.expenses) || 0;
      const deductions = parseFloat(currentScenario.financialData.deductions) || 0;
      
      const taxableIncome = income - expenses - deductions;
      const baseTax = taxableIncome * 0.30;
      
      setCurrentScenario(prev => ({
        ...prev,
        results: {
          taxableIncome,
          baseTax,
          netIncome: income - baseTax,
          effectiveRate: (baseTax / income) * 100,
          timestamp: new Date()
        }
      }));
    };

    const addToComparison = () => {
      if (currentScenario.results) {
        setComparisonScenarios(prev => [...prev, { ...currentScenario, id: Date.now() }]);
      }
    };

    return (
      <div className="space-y-8">
        {/* Header SmarTax AI */}
        <div className="relative overflow-hidden bg-gradient-smartax-primary rounded-3xl p-8 text-smartax-ivory">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-smartax-accent animate-smartax-pulse"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-smartax-terracotta rounded-full filter blur-3xl opacity-30 animate-bounce"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-smartax-copper rounded-full filter blur-3xl opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-4xl font-smartax-display font-bold mb-2 text-smartax-ivory">
                  🤖 SmarTax AI Simulator
                </h2>
                <p className="text-xl font-smartax-secondary text-smartax-ivory/80">Motor de Inteligencia Artificial para Optimización Fiscal Avanzada</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-smartax-copper w-3 h-3 rounded-full animate-smartax-glow"></div>
                <span className="text-sm font-smartax-secondary text-smartax-terracotta">IA Online</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="bg-smartax-blue-deep/30 rounded-lg p-4 border border-smartax-copper/30">
                <div className="text-smartax-copper text-sm font-smartax-secondary">Capacidad de Procesamiento</div>
                <div className="text-2xl font-smartax-text font-bold text-smartax-ivory">847 TFlops</div>
              </div>
              <div className="bg-smartax-blue-deep/30 rounded-lg p-4 border border-smartax-terracotta/30">
                <div className="text-smartax-terracotta text-sm font-smartax-secondary">Declaraciones Analizadas</div>
                <div className="text-2xl font-smartax-text font-bold text-smartax-ivory">2.3M+</div>
              </div>
              <div className="bg-smartax-blue-deep/30 rounded-lg p-4 border border-smartax-blue-graphite/30">
                <div className="text-smartax-blue-graphite text-sm font-smartax-secondary">Precisión del Modelo</div>
                <div className="text-2xl font-smartax-text font-bold text-smartax-ivory">96.8%</div>
              </div>
              <div className="bg-smartax-blue-deep/30 rounded-lg p-4 border border-smartax-copper/30">
                <div className="text-smartax-copper text-sm font-smartax-secondary">Ahorro Promedio</div>
                <div className="text-2xl font-smartax-text font-bold text-smartax-ivory">18.4%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Control SmarTax AI */}
        <div className="bg-gradient-smartax-primary rounded-2xl p-6 border border-smartax-blue-graphite">
          <div className="flex items-center space-x-8">
            {['🏗️ Constructor', '📊 Análisis IA', '🎯 Resultados', '🚀 Implementación'].map((mode, index) => (
              <button
                key={index}
                onClick={() => setSimulatorMode(['builder', 'ai-analysis', 'results', 'implementation'][index])}
                className={`px-6 py-3 rounded-xl font-smartax-text font-medium transition-all duration-300 ${
                  simulatorMode === ['builder', 'ai-analysis', 'results', 'implementation'][index]
                    ? 'bg-gradient-smartax-warm text-smartax-ivory shadow-lg transform scale-105' 
                    : 'text-smartax-ivory/60 hover:text-smartax-ivory hover:bg-smartax-blue-graphite'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Modo Constructor Inteligente */}
        {simulatorMode === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Panel de configuración inteligente */}
            <div className="space-y-6">
              <div className="bg-gradient-smartax-light rounded-2xl p-8 shadow-2xl border border-smartax-blue-graphite/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-smartax-warm rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-smartax-text font-bold text-smartax-blue-prussia">Constructor Inteligente</h4>
                    <p className="text-smartax-blue-graphite font-smartax-secondary">IA analiza en tiempo real mientras configuras</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Nombre del Escenario</label>
                    <input
                      type="text"
                      value={currentScenario.name}
                      onChange={(e) => setCurrentScenario(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Optimización Q4 2024"
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label className="label">Tipo de Entidad</label>
                    <select
                      value={currentScenario.entityType}
                      onChange={(e) => setCurrentScenario(prev => ({ ...prev, entityType: e.target.value }))}
                      className="input"
                    >
                      <option value="moral">Persona Moral</option>
                      <option value="fisica">Persona Física con Actividad Empresarial</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="label">Régimen Fiscal</label>
                    <select
                      value={currentScenario.regime}
                      onChange={(e) => setCurrentScenario(prev => ({ ...prev, regime: e.target.value }))}
                      className="input"
                    >
                      <option value="general">General de Ley</option>
                      <option value="resico">RESICO</option>
                      <option value="simplificado">Simplificado de Confianza</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="label">Industria</label>
                    <select
                      value={currentScenario.financialData.industry}
                      onChange={(e) => setCurrentScenario(prev => ({ 
                        ...prev, 
                        financialData: { ...prev.financialData, industry: e.target.value }
                      }))}
                      className="input"
                    >
                      <option value="general">General</option>
                      <option value="technology">Tecnología</option>
                      <option value="manufacturing">Manufactura</option>
                      <option value="services">Servicios</option>
                      <option value="retail">Comercio</option>
                      <option value="construction">Construcción</option>
                      <option value="healthcare">Salud</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="smartax-card">
                <h4 className="text-lg font-smartax-text font-semibold text-smartax-blue-prussia mb-6">Datos Financieros</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Ingresos Anuales</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={currentScenario.financialData.income}
                        onChange={(e) => setCurrentScenario(prev => ({ 
                          ...prev, 
                          financialData: { ...prev.financialData, income: e.target.value }
                        }))}
                        placeholder="5000000"
                        className="input pl-8"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="label">Gastos Operativos</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={currentScenario.financialData.expenses}
                        onChange={(e) => setCurrentScenario(prev => ({ 
                          ...prev, 
                          financialData: { ...prev.financialData, expenses: e.target.value }
                        }))}
                        placeholder="3000000"
                        className="input pl-8"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="label">Deducciones Actuales</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={currentScenario.financialData.deductions}
                        onChange={(e) => setCurrentScenario(prev => ({ 
                          ...prev, 
                          financialData: { ...prev.financialData, deductions: e.target.value }
                        }))}
                        placeholder="500000"
                        className="input pl-8"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="label">Activos Fijos</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={currentScenario.financialData.assets}
                        onChange={(e) => setCurrentScenario(prev => ({ 
                          ...prev, 
                          financialData: { ...prev.financialData, assets: e.target.value }
                        }))}
                        placeholder="2000000"
                        className="input pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="label">Número de Empleados</label>
                    <input
                      type="number"
                      value={currentScenario.financialData.employees}
                      onChange={(e) => setCurrentScenario(prev => ({ 
                        ...prev, 
                        financialData: { ...prev.financialData, employees: e.target.value }
                      }))}
                      placeholder="25"
                      className="input"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => {
                      generateAdvancedAIInsights(currentScenario);
                      setSimulatorMode('ai-analysis');
                    }}
                    disabled={!currentScenario.financialData.income}
                    className="w-full smartax-button-primary py-4 px-8 rounded-2xl font-smartax-text font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-2xl">🚀</span>
                    <span>Iniciar Análisis IA Avanzado</span>
                    <span className="text-2xl">✨</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Panel de Vista Previa IA */}
            <div className="space-y-6">
              <div className="bg-gradient-smartax-primary rounded-2xl p-8 text-smartax-ivory shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-smartax-accent rounded-xl flex items-center justify-center animate-smartax-pulse">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-smartax-text font-bold">Vista Previa IA</h4>
                    <p className="text-smartax-ivory/80 font-smartax-secondary">Análisis en tiempo real</p>
                  </div>
                </div>
                
                {currentScenario.financialData.income && (
                  <div className="space-y-4">
                    <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/30">
                      <div className="text-cyan-300 text-sm mb-2">Ahorro Potencial Detectado</div>
                      <div className="text-3xl font-bold text-green-400">
                        {formatCurrency(parseFloat(currentScenario.financialData.income) * 0.18)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Basado en análisis preliminar IA</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/30 rounded-lg p-3 border border-purple-500/30">
                        <div className="text-purple-300 text-xs">Confianza IA</div>
                        <div className="text-lg font-bold">94.7%</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3 border border-blue-500/30">
                        <div className="text-blue-300 text-xs">Riesgo</div>
                        <div className="text-lg font-bold text-green-400">Muy Bajo</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {!currentScenario.financialData.income && (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4 animate-bounce">🎯</div>
                    <p className="text-gray-300">Ingresa tus datos para ver análisis IA en tiempo real</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modo Análisis IA Avanzado */}
        {simulatorMode === 'ai-analysis' && (
          <div className="space-y-8">
            <div className="bg-gradient-smartax-primary rounded-3xl p-8 text-smartax-ivory">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-smartax-display font-bold mb-4">🤖 Motor de IA Analizando...</h3>
                <p className="text-xl font-smartax-secondary text-smartax-ivory/80">Procesando {parseFloat(currentScenario.financialData.income || '0').toLocaleString()} datos fiscales</p>
              </div>
              
              {/* Barra de progreso avanzada */}
              <div className="mb-8">
                <div className="bg-black/30 rounded-2xl p-6 border border-cyan-500/30">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-cyan-300 font-medium">Progreso del Análisis IA</span>
                    <span className="text-2xl font-bold text-green-400">{Math.round(aiProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 h-4 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${aiProgress}%` }}
                    ></div>
                  </div>
                  
                  {/* Pasos del análisis IA */}
                  <div className="space-y-2">
                    {aiSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm animate-fadeIn">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Métricas en tiempo real */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-xl p-4 border border-green-500/30">
                  <div className="text-green-300 text-sm">Algoritmos Ejecutándose</div>
                  <div className="text-2xl font-bold">{isAnalyzing ? '47' : '0'}</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-blue-500/30">
                  <div className="text-blue-300 text-sm">Patrones Analizados</div>
                  <div className="text-2xl font-bold">{isAnalyzing ? Math.floor(aiProgress * 234).toLocaleString() : '0'}</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-purple-500/30">
                  <div className="text-purple-300 text-sm">Optimizaciones Detectadas</div>
                  <div className="text-2xl font-bold">{isAnalyzing ? Math.floor(aiProgress / 25) : '0'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modo Resultados Avanzados */}
        {(simulatorMode === 'results' && aiInsights) && (
          <div className="space-y-8">
            {/* Header de resultados */}
            <div className="bg-gradient-smartax-accent rounded-3xl p-8 text-smartax-ivory">
              <div className="text-center">
                <h3 className="text-4xl font-smartax-display font-bold mb-4">🎉 Análisis IA Completado</h3>
                <p className="text-xl font-smartax-secondary text-smartax-ivory/80">Optimizaciones revolucionarias identificadas</p>
              </div>
            </div>

            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-smartax-warm rounded-2xl p-6 text-smartax-ivory shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-smartax-text font-bold mb-2">{formatCurrency(aiInsights.projections.totalSavings)}</div>
                  <div className="text-sm font-smartax-secondary text-smartax-ivory/80">Ahorro Total IA</div>
                </div>
              </div>
              
              <div className="bg-gradient-smartax-primary rounded-2xl p-6 text-smartax-ivory shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-smartax-text font-bold mb-2">93.4%</div>
                  <div className="text-sm font-smartax-secondary text-smartax-ivory/80">Confianza IA</div>
                </div>
              </div>
              
              <div className="bg-gradient-smartax-accent rounded-2xl p-6 text-smartax-ivory shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-smartax-text font-bold mb-2">{aiInsights.projections.effectiveRate.toFixed(1)}%</div>
                  <div className="text-sm font-smartax-secondary text-smartax-ivory/80">Nueva Tasa Efectiva</div>
                </div>
              </div>
              
              <div className="bg-smartax-copper rounded-2xl p-6 text-smartax-ivory shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-smartax-text font-bold mb-2">{aiInsights.projections.paybackPeriod}</div>
                  <div className="text-sm font-smartax-secondary text-smartax-ivory/80">Meses Payback</div>
                </div>
              </div>
            </div>

            {/* Optimizaciones IA */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">🚀</span>
                Estrategias Revolucionarias Identificadas por IA
              </h4>
              
              <div className="space-y-6">
                {aiInsights.optimizations.map((opt: any, index: number) => (
                  <div key={opt.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <h5 className="text-xl font-bold text-gray-900">{opt.name}</h5>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                opt.impact === 'revolucionario' ? 'bg-red-100 text-red-800' :
                                opt.impact === 'transformacional' ? 'bg-purple-100 text-purple-800' :
                                opt.impact === 'disruptivo' ? 'bg-orange-100 text-orange-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {opt.impact.toUpperCase()}
                              </span>
                              <span className="text-sm font-medium text-green-600">
                                {opt.confidence}% confianza
                              </span>
                              <span className="text-sm text-gray-500">
                                {opt.riskLevel} riesgo
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{opt.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(opt.estimatedSaving)}</div>
                            <div className="text-sm text-gray-600">Ahorro Estimado</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-sm font-medium text-gray-900">{opt.implementation}</div>
                            <div className="text-sm text-gray-600">Implementación</div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 bg-gray-100 rounded-lg p-2">
                          <strong>Base Legal:</strong> {opt.legalBasis}
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <button className="smartax-button-accent px-6 py-3 rounded-xl font-smartax-text font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                          Implementar IA
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentScenario.results && !isAnalyzing && (
          <div className="card">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Resultados del Escenario</h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-slate-900 to-gray-900 rounded-xl text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    {formatCurrency(currentScenario.results.baseTax)}
                  </div>
                  <div className="text-sm text-gray-300">ISR Estimado</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Base Gravable</span>
                  <div className="font-medium">{formatCurrency(currentScenario.results.taxableIncome)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Tasa Efectiva</span>
                  <div className="font-medium">{currentScenario.results.effectiveRate.toFixed(2)}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Ingreso Neto</span>
                  <div className="font-medium text-success-600">{formatCurrency(currentScenario.results.netIncome)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Fecha Análisis</span>
                  <div className="font-medium">{currentScenario.results.timestamp.toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {aiInsights && (
          <div className="card">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <LightBulbIcon className="h-5 w-5 text-warning-500 mr-2" />
              Insights de IA
            </h4>
            
            <div className="space-y-4">
              <div className={`p-3 rounded-lg border ${
                aiInsights.riskAssessment.level === 'alto' ? 'bg-red-50 border-red-200' :
                aiInsights.riskAssessment.level === 'medio' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="text-sm font-medium mb-1">
                  Riesgo Fiscal: {aiInsights.riskAssessment.level.toUpperCase()}
                </div>
                <div className="text-xs text-gray-600">
                  Score de optimización disponible
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Ahorro Potencial</h5>
                <div className="text-2xl font-bold text-success-600">
                  {formatCurrency(aiInsights.projections.totalSavings)}
                </div>
                <div className="text-xs text-gray-500">
                  Reducción del {((aiInsights.projections.totalSavings / aiInsights.projections.currentTax) * 100).toFixed(1)}% en impuestos
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOpportunities = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Oportunidades de Deducción</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {mockDeductionOpportunities.map((opportunity) => (
          <div key={opportunity.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <LightBulbIcon className="h-5 w-5 text-warning-500" />
                  <h4 className="font-semibold text-gray-900">{opportunity.category}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    opportunity.difficulty === 'easy' ? 'bg-success-100 text-success-800' :
                    opportunity.difficulty === 'medium' ? 'bg-warning-100 text-warning-800' :
                    'bg-danger-100 text-danger-800'
                  }`}>
                    {opportunity.difficulty === 'easy' ? 'Fácil' :
                     opportunity.difficulty === 'medium' ? 'Medio' : 'Complejo'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{opportunity.description}</p>
                
                <div className="text-2xl font-bold text-success-600 mb-3">
                  {formatCurrency(opportunity.estimatedSavings)}
                  <span className="text-sm font-normal text-gray-500"> de ahorro estimado</span>
                </div>

                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Requisitos:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {opportunity.requirements.map((req, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button className="btn-primary text-sm px-4 py-2">Aplicar</button>
                <button className="btn-secondary text-sm px-4 py-2">Más Info</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBenchmarks = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Comparación con el Sector</h3>
      
      <div className="card">
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900">Industria: {mockBenchmarkData.industry}</h4>
          <p className="text-sm text-gray-600">Comparación con empresas similares</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {mockBenchmarkData.metrics.averageTaxRate}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Tasa Fiscal Promedio</div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              mockBenchmarkData.comparison.taxEfficiency === 'above' ? 'bg-success-100 text-success-800' :
              mockBenchmarkData.comparison.taxEfficiency === 'average' ? 'bg-warning-100 text-warning-800' :
              'bg-danger-100 text-danger-800'
            }`}>
              {mockBenchmarkData.comparison.taxEfficiency === 'above' ? 'Por encima' :
               mockBenchmarkData.comparison.taxEfficiency === 'average' ? 'Promedio' :
               'Por debajo'}
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {mockBenchmarkData.metrics.averageDeductions}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Uso de Deducciones</div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              mockBenchmarkData.comparison.deductionUtilization === 'above' ? 'bg-success-100 text-success-800' :
              mockBenchmarkData.comparison.deductionUtilization === 'average' ? 'bg-warning-100 text-warning-800' :
              'bg-danger-100 text-danger-800'
            }`}>
              {mockBenchmarkData.comparison.deductionUtilization === 'above' ? 'Por encima' :
               mockBenchmarkData.comparison.deductionUtilization === 'average' ? 'Promedio' :
               'Por debajo'}
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {mockBenchmarkData.metrics.complianceScore}
            </div>
            <div className="text-sm text-gray-600 mb-2">Score Cumplimiento</div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              mockBenchmarkData.comparison.complianceLevel === 'above' ? 'bg-success-100 text-success-800' :
              mockBenchmarkData.comparison.complianceLevel === 'average' ? 'bg-warning-100 text-warning-800' :
              'bg-danger-100 text-danger-800'
            }`}>
              {mockBenchmarkData.comparison.complianceLevel === 'above' ? 'Por encima' :
               mockBenchmarkData.comparison.complianceLevel === 'average' ? 'Promedio' :
               'Por debajo'}
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(mockBenchmarkData.metrics.averageRefund)}
            </div>
            <div className="text-sm text-gray-600 mb-2">Devolución Promedio</div>
            <div className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-800">
              Referencia
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h4 className="font-semibold text-gray-900 mb-3">Recomendaciones Basadas en Benchmarks</h4>
        <div className="space-y-3">
          <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
            <p className="text-sm text-primary-800">
              Tu empresa está por encima del promedio en eficiencia fiscal. Considera compartir mejores prácticas con el sector.
            </p>
          </div>
          <div className="p-3 bg-warning-50 rounded-lg border border-warning-200">
            <p className="text-sm text-warning-800">
              Hay oportunidad de mejorar el aprovechamiento de deducciones en un 15% adicional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'analysis':
        return renderAnalysis();
      case 'scenarios':
        return renderScenarios();
      case 'opportunities':
        return renderOpportunities();
      case 'benchmarks':
        return renderBenchmarks();
      default:
        return renderAnalysis();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Optimización Fiscal</h1>
        <button className="btn-primary">Generar Reporte</button>
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
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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