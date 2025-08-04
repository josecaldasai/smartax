'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DocumentPlusIcon, 
  CalculatorIcon, 
  ChartBarIcon, 
  CloudArrowUpIcon,
  DocumentCheckIcon,
  BanknotesIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TableCellsIcon,
  DocumentArrowUpIcon,
  CogIcon,
  InformationCircleIcon,
  PlusIcon,
  TrashIcon,
  CloudIcon,
  DocumentIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

interface Modal {
  id: string;
  title: string;
  isOpen: boolean;
}

interface CFDIRecord {
  uuid: string;
  rfc: string;
  amount: number;
  status?: 'validating' | 'valid' | 'invalid' | 'pending';
  error?: string;
  issuer?: string;
  date?: string;
}

interface TaxCalculationDraft {
  id: string;
  name: string;
  entityType: 'fisica' | 'moral';
  regime: string;
  fiscalYear: string;
  businessActivity: string;
  basicData: {
    income: string;
    expenses: string;
    deductions: string;
    period: string;
  };
  advancedData: {
    assets: string;
    depreciation: string;
    inventoryStart: string;
    inventoryEnd: string;
    provisionalPayments: string;
    retentions: string;
    employees: string;
    ptuPaid: string;
    foreignIncome: string;
    exemptIncome: string;
  };
  result: {
    isr: number;
    iva: number;
    ieps: number;
    ptu: number;
    totalTax: number;
    netIncome: number;
    effectiveRate: number;
    provisionalISR: number;
    annualISR: number;
    refundDue: number;
    recommendations: string[];
  } | null;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  notes: string;
  isForDeclaration: boolean;
}

export default function QuickActions() {
  const [activeModal, setActiveModal] = useState<Modal | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [cfdiValidationMode, setCfdiValidationMode] = useState<'single' | 'batch' | 'sat'>('single');
  const [cfdiRecords, setCfdiRecords] = useState<CFDIRecord[]>([]);
  const [isProcessingCFDI, setIsProcessingCFDI] = useState(false);
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculationDraft>({
    id: '',
    name: '',
    entityType: 'moral',
    regime: 'general',
    fiscalYear: new Date().getFullYear().toString(),
    businessActivity: 'general',
    basicData: {
      income: '',
      expenses: '',
      deductions: '',
      period: 'monthly'
    },
    advancedData: {
      assets: '',
      depreciation: '',
      inventoryStart: '',
      inventoryEnd: '',
      provisionalPayments: '',
      retentions: '',
      employees: '',
      ptuPaid: '',
      foreignIncome: '',
      exemptIncome: ''
    },
    result: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    notes: '',
    isForDeclaration: false
  });
  const [savedDrafts, setSavedDrafts] = useState<TaxCalculationDraft[]>([]);
  const [activeDraftMode, setActiveDraftMode] = useState<'new' | 'edit' | 'load'>('new');
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [singleCFDI, setSingleCFDI] = useState({
    uuid: '',
    rfc: '',
    amount: ''
  });

  // Estados del simulador fiscal
  const [simulatorStep, setSimulatorStep] = useState(1);
  const [scenarioData, setScenarioData] = useState<any>({
    name: '',
    currentSituation: {
      income: '',
      expenses: '',
      currentTax: '',
      industry: 'general'
    },
    optimizations: {
      acceleratedDepreciation: false,
      trainingDeductions: false,
      researchCredits: false,
      energyEfficiency: false,
      charityDeductions: false
    },
    results: null,
    aiRecommendations: null
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

const quickActions = [
  {
    id: 'upload-document',
    title: 'Subir Documento',
    description: 'Sube facturas y recibos',
    icon: CloudArrowUpIcon,
      color: 'bg-smartax-blue-prussia hover:bg-smartax-blue-deep',
  },
  {
    id: 'validate-cfdi',
    title: 'Validar CFDI',
    description: 'Verifica facturas electrónicas',
    icon: DocumentCheckIcon,
      color: 'bg-smartax-copper hover:bg-smartax-copper',
  },
  {
    id: 'calculate-taxes',
    title: 'Calculadora Fiscal',
    description: 'Calcula impuestos estimados',
    icon: CalculatorIcon,
      color: 'bg-smartax-terracotta hover:bg-smartax-copper',
  },
  {
    id: 'create-declaration',
    title: 'Nueva Declaración',
    description: 'Genera declaración mensual',
    icon: DocumentPlusIcon,
      color: 'bg-smartax-blue-graphite hover:bg-smartax-blue-prussia',
  },
  {
    id: 'analyze-scenario',
    title: 'Simular Escenario',
    description: 'Análisis de optimización',
    icon: ChartBarIcon,
      color: 'bg-gradient-smartax-warm hover:bg-gradient-smartax-accent',
  },
  {
    id: 'pay-taxes',
    title: 'Pagar Impuestos',
    description: 'Procesar pagos fiscales',
    icon: BanknotesIcon,
      color: 'bg-gradient-smartax-accent hover:bg-gradient-smartax-warm',
    },
  ];

  const openModal = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action) {
      setActiveModal({
        id: actionId,
        title: action.title,
        isOpen: true
      });
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    // Reset states when closing
    setUploadedFiles([]);
    setCfdiRecords([]);
    setCfdiValidationMode('single');
    setIsProcessingCFDI(false);
    setTaxCalculation({
      id: '',
      name: '',
      entityType: 'moral',
      regime: 'general',
      fiscalYear: new Date().getFullYear().toString(),
      businessActivity: 'general',
      basicData: {
        income: '',
        expenses: '',
        deductions: '',
        period: 'monthly'
      },
      advancedData: {
        assets: '',
        depreciation: '',
        inventoryStart: '',
        inventoryEnd: '',
        provisionalPayments: '',
        retentions: '',
        employees: '',
        ptuPaid: '',
        foreignIncome: '',
        exemptIncome: ''
      },
      result: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      notes: '',
      isForDeclaration: false
    });
    setSingleCFDI({ uuid: '', rfc: '', amount: '' });
    
    // Reset simulator states
    setSimulatorStep(1);
    setScenarioData({
      name: '',
      currentSituation: { income: '', expenses: '', currentTax: '', industry: 'general' },
      optimizations: {
        acceleratedDepreciation: false,
        trainingDeductions: false,
        researchCredits: false,
        energyEfficiency: false,
        charityDeductions: false
      },
      results: null,
      aiRecommendations: null
    });
    setIsAnalyzing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  const processUploadedFiles = () => {
    // Simulate file processing
    setTimeout(() => {
      alert(`${uploadedFiles.length} archivo(s) subido(s) y procesándose. Verifica el módulo de Documentos.`);
      closeModal();
    }, 1000);
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate Excel parsing
      const mockData: CFDIRecord[] = [
        { uuid: '11111111-2222-3333-4444-555555555555', rfc: 'XAXX010101000', amount: 15000, status: 'pending' },
        { uuid: '22222222-3333-4444-5555-666666666666', rfc: 'YBYY020202000', amount: 8500, status: 'pending' },
        { uuid: '33333333-4444-5555-6666-777777777777', rfc: 'ZCZZ030303000', amount: 22000, status: 'pending' },
        { uuid: '44444444-5555-6666-7777-888888888888', rfc: 'WAWW040404000', amount: 5500, status: 'pending' },
      ];
      setCfdiRecords(mockData);
    }
  };

  const addCFDIRecord = () => {
    if (singleCFDI.uuid && singleCFDI.rfc && singleCFDI.amount) {
      const newRecord: CFDIRecord = {
        uuid: singleCFDI.uuid,
        rfc: singleCFDI.rfc,
        amount: parseFloat(singleCFDI.amount),
        status: 'pending'
      };
      setCfdiRecords(prev => [...prev, newRecord]);
      setSingleCFDI({ uuid: '', rfc: '', amount: '' });
    }
  };

  const removeCFDIRecord = (index: number) => {
    setCfdiRecords(prev => prev.filter((_, i) => i !== index));
  };

  const validateAllCFDI = async () => {
    setIsProcessingCFDI(true);
    
    // Simulate validation process for each CFDI
    for (let i = 0; i < cfdiRecords.length; i++) {
      setCfdiRecords(prev => prev.map((record, idx) => 
        idx === i ? { ...record, status: 'validating' } : record
      ));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate validation result
      const isValid = Math.random() > 0.3; // 70% chance of being valid
      setCfdiRecords(prev => prev.map((record, idx) => 
        idx === i ? { 
          ...record, 
          status: isValid ? 'valid' : 'invalid',
          error: isValid ? undefined : 'Certificado vencido',
          issuer: 'Empresa Ejemplo S.A. de C.V.',
          date: '2024-11-28'
        } : record
      ));
    }
    
    setIsProcessingCFDI(false);
  };

  const handleFacturaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Simulate automatic CFDI extraction from uploaded invoices
      const extractedCFDIs: CFDIRecord[] = Array.from(files).map((file, index) => ({
        uuid: `AUTO-${Date.now()}-${index}`,
        rfc: 'AUTO-EXTRACTED',
        amount: Math.floor(Math.random() * 50000) + 1000,
        status: 'pending' as const,
      }));
      setCfdiRecords(prev => [...prev, ...extractedCFDIs]);
    }
  };

  const calculateAdvancedTaxes = () => {
    const income = parseFloat(taxCalculation.basicData.income) || 0;
    const expenses = parseFloat(taxCalculation.basicData.expenses) || 0;
    const deductions = parseFloat(taxCalculation.basicData.deductions) || 0;
    const assets = parseFloat(taxCalculation.advancedData.assets) || 0;
    const depreciation = parseFloat(taxCalculation.advancedData.depreciation) || 0;
    const inventoryStart = parseFloat(taxCalculation.advancedData.inventoryStart) || 0;
    const inventoryEnd = parseFloat(taxCalculation.advancedData.inventoryEnd) || 0;
    const provisionalPayments = parseFloat(taxCalculation.advancedData.provisionalPayments) || 0;
    const retentions = parseFloat(taxCalculation.advancedData.retentions) || 0;
    const employees = parseInt(taxCalculation.advancedData.employees) || 0;
    const ptuPaid = parseFloat(taxCalculation.advancedData.ptuPaid) || 0;
    const foreignIncome = parseFloat(taxCalculation.advancedData.foreignIncome) || 0;
    const exemptIncome = parseFloat(taxCalculation.advancedData.exemptIncome) || 0;
    
    // Calculate cost of goods sold for companies
    const costOfGoodsSold = inventoryStart + expenses - inventoryEnd;
    let taxableIncome = income - Math.max(costOfGoodsSold, expenses) - deductions - depreciation;
    if (taxableIncome < 0) taxableIncome = 0;
    
    let isr = 0;
    let iva = 0;
    let ieps = 0;
    let ptu = 0;
    let provisionalISR = 0;
    let annualISR = 0;
    let refundDue = 0;
    const recommendations: string[] = [];
    
    // ISR calculation based on entity type and regime
    if (taxCalculation.entityType === 'moral') {
      // Persona Moral calculations
      switch (taxCalculation.regime) {
        case 'general':
          isr = taxableIncome * 0.30; // 30% rate for companies
          break;
        case 'resico':
          isr = Math.min(taxableIncome * 0.01, 20000);
          break;
        default:
          isr = taxableIncome * 0.30;
      }
      
      // PTU calculation for companies (10% of taxable income)
      if (employees > 0 && taxableIncome > 0) {
        ptu = taxableIncome * 0.10;
        recommendations.push(`PTU estimado: $${ptu.toLocaleString()} para ${employees} empleados`);
      }
    } else {
      // Persona Física calculations
      if (taxableIncome <= 125900) {
        isr = taxableIncome * 0.0192;
      } else if (taxableIncome <= 1000000) {
        isr = 2417.76 + (taxableIncome - 125900) * 0.064;
      } else {
        isr = taxableIncome * 0.35;
      }
    }
    
    // IVA calculation (16% on taxable income for most regimes)
    if (taxCalculation.regime !== 'resico') {
      iva = income * 0.16;
      recommendations.push('Verificar IVA acreditable para reducir carga fiscal');
    }
    
    // IEPS calculation based on business activity
    if (['beverages', 'tobacco', 'fuels'].includes(taxCalculation.businessActivity)) {
      ieps = income * 0.08; // Example rate
      recommendations.push('IEPS aplicable por tipo de actividad empresarial');
    }
    
    // Provisional payments vs annual
    provisionalISR = isr / 12; // Monthly provisional payment
    annualISR = isr;
    
    // Calculate refund if overpaid
    if (provisionalPayments > annualISR) {
      refundDue = provisionalPayments - annualISR;
      recommendations.push(`Saldo a favor disponible: $${refundDue.toLocaleString()}`);
    }
    
    // Period adjustments
    if (taxCalculation.basicData.period === 'monthly') {
      isr = isr / 12;
      iva = iva / 12;
      ieps = ieps / 12;
      ptu = ptu / 12;
    }
    
    // Add business recommendations
    if (assets > 0 && depreciation < assets * 0.1) {
      recommendations.push('Considerar mayor depreciación de activos para reducir ISR');
    }
    
    if (foreignIncome > 0) {
      recommendations.push('Revisar tratados de doble tributación para ingresos del extranjero');
    }
    
    if (exemptIncome > 0) {
      recommendations.push('Validar correcta aplicación de ingresos exentos');
    }
    
    const totalTax = isr + iva + ieps + ptu;
    const netIncome = income - totalTax;
    const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
    
    setTaxCalculation(prev => ({
      ...prev,
      updatedAt: new Date(),
      result: {
        isr,
        iva,
        ieps,
        ptu,
        totalTax,
        netIncome,
        effectiveRate,
        provisionalISR,
        annualISR,
        refundDue,
        recommendations
      }
    }));
  };

  const saveDraft = () => {
    const newDraft: TaxCalculationDraft = {
      ...taxCalculation,
      id: selectedDraftId || Date.now().toString(),
      name: taxCalculation.name || `Cálculo ${new Date().toLocaleDateString()}`,
      updatedAt: new Date()
    };
    
    if (selectedDraftId) {
      setSavedDrafts(prev => prev.map(draft => 
        draft.id === selectedDraftId ? newDraft : draft
      ));
    } else {
      setSavedDrafts(prev => [...prev, newDraft]);
      setSelectedDraftId(newDraft.id);
    }
    
    setActiveDraftMode('edit');
  };

  const loadDraft = (draftId: string) => {
    const draft = savedDrafts.find(d => d.id === draftId);
    if (draft) {
      setTaxCalculation(draft);
      setSelectedDraftId(draftId);
      setActiveDraftMode('edit');
    }
  };

  const deleteDraft = (draftId: string) => {
    setSavedDrafts(prev => prev.filter(d => d.id !== draftId));
    if (selectedDraftId === draftId) {
      setSelectedDraftId(null);
      setActiveDraftMode('new');
    }
  };

  const createNewDraft = () => {
    setTaxCalculation({
      id: '',
      name: '',
      entityType: 'moral',
      regime: 'general',
      fiscalYear: new Date().getFullYear().toString(),
      businessActivity: 'general',
      basicData: {
        income: '',
        expenses: '',
        deductions: '',
        period: 'monthly'
      },
      advancedData: {
        assets: '',
        depreciation: '',
        inventoryStart: '',
        inventoryEnd: '',
        provisionalPayments: '',
        retentions: '',
        employees: '',
        ptuPaid: '',
        foreignIncome: '',
        exemptIncome: ''
      },
      result: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      notes: '',
      isForDeclaration: false
    });
    setSelectedDraftId(null);
    setActiveDraftMode('new');
  };

  const exportForDeclaration = () => {
    if (!taxCalculation.result) return;
    
    const declarationData = {
      entityType: taxCalculation.entityType,
      regime: taxCalculation.regime,
      fiscalYear: taxCalculation.fiscalYear,
      calculations: taxCalculation.result,
      sourceData: {
        ...taxCalculation.basicData,
        ...taxCalculation.advancedData
      },
      exportedAt: new Date().toISOString()
    };
    
    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(declarationData, null, 2)], { 
      type: 'application/json' 
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculo_fiscal_${taxCalculation.fiscalYear}_${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderUploadModal = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-smartax-copper/50 rounded-lg p-8 text-center hover:border-smartax-copper transition-colors">
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-smartax-copper mb-4" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 font-smartax-display">Subir Documentos</h3>
          <p className="text-gray-600 font-smartax-secondary">Arrastra archivos aquí o haz clic para seleccionar</p>
          <p className="text-sm text-gray-500 font-smartax-secondary">
            Formatos soportados: PDF, XML, JPG, PNG (máximo 10MB por archivo)
          </p>
        </div>
        <label className="smartax-button-primary mt-4 cursor-pointer inline-block">
          <span className="font-smartax-text">Seleccionar Archivos</span>
          <input
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.xml,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 font-smartax-text">Archivos seleccionados ({uploadedFiles.length}):</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-smartax-ivory rounded-lg border border-smartax-copper/20">
              <div>
                <div className="font-medium text-sm text-gray-900 font-smartax-text">{file.name}</div>
                <div className="text-xs text-gray-500 font-smartax-secondary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              <div className="text-smartax-copper">
                <CheckCircleIcon className="h-5 w-5" />
              </div>
            </div>
          ))}
          <button
            onClick={processUploadedFiles}
            className="smartax-button-primary w-full"
          >
            <span className="font-smartax-text">Procesar y Clasificar Documentos</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderCFDIValidationModal = () => (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setCfdiValidationMode('single')}
          className={`p-6 rounded-xl border-2 transition-all duration-200 text-left group ${
            cfdiValidationMode === 'single'
              ? 'border-smartax-copper bg-smartax-copper/10 shadow-lg'
              : 'border-gray-200 hover:border-smartax-copper/50 hover:shadow-md'
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${
              cfdiValidationMode === 'single' ? 'bg-smartax-copper' : 'bg-gray-100 group-hover:bg-smartax-copper/20'
            }`}>
              <DocumentCheckIcon className={`h-6 w-6 ${
                cfdiValidationMode === 'single' ? 'text-white' : 'text-gray-600 group-hover:text-smartax-copper'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-smartax-display">Validación Individual</h3>
              <p className="text-sm text-gray-600 mt-1 font-smartax-secondary">Valida un CFDI específico por UUID</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setCfdiValidationMode('batch')}
          className={`p-6 rounded-xl border-2 transition-all duration-200 text-left group ${
            cfdiValidationMode === 'batch'
              ? 'border-smartax-copper bg-smartax-copper/10 shadow-lg'
              : 'border-gray-200 hover:border-smartax-copper/50 hover:shadow-md'
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${
              cfdiValidationMode === 'batch' ? 'bg-smartax-copper' : 'bg-gray-100 group-hover:bg-smartax-copper/20'
            }`}>
              <TableCellsIcon className={`h-6 w-6 ${
                cfdiValidationMode === 'batch' ? 'text-white' : 'text-gray-600 group-hover:text-smartax-copper'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-smartax-display">Validación Masiva</h3>
              <p className="text-sm text-gray-600 mt-1 font-smartax-secondary">Carga archivo Excel con múltiples CFDIs</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCfdiValidationMode('sat')}
          className={`p-6 rounded-xl border-2 transition-all duration-200 text-left group ${
            cfdiValidationMode === 'sat'
              ? 'border-smartax-copper bg-smartax-copper/10 shadow-lg'
              : 'border-gray-200 hover:border-smartax-copper/50 hover:shadow-md'
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${
              cfdiValidationMode === 'sat' ? 'bg-smartax-copper' : 'bg-gray-100 group-hover:bg-smartax-copper/20'
            }`}>
              <CloudIcon className={`h-6 w-6 ${
                cfdiValidationMode === 'sat' ? 'text-white' : 'text-gray-600 group-hover:text-smartax-copper'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-smartax-display">Obtener del SAT</h3>
              <p className="text-sm text-gray-600 mt-1 font-smartax-secondary">Descarga CFDIs directamente del portal SAT</p>
            </div>
          </div>
        </button>
      </div>

      {/* Single CFDI Mode */}
      {cfdiValidationMode === 'single' && (
        <div className="space-y-6">
          <div className="card">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Validar CFDI Individual</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UUID del CFDI *
                </label>
                <input
                  type="text"
                  value={singleCFDI.uuid}
                  onChange={(e) => setSingleCFDI(prev => ({ ...prev, uuid: e.target.value }))}
                  placeholder="12345678-1234-1234-1234-123456789ABC"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smartax-copper focus:border-transparent font-smartax-secondary"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-smartax-text">
                    RFC Emisor (Opcional)
                  </label>
                  <input
                    type="text"
                    value={singleCFDI.rfc}
                    onChange={(e) => setSingleCFDI(prev => ({ ...prev, rfc: e.target.value }))}
                    placeholder="XAXX010101000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smartax-copper focus:border-transparent font-smartax-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-smartax-text">
                    Monto Total (Opcional)
                  </label>
                  <input
                    type="number"
                    value={singleCFDI.amount}
                    onChange={(e) => setSingleCFDI(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="15000.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smartax-copper focus:border-transparent font-smartax-secondary"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (singleCFDI.uuid) {
                    const newRecord: CFDIRecord = {
                      uuid: singleCFDI.uuid,
                      rfc: singleCFDI.rfc || 'No especificado',
                      amount: parseFloat(singleCFDI.amount || '0'),
                      status: 'validating'
                    };
                    setCfdiRecords([newRecord]);
                    
                    // Simulate validation
                    setTimeout(() => {
                      const isValid = Math.random() > 0.3;
                      setCfdiRecords([{
                        ...newRecord,
                        status: isValid ? 'valid' : 'invalid',
                        error: isValid ? undefined : 'Certificado vencido o UUID no encontrado',
                        issuer: isValid ? 'Empresa Ejemplo S.A. de C.V.' : undefined,
                        date: isValid ? '2024-11-28' : undefined
                      }]);
                    }, 2000);
                  }
                }}
                disabled={!singleCFDI.uuid}
                className="smartax-button-primary w-full flex items-center justify-center space-x-2 py-3"
              >
                <DocumentCheckIcon className="h-5 w-5" />
                <span className="font-smartax-text">Validar CFDI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Excel Mode */}
      {cfdiValidationMode === 'batch' && (
        <div className="space-y-6">
          <div className="card">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Validación Masiva por Excel</h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-smartax-copper/10 rounded-lg border border-smartax-copper/30">
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-5 w-5 text-smartax-copper mt-0.5" />
                  <div>
                    <h5 className="text-sm font-medium text-smartax-blue-deep font-smartax-text">Formato Requerido</h5>
                    <p className="text-sm text-smartax-blue-graphite mt-1 font-smartax-secondary">
                      El archivo Excel debe contener las columnas: <strong>UUID</strong>, <strong>RFC_Emisor</strong>, <strong>Monto</strong>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="smartax-button-primary cursor-pointer w-full inline-block text-center py-3">
                  <TableCellsIcon className="h-5 w-5 mr-2 inline" />
                  <span className="font-smartax-text">Cargar Archivo Excel</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Simulate Excel processing
                        const excelData: CFDIRecord[] = [
                          { uuid: 'EXCEL-11111111-2222-3333-4444-555555555555', rfc: 'CLIENTE001ABC', amount: 15000, status: 'pending' },
                          { uuid: 'EXCEL-22222222-3333-4444-5555-666666666666', rfc: 'PROVEEDOR002XYZ', amount: 8500, status: 'pending' },
                          { uuid: 'EXCEL-33333333-4444-5555-6666-777777777777', rfc: 'DISTRIBUIDOR003', amount: 22000, status: 'pending' },
                          { uuid: 'EXCEL-44444444-5555-6666-7777-888888888888', rfc: 'EMPRESA004DEMO', amount: 5500, status: 'pending' },
                          { uuid: 'EXCEL-55555555-6666-7777-8888-999999999999', rfc: 'CORPORATIVO005', amount: 32000, status: 'pending' },
                        ];
                        setCfdiRecords(excelData);
                      }
                    }}
                  />
                </label>
                
                <button 
                  className="smartax-button-secondary w-full py-3"
                  onClick={() => {
                    // Simulate template download
                    const csvContent = "UUID,RFC_Emisor,Monto\n12345678-1234-1234-1234-123456789ABC,XAXX010101000,15000.00\n87654321-4321-4321-4321-CBA987654321,YBYY020202000,8500.50";
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'plantilla_cfdi.csv';
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  <span className="font-smartax-text">📥 Descargar Plantilla</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAT Mode */}
      {cfdiValidationMode === 'sat' && (
        <div className="space-y-6">
          <div className="card">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Obtener CFDIs del SAT</h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-smartax-warm rounded-lg border border-smartax-copper/30">
                <div className="flex items-start space-x-3">
                  <CloudIcon className="h-5 w-5 text-smartax-blue-deep mt-0.5" />
                  <div>
                    <h5 className="text-sm font-medium text-smartax-blue-deep font-smartax-text">Conexión Directa con SAT</h5>
                    <p className="text-sm text-smartax-blue-graphite mt-1 font-smartax-secondary">
                      Descarga automáticamente CFDIs usando tus credenciales CIEC y certificados configurados
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-smartax-text">
                    Fecha Desde
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smartax-copper focus:border-transparent font-smartax-secondary"
                    defaultValue={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-smartax-text">
                    Fecha Hasta
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smartax-copper focus:border-transparent font-smartax-secondary"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-smartax-text">
                  Tipo de CFDIs
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smartax-copper focus:border-transparent font-smartax-secondary">
                  <option value="all">📋 Todos los CFDIs</option>
                  <option value="received">📥 CFDIs Recibidos</option>
                  <option value="issued">📤 CFDIs Emitidos</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>Conexión SAT:</strong> Se requiere configuración activa. 
                    <button 
                      className="font-medium underline hover:no-underline ml-1 text-amber-700"
                      onClick={() => {
                        alert('Navegando a configuración de conexiones SAT...');
                      }}
                    >
                      Verificar configuración →
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsProcessingCFDI(true);
                  
                  // Simulate SAT data fetching with progress
                  setTimeout(() => {
                    const satCFDIs: CFDIRecord[] = [
                      { uuid: 'SAT-A1B2C3D4-E5F6-7890-ABCD-EF1234567890', rfc: 'EMISOR001ABC', amount: 18750, status: 'pending' },
                      { uuid: 'SAT-B2C3D4E5-F6G7-8901-BCDE-F23456789012', rfc: 'PROVEEDOR002', amount: 12350, status: 'pending' },
                      { uuid: 'SAT-C3D4E5F6-G7H8-9012-CDEF-345678901234', rfc: 'SERVICIOS003', amount: 25890, status: 'pending' },
                      { uuid: 'SAT-D4E5F6G7-H8I9-0123-DEFG-456789012345', rfc: 'COMERCIAL004', amount: 7650, status: 'pending' },
                      { uuid: 'SAT-E5F6G7H8-I9J0-1234-EFGH-567890123456', rfc: 'INDUSTRIA005', amount: 33420, status: 'pending' },
                      { uuid: 'SAT-F6G7H8I9-J0K1-2345-FGHI-678901234567', rfc: 'LOGISTICA006', amount: 14280, status: 'pending' },
                    ];
                    setCfdiRecords(satCFDIs);
                    setIsProcessingCFDI(false);
                  }, 3000);
                }}
                disabled={isProcessingCFDI}
                className="smartax-button-primary w-full flex items-center justify-center space-x-2 py-3"
              >
                {isProcessingCFDI ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="font-smartax-text">Conectando con SAT...</span>
                  </>
                ) : (
                  <>
                    <CloudIcon className="h-5 w-5" />
                    <span className="font-smartax-text">Obtener CFDIs del SAT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional CFDI Results Table */}
      {cfdiRecords.length > 0 && (
        <div className="card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                Resultados de CFDIs ({cfdiRecords.length})
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {cfdiValidationMode === 'batch' && 'Datos cargados desde Excel'} 
                {cfdiValidationMode === 'sat' && 'Obtenidos del portal SAT'}
                {cfdiValidationMode === 'single' && 'Validación individual'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {cfdiRecords.some(r => r.status === 'pending') && (
                <button
                  onClick={validateAllCFDI}
                  disabled={isProcessingCFDI}
                  className="smartax-button-primary flex items-center space-x-2"
                >
                  {isProcessingCFDI ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <CheckCircleIcon className="h-4 w-4" />
                  )}
                  <span className="font-smartax-text">Validar Todos</span>
                </button>
              )}
              
              {cfdiRecords.some(r => r.status !== 'pending') && (
                <button
                  onClick={() => {
                    // Generate Excel with results
                    const headers = ['UUID', 'RFC_Emisor', 'Monto', 'Estado', 'Error', 'Fecha_Validacion'];
                    const rows = cfdiRecords.map(record => [
                      record.uuid,
                      record.rfc,
                      record.amount,
                      record.status === 'valid' ? 'VÁLIDO' : record.status === 'invalid' ? 'INVÁLIDO' : 'PENDIENTE',
                      record.error || '',
                      record.date || new Date().toISOString().split('T')[0]
                    ]);
                    
                    const csvContent = [headers, ...rows]
                      .map(row => row.map(field => `"${field}"`).join(','))
                      .join('\n');
                    
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `cfdi_resultados_${new Date().getTime()}.csv`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                  className="smartax-button-secondary flex items-center space-x-2"
                >
                  <DocumentArrowUpIcon className="h-4 w-4" />
                  <span className="font-smartax-text">Descargar Excel</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Summary Cards */}
          {cfdiRecords.some(r => r.status !== 'pending') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {cfdiRecords.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">
                  {cfdiRecords.filter(r => r.status === 'valid').length}
                </div>
                <div className="text-sm text-gray-600">Válidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-danger-600">
                  {cfdiRecords.filter(r => r.status === 'invalid').length}
                </div>
                <div className="text-sm text-gray-600">Inválidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning-600">
                  {cfdiRecords.filter(r => r.status === 'validating' || r.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
            </div>
          )}
          
          {/* Professional Data Table */}
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      UUID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RFC Emisor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detalles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cfdiRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {record.status === 'validating' && (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                              <span className="text-sm text-blue-600 font-medium">Validando...</span>
                            </div>
                          )}
                          {record.status === 'valid' && (
                            <div className="flex items-center">
                              <CheckCircleIcon className="h-5 w-5 text-success-600 mr-2" />
                              <span className="text-sm text-success-600 font-medium">Válido</span>
                            </div>
                          )}
                          {record.status === 'invalid' && (
                            <div className="flex items-center">
                              <ExclamationTriangleIcon className="h-5 w-5 text-danger-600 mr-2" />
                              <span className="text-sm text-danger-600 font-medium">Inválido</span>
                            </div>
                          )}
                          {record.status === 'pending' && (
                            <div className="flex items-center">
                              <div className="h-5 w-5 bg-gray-300 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-500 font-medium">Pendiente</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono text-gray-900 truncate max-w-xs">
                          {record.uuid}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.rfc}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          ${record.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {record.issuer && (
                            <div className="mb-1">
                              <span className="font-medium">Emisor:</span> {record.issuer}
                            </div>
                          )}
                          {record.date && (
                            <div className="mb-1">
                              <span className="font-medium">Fecha:</span> {record.date}
                            </div>
                          )}
                          {record.error && (
                            <div className="text-danger-600 text-xs">
                              <span className="font-medium">Error:</span> {record.error}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {record.status === 'pending' && (
                            <button
                              onClick={() => removeCFDIRecord(index)}
                              className="text-danger-600 hover:text-danger-900"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                          {(record.status === 'valid' || record.status === 'invalid') && (
                            <button className="text-primary-600 hover:text-primary-900 text-xs">
                              Ver Detalles
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderFiscalSimulator = () => {

    const industries = {
      general: { name: 'General', multiplier: 1.0 },
      technology: { name: 'Tecnología', multiplier: 1.15 },
      manufacturing: { name: 'Manufactura', multiplier: 1.25 },
      services: { name: 'Servicios', multiplier: 1.1 },
      retail: { name: 'Comercio', multiplier: 1.05 },
      construction: { name: 'Construcción', multiplier: 1.3 },
      healthcare: { name: 'Salud', multiplier: 1.2 }
    };

    const optimizationStrategies = {
      acceleratedDepreciation: {
        name: 'Depreciación Acelerada',
        description: 'Acelerar la depreciación de activos fijos para reducir la base gravable',
        impact: 'Alto',
        saving: (income: number) => income * 0.08,
        requirements: ['Activos adquiridos en el ejercicio', 'Documentación contable completa']
      },
      trainingDeductions: {
        name: 'Deducciones de Capacitación',
        description: 'Maximizar deducciones por programas de capacitación del personal',
        impact: 'Medio',
        saving: (income: number) => Math.min(income * 0.05, 200000),
        requirements: ['Programas certificados', 'Constancias de participación']
      },
      researchCredits: {
        name: 'Créditos por I+D',
        description: 'Aprovechamiento de créditos fiscales por investigación y desarrollo',
        impact: 'Alto',
        saving: (income: number) => income * 0.12,
        requirements: ['Proyectos de investigación', 'Documentación técnica']
      },
      energyEfficiency: {
        name: 'Inversiones Verdes',
        description: 'Deducciones especiales por inversiones en eficiencia energética',
        impact: 'Alto',
        saving: (income: number) => income * 0.06,
        requirements: ['Certificaciones ambientales', 'Equipos calificados']
      },
      charityDeductions: {
        name: 'Donativos Deducibles',
        description: 'Optimización fiscal a través de donativos autorizados',
        impact: 'Medio',
        saving: (income: number) => Math.min(income * 0.07, 500000),
        requirements: ['Donatarias autorizadas', 'Recibos deducibles']
      }
    };

    const generateAIRecommendations = async () => {
      setIsAnalyzing(true);
      
      // Simular análisis de IA
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const income = parseFloat(scenarioData.currentSituation.income) || 0;
      const expenses = parseFloat(scenarioData.currentSituation.expenses) || 0;
      const currentTax = parseFloat(scenarioData.currentSituation.currentTax) || 0;
      
      // Calcular ahorros potenciales basados en optimizaciones seleccionadas
      let totalSavings = 0;
      const appliedOptimizations = [];
      
             Object.keys(scenarioData.optimizations).forEach(key => {
         if ((scenarioData.optimizations as any)[key]) {
           const strategy = (optimizationStrategies as any)[key];
           const saving = strategy.saving(income);
           totalSavings += saving;
           appliedOptimizations.push({
             ...strategy,
             estimatedSaving: saving
           });
         }
       });

      // Generar recomendaciones adicionales de IA
      const aiSuggestions = [
        {
          title: 'Reestructuración de Gastos',
          description: 'Reclasificar gastos operativos para maximizar deducciones',
          potentialSaving: income * 0.04,
          complexity: 'Medio',
          timeFrame: '2-3 meses'
        },
        {
          title: 'Planificación de Pagos',
          description: 'Optimizar timing de pagos para diferir impuestos',
          potentialSaving: currentTax * 0.15,
          complexity: 'Bajo',
          timeFrame: '1 mes'
        },
        {
          title: 'Análisis de Deducciones Perdidas',
          description: 'Identificar deducciones no aprovechadas en ejercicios anteriores',
          potentialSaving: income * 0.03,
          complexity: 'Alto',
          timeFrame: '4-6 meses'
        }
      ];

      const optimizedTax = Math.max(currentTax - totalSavings, 0);
             const industryMultiplier = (industries as any)[scenarioData.currentSituation.industry]?.multiplier || 1.0;
      const riskScore = income > 10000000 ? 'Alto' : income > 5000000 ? 'Medio' : 'Bajo';

      setScenarioData(prev => ({
        ...prev,
        results: {
          currentTax,
          optimizedTax,
          totalSavings,
          savingsPercentage: ((totalSavings / currentTax) * 100).toFixed(1),
          netBenefit: totalSavings * 0.85, // Considerando costos de implementación
          paybackPeriod: Math.ceil(totalSavings / (income * 0.02)), // meses
          appliedOptimizations
        },
        aiRecommendations: {
          riskAssessment: {
            level: riskScore,
            description: `Perfil de riesgo ${riskScore.toLowerCase()} basado en volumen de ingresos y complejidad fiscal`
          },
          suggestions: aiSuggestions,
          industryInsights: {
            multiplier: industryMultiplier,
            recommendation: industryMultiplier > 1.1 ? 
              'Tu industria tiene oportunidades adicionales de optimización fiscal' :
              'Considera diversificar hacia sectores con mayores beneficios fiscales'
          },
          nextSteps: [
            'Implementar estrategias de mayor impacto primero',
            'Documentar todos los cambios para auditorías',
            'Monitorear resultados trimestralmente',
            'Revisar nuevas oportunidades semestralmente'
          ]
        }
      }));

      setIsAnalyzing(false);
      setSimulatorStep(4);
    };

    const resetSimulator = () => {
      setSimulatorStep(1);
      setScenarioData({
        name: '',
        currentSituation: { income: '', expenses: '', currentTax: '', industry: 'general' },
        optimizations: {
          acceleratedDepreciation: false,
          trainingDeductions: false,
          researchCredits: false,
          energyEfficiency: false,
          charityDeductions: false
        },
        results: null,
        aiRecommendations: null
      });
      setIsAnalyzing(false);
    };

  return (
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Simulador Fiscal con IA</h3>
              <p className="text-gray-600">Optimización inteligente de cargas fiscales</p>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= simulatorStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Paso 1: Situación Actual */}
        {simulatorStep === 1 && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Situación Fiscal Actual</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Nombre del Escenario</label>
                  <input
                    type="text"
                    value={scenarioData.name}
                    onChange={(e) => setScenarioData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Optimización 2024"
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="label">Industria</label>
                  <select
                    value={scenarioData.currentSituation.industry}
                    onChange={(e) => setScenarioData(prev => ({
                      ...prev,
                      currentSituation: { ...prev.currentSituation, industry: e.target.value }
                    }))}
                    className="input"
                  >
                    {Object.entries(industries).map(([key, industry]) => (
                      <option key={key} value={key}>{industry.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Ingresos Anuales</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={scenarioData.currentSituation.income}
                      onChange={(e) => setScenarioData(prev => ({
                        ...prev,
                        currentSituation: { ...prev.currentSituation, income: e.target.value }
                      }))}
                      placeholder="5000000"
                      className="input pl-8"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Gastos Deducibles</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={scenarioData.currentSituation.expenses}
                      onChange={(e) => setScenarioData(prev => ({
                        ...prev,
                        currentSituation: { ...prev.currentSituation, expenses: e.target.value }
                      }))}
                      placeholder="3000000"
                      className="input pl-8"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="label">ISR Pagado Actualmente</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={scenarioData.currentSituation.currentTax}
                      onChange={(e) => setScenarioData(prev => ({
                        ...prev,
                        currentSituation: { ...prev.currentSituation, currentTax: e.target.value }
                      }))}
                      placeholder="600000"
                      className="input pl-8"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setSimulatorStep(2)}
                  disabled={!scenarioData.currentSituation.income || !scenarioData.currentSituation.currentTax}
                  className="btn-primary"
                >
                  Continuar a Optimizaciones
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Selección de Optimizaciones */}
        {simulatorStep === 2 && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Estrategias de Optimización</h4>
              <p className="text-gray-600 mb-6">Selecciona las estrategias fiscales que podrías implementar</p>
              
              <div className="space-y-4">
                {Object.entries(optimizationStrategies).map(([key, strategy]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <label className="flex items-start space-x-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scenarioData.optimizations[key]}
                        onChange={(e) => setScenarioData(prev => ({
                          ...prev,
                          optimizations: { ...prev.optimizations, [key]: e.target.checked }
                        }))}
                        className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h5 className="font-medium text-gray-900">{strategy.name}</h5>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            strategy.impact === 'Alto' ? 'bg-red-100 text-red-800' :
                            strategy.impact === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            Impacto {strategy.impact}
                          </span>
                          <span className="text-lg font-bold text-success-600">
                            {formatCurrency(strategy.saving(parseFloat(scenarioData.currentSituation.income) || 0))}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{strategy.description}</p>
                        <div>
                          <h6 className="text-sm font-medium text-gray-900 mb-1">Requisitos:</h6>
                          <ul className="text-sm text-gray-600">
                            {strategy.requirements.map((req, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => setSimulatorStep(1)}
                  className="btn-secondary"
                >
                  Regresar
                </button>
                <button
                  onClick={() => setSimulatorStep(3)}
                  className="btn-primary"
                >
                  Analizar con IA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Paso 3: Análisis con IA (Loading) */}
        {simulatorStep === 3 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-6"></div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Analizando con Inteligencia Artificial</h4>
            <div className="space-y-2 text-gray-600">
              <p>🧠 Procesando datos fiscales...</p>
              <p>📊 Calculando optimizaciones...</p>
              <p>💡 Generando recomendaciones personalizadas...</p>
              <p>🎯 Evaluando riesgos y oportunidades...</p>
            </div>
            
            <button
              onClick={generateAIRecommendations}
              className="btn-primary mt-8"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analizando...' : 'Iniciar Análisis IA'}
            </button>
          </div>
        )}

        {/* Paso 4: Resultados y Recomendaciones */}
        {simulatorStep === 4 && scenarioData.results && (
          <div className="space-y-8">
            {/* Resumen de Ahorros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatCurrency(scenarioData.results.currentTax)}
                </div>
                <div className="text-sm text-gray-600">ISR Actual</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(scenarioData.results.optimizedTax)}
                </div>
                <div className="text-sm text-gray-600">ISR Optimizado</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {formatCurrency(scenarioData.results.totalSavings)}
                </div>
                <div className="text-sm text-gray-600">Ahorro Total ({scenarioData.results.savingsPercentage}%)</div>
              </div>
            </div>

            {/* Estrategias Aplicadas */}
            <div className="card">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Estrategias Seleccionadas</h4>
              <div className="space-y-3">
                {scenarioData.results.appliedOptimizations.map((opt, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">{opt.name}</h5>
                      <p className="text-sm text-gray-600">{opt.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success-600">
                        {formatCurrency(opt.estimatedSaving)}
                      </div>
                      <div className="text-xs text-gray-500">Ahorro estimado</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendaciones de IA */}
            {scenarioData.aiRecommendations && (
              <div className="card">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <LightBulbIcon className="h-5 w-5 text-warning-500 mr-2" />
                  Recomendaciones Adicionales de IA
                </h4>
                
                <div className="space-y-4">
                  {scenarioData.aiRecommendations.suggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-medium text-gray-900">{suggestion.title}</h5>
                        <div className="text-right">
                          <div className="text-lg font-bold text-success-600">
                            {formatCurrency(suggestion.potentialSaving)}
                          </div>
                          <div className="text-xs text-gray-500">Ahorro potencial</div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{suggestion.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded-full ${
                          suggestion.complexity === 'Alto' ? 'bg-red-100 text-red-800' :
                          suggestion.complexity === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          Complejidad: {suggestion.complexity}
                        </span>
                        <span className="text-gray-600">⏱️ {suggestion.timeFrame}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Plan de Acción */}
            <div className="card">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Plan de Implementación</h4>
              <div className="space-y-3">
                {scenarioData.aiRecommendations?.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 p-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-900">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">Exportar Reporte Completo</button>
              <button className="btn-secondary">Programar Seguimiento</button>
              <button className="btn-secondary">Compartir Resultados</button>
              <button onClick={resetSimulator} className="btn-secondary">Nuevo Escenario</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTaxCalculatorModal = () => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Header with Draft Management */}
      <div className="sticky top-0 bg-white border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Calculadora Fiscal Empresarial</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={createNewDraft}
              className="btn-secondary text-sm flex items-center space-x-1"
            >
              <DocumentPlusIcon className="h-4 w-4" />
              <span>Nuevo</span>
            </button>
            {savedDrafts.length > 0 && (
              <select
                onChange={(e) => e.target.value && loadDraft(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value=""
              >
                <option value="">Cargar draft...</option>
                {savedDrafts.map(draft => (
                  <option key={draft.id} value={draft.id}>
                    {draft.name} ({new Date(draft.updatedAt).toLocaleDateString()})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre del cálculo"
            value={taxCalculation.name}
            onChange={(e) => setTaxCalculation(prev => ({ ...prev, name: e.target.value }))}
            className="input text-sm"
          />
          <select
            value={taxCalculation.fiscalYear}
            onChange={(e) => setTaxCalculation(prev => ({ ...prev, fiscalYear: e.target.value }))}
            className="input text-sm"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="flex items-center space-x-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={taxCalculation.isForDeclaration}
                onChange={(e) => setTaxCalculation(prev => ({ ...prev, isForDeclaration: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Para declaración</span>
            </label>
          </div>
        </div>
      </div>

      {/* Entity Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tipo de Contribuyente
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'moral', name: 'Persona Moral', description: 'Sociedades, corporaciones, asociaciones' },
            { id: 'fisica', name: 'Persona Física', description: 'Actividad empresarial, profesional' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setTaxCalculation(prev => ({ ...prev, entityType: type.id as 'fisica' | 'moral' }))}
              className={`p-4 text-left rounded-lg border-2 transition-colors ${
                taxCalculation.entityType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm text-gray-900">{type.name}</div>
              <div className="text-xs text-gray-600 mt-1">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Regime and Activity Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Régimen Fiscal
          </label>
          <select
            value={taxCalculation.regime}
            onChange={(e) => setTaxCalculation(prev => ({ ...prev, regime: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="general">General de Ley</option>
            <option value="resico">RESICO</option>
            {taxCalculation.entityType === 'fisica' && (
              <>
                <option value="incorporacion">Incorporación Fiscal</option>
                <option value="actividades">Actividades Empresariales</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Actividad Empresarial
          </label>
          <select
            value={taxCalculation.businessActivity}
            onChange={(e) => setTaxCalculation(prev => ({ ...prev, businessActivity: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="general">Actividades Generales</option>
            <option value="commerce">Comercio</option>
            <option value="manufacturing">Manufactura</option>
            <option value="services">Servicios</option>
            <option value="construction">Construcción</option>
            <option value="transportation">Transporte</option>
            <option value="technology">Tecnología</option>
            <option value="beverages">Bebidas</option>
            <option value="tobacco">Tabaco</option>
            <option value="fuels">Combustibles</option>
          </select>
        </div>
      </div>

      {/* Basic Financial Data */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Datos Financieros Básicos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período de Cálculo
            </label>
            <select
              value={taxCalculation.basicData.period}
              onChange={(e) => setTaxCalculation(prev => ({ 
                ...prev, 
                basicData: { ...prev.basicData, period: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="monthly">Mensual</option>
              <option value="annual">Anual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingresos {taxCalculation.basicData.period === 'monthly' ? 'Mensuales' : 'Anuales'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={taxCalculation.basicData.income}
                onChange={(e) => setTaxCalculation(prev => ({ 
                  ...prev, 
                  basicData: { ...prev.basicData, income: e.target.value }
                }))}
                placeholder="5000000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gastos Operativos
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={taxCalculation.basicData.expenses}
                onChange={(e) => setTaxCalculation(prev => ({ 
                  ...prev, 
                  basicData: { ...prev.basicData, expenses: e.target.value }
                }))}
                placeholder="3000000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deducciones Autorizadas
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={taxCalculation.basicData.deductions}
                onChange={(e) => setTaxCalculation(prev => ({ 
                  ...prev, 
                  basicData: { ...prev.basicData, deductions: e.target.value }
                }))}
                placeholder="500000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Corporate Data */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Datos Avanzados Empresariales</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activos Fijos
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={taxCalculation.advancedData.assets}
                onChange={(e) => setTaxCalculation(prev => ({ 
                  ...prev, 
                  advancedData: { ...prev.advancedData, assets: e.target.value }
                }))}
                placeholder="2000000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Depreciación del Ejercicio
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={taxCalculation.advancedData.depreciation}
                onChange={(e) => setTaxCalculation(prev => ({ 
                  ...prev, 
                  advancedData: { ...prev.advancedData, depreciation: e.target.value }
                }))}
                placeholder="200000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Empleados
            </label>
            <input
              type="number"
              value={taxCalculation.advancedData.employees}
              onChange={(e) => setTaxCalculation(prev => ({ 
                ...prev, 
                advancedData: { ...prev.advancedData, employees: e.target.value }
              }))}
              placeholder="25"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inventario Inicial
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={taxCalculation.advancedData.inventoryStart}
                onChange={(e) => setTaxCalculation(prev => ({ 
                  ...prev, 
                  advancedData: { ...prev.advancedData, inventoryStart: e.target.value }
                }))}
                placeholder="800000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inventario Final
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={taxCalculation.advancedData.inventoryEnd}
                onChange={(e) => setTaxCalculation(prev => ({ 
                  ...prev, 
                  advancedData: { ...prev.advancedData, inventoryEnd: e.target.value }
                }))}
                placeholder="600000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pagos Provisionales
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={taxCalculation.advancedData.provisionalPayments}
                onChange={(e) => setTaxCalculation(prev => ({ 
                  ...prev, 
                  advancedData: { ...prev.advancedData, provisionalPayments: e.target.value }
                }))}
                placeholder="150000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retenciones
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={taxCalculation.advancedData.retentions}
                onChange={(e) => setTaxCalculation(prev => ({ 
                  ...prev, 
                  advancedData: { ...prev.advancedData, retentions: e.target.value }
                }))}
                placeholder="50000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PTU Pagado
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={taxCalculation.advancedData.ptuPaid}
                onChange={(e) => setTaxCalculation(prev => ({ 
                  ...prev, 
                  advancedData: { ...prev.advancedData, ptuPaid: e.target.value }
                }))}
                placeholder="80000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingresos del Extranjero
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={taxCalculation.advancedData.foreignIncome}
                onChange={(e) => setTaxCalculation(prev => ({ 
                  ...prev, 
                  advancedData: { ...prev.advancedData, foreignIncome: e.target.value }
                }))}
                placeholder="0"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={calculateAdvancedTaxes}
          className="btn-primary flex items-center justify-center space-x-2 flex-1"
          disabled={!taxCalculation.basicData.income}
        >
          <CalculatorIcon className="h-4 w-4" />
          <span>Calcular Impuestos</span>
        </button>
        
        <button
          onClick={saveDraft}
          className="btn-secondary flex items-center space-x-2"
          disabled={!taxCalculation.name}
        >
          <DocumentIcon className="h-4 w-4" />
          <span>Guardar</span>
        </button>

        {selectedDraftId && (
          <button
            onClick={() => deleteDraft(selectedDraftId)}
            className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results Section */}
      {taxCalculation.result && (
        <div className="space-y-6 border-t border-gray-200 pt-6">
          {/* Enhanced Summary Card */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white rounded-xl">
            <h4 className="font-bold text-xl mb-4">Resultado del Cálculo Fiscal</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Ingresos:</span>
                  <span className="font-bold">${parseFloat(taxCalculation.basicData.income).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Gastos:</span>
                  <span className="font-bold">${parseFloat(taxCalculation.basicData.expenses || '0').toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Base Gravable:</span>
                  <span className="font-bold">${(parseFloat(taxCalculation.basicData.income) - parseFloat(taxCalculation.basicData.expenses || '0') - parseFloat(taxCalculation.basicData.deductions || '0')).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">ISR:</span>
                  <span className="font-bold text-red-300">${taxCalculation.result.isr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">IVA:</span>
                  <span className="font-bold text-red-300">${taxCalculation.result.iva.toLocaleString()}</span>
                </div>
                {taxCalculation.result.ptu > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">PTU:</span>
                    <span className="font-bold text-orange-300">${taxCalculation.result.ptu.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Tasa Efectiva:</span>
                  <span className="font-bold">{taxCalculation.result.effectiveRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between border-t border-gray-600 pt-3">
                  <span className="font-bold">Total Impuestos:</span>
                  <span className="text-2xl font-black text-red-300">${taxCalculation.result.totalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Ingreso Neto:</span>
                  <span className="text-2xl font-black text-green-300">${taxCalculation.result.netIncome.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {taxCalculation.result.recommendations && taxCalculation.result.recommendations.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-3">Recomendaciones Fiscales</h5>
              <ul className="space-y-2 text-sm text-blue-800">
                {taxCalculation.result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons for Results */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button 
              onClick={exportForDeclaration}
              className="btn-primary text-sm flex items-center justify-center space-x-1"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Exportar</span>
            </button>
            <button className="btn-secondary text-sm">
              Comparar Escenarios
            </button>
            <button className="btn-secondary text-sm">
              Programar Pago
            </button>
            <button className="btn-secondary text-sm">
              Ir a Declaración
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <InformationCircleIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Aviso Legal:</strong> Los cálculos son estimaciones basadas en la información proporcionada 
            y las tarifas fiscales vigentes. Para cálculos oficiales y estrategias fiscales específicas, 
            consulte con un contador público certificado. Esta herramienta no sustituye la asesoría profesional.
          </div>
        </div>
      </div>
    </div>
  );

  const renderModalContent = () => {
    switch (activeModal?.id) {
      case 'upload-document':
        return renderUploadModal();
      case 'validate-cfdi':
        return renderCFDIValidationModal();
      case 'calculate-taxes':
        return renderTaxCalculatorModal();
      case 'create-declaration':
        return (
          <div className="text-center py-8">
            <DocumentPlusIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Crear Nueva Declaración</h3>
            <p className="text-gray-600 mb-4">Esta funcionalidad te redirigirá al módulo de cumplimiento</p>
            <button className="btn-primary">Ir a Cumplimiento</button>
          </div>
        );
      case 'analyze-scenario':
        return renderFiscalSimulator();
      case 'pay-taxes':
        return (
          <div className="text-center py-8">
            <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pagar Impuestos</h3>
            <p className="text-gray-600 mb-4">Integración con métodos de pago disponible próximamente</p>
            <button className="btn-secondary" disabled>Próximamente</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {quickActions.map((action, index) => {
        const Icon = action.icon;
        
        return (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
              onClick={() => openModal(action.id)}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-soft transition-all duration-200 text-left group"
          >
            <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {action.title}
            </h3>
            <p className="text-xs text-gray-600">
              {action.description}
            </p>
          </motion.button>
        );
      })}
    </div>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{activeModal.title}</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6">
                {renderModalContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 