'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  CloudArrowUpIcon,
  EyeIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  FunnelIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { mockDocuments } from '@/lib/mockData';

export default function DocumentsModule() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [documents, setDocuments] = useState(mockDocuments);

  const tabs = [
    { id: 'all', name: 'Todos los Documentos', count: documents.length },
    { id: 'invoices', name: 'Facturas', count: documents.filter(d => d.type === 'invoice').length },
    { id: 'receipts', name: 'Recibos', count: documents.filter(d => d.type === 'receipt').length },
    { id: 'statements', name: 'Estados de Cuenta', count: documents.filter(d => d.type === 'statement').length },
    { id: 'contracts', name: 'Contratos', count: documents.filter(d => d.type === 'contract').length },
  ];

  const categories = [
    'Gastos Generales',
    'Servicios',
    'Estados Financieros',
    'Compras',
    'Ventas',
    'Nómina',
    'Impuestos',
  ];

  const statusColors = {
    processed: 'bg-success-100 text-success-800',
    processing: 'bg-warning-100 text-warning-800',
    error: 'bg-danger-100 text-danger-800',
  };

  const statusLabels = {
    processed: 'Procesado',
    processing: 'Procesando',
    error: 'Error',
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return '📄';
      case 'receipt':
        return '🧾';
      case 'statement':
        return '📊';
      case 'contract':
        return '📋';
      default:
        return '📁';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || doc.type === activeTab.slice(0, -1);
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
    return matchesSearch && matchesTab && matchesCategory;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newDocument = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: 'other' as const,
          category: 'Sin Categorizar',
          uploadDate: new Date(),
          size: file.size,
          status: 'processing' as const,
          url: URL.createObjectURL(file),
          tags: ['nuevo'],
        };
        setDocuments(prev => [newDocument, ...prev]);
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Documentos</h1>
        <div className="flex items-center space-x-3">
          <label className="btn-primary cursor-pointer">
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            Subir Documentos
            <input
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.xml"
              onChange={handleFileUpload}
            />
          </label>
          <button className="btn-secondary">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filtros Avanzados
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar documentos, categorías, etiquetas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredDocuments.length} de {documents.length} documentos
            </span>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Fecha (más reciente)</option>
              <option>Nombre (A-Z)</option>
              <option>Tamaño (mayor)</option>
              <option>Estado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDocuments.map((document) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card hover:shadow-soft-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="text-2xl">{getFileIcon(document.type)}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {document.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[document.status]}`}>
                      {statusLabels[document.status]}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{document.category}</span>
                    <span>•</span>
                    <span>{formatFileSize(document.size)}</span>
                    <span>•</span>
                    <span>{new Date(document.uploadDate).toLocaleDateString('es-MX')}</span>
                  </div>
                  
                  {document.extractedData && (
                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-medium">Datos extraídos:</span>
                      {document.extractedData.total && (
                        <span className="ml-2">Total: ${document.extractedData.total.toLocaleString()}</span>
                      )}
                      {document.extractedData.rfc && (
                        <span className="ml-2">RFC: {document.extractedData.rfc}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {document.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full"
                      >
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                  <DocumentDuplicateIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-danger-600 transition-colors">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay documentos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'No se encontraron documentos que coincidan con tu búsqueda.' : 'Comienza subiendo tus primeros documentos.'}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{documents.length}</div>
          <div className="text-sm text-gray-600">Total Documentos</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">
            {documents.filter(d => d.status === 'processed').length}
          </div>
          <div className="text-sm text-gray-600">Procesados</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">
            {documents.filter(d => d.status === 'processing').length}
          </div>
          <div className="text-sm text-gray-600">En Proceso</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-600">
            {Math.round(documents.reduce((acc, doc) => acc + doc.size, 0) / 1024 / 1024)}MB
          </div>
          <div className="text-sm text-gray-600">Almacenamiento</div>
        </div>
      </div>
    </motion.div>
  );
} 