'use client';

import { motion } from 'framer-motion';
import { 
  BellIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function AlertsModule() {
  const mockAlerts = [
    {
      id: 1,
      type: 'error',
      title: 'Factura sin complemento de pago',
      message: 'La factura A001 requiere complemento de pago para cumplir con normativas SAT',
      time: '2 horas',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Declaración próxima a vencer',
      message: 'La declaración mensual de ISR vence en 3 días hábiles',
      time: '4 horas',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Actualización normativa',
      message: 'Nuevos requisitos de facturación electrónica vigentes desde enero 2024',
      time: '1 día',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Declaración procesada',
      message: 'La declaración de noviembre ha sido procesada exitosamente',
      time: '2 días',
      read: true
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ExclamationTriangleIcon className="h-6 w-6 text-smartax-copper" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-smartax-terracotta" />;
      case 'info':
        return <InformationCircleIcon className="h-6 w-6 text-smartax-blue-graphite" />;
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-smartax-copper" />;
      default:
        return <BellIcon className="h-6 w-6 text-smartax-blue-graphite" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-l-smartax-copper bg-smartax-copper/5';
      case 'warning':
        return 'border-l-smartax-terracotta bg-smartax-terracotta/5';
      case 'info':
        return 'border-l-smartax-blue-graphite bg-smartax-blue-graphite/5';
      case 'success':
        return 'border-l-smartax-copper bg-smartax-copper/5';
      default:
        return 'border-l-smartax-blue-graphite bg-smartax-blue-graphite/5';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-smartax-display font-bold text-smartax-blue-prussia">
          Centro de Alertas
        </h1>
        <button className="smartax-button-secondary">
          Marcar todas como leídas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="smartax-card text-center p-6">
          <div className="text-3xl font-smartax-display font-bold text-smartax-copper mb-2">
            2
          </div>
          <div className="text-sm font-smartax-secondary text-smartax-blue-graphite">Alertas Críticas</div>
        </div>
        
        <div className="smartax-card text-center p-6">
          <div className="text-3xl font-smartax-display font-bold text-smartax-terracotta mb-2">
            1
          </div>
          <div className="text-sm font-smartax-secondary text-smartax-blue-graphite">Advertencias</div>
        </div>
        
        <div className="smartax-card text-center p-6">
          <div className="text-3xl font-smartax-display font-bold text-smartax-blue-graphite mb-2">
            1
          </div>
          <div className="text-sm font-smartax-secondary text-smartax-blue-graphite">Informativas</div>
        </div>
        
        <div className="smartax-card text-center p-6">
          <div className="text-3xl font-smartax-display font-bold text-smartax-copper mb-2">
            4
          </div>
          <div className="text-sm font-smartax-secondary text-smartax-blue-graphite">Total</div>
        </div>
      </div>

      <div className="smartax-card">
        <div className="border-b border-smartax-blue-graphite/20 pb-4 mb-6">
          <h2 className="text-lg font-smartax-text font-semibold text-smartax-blue-prussia">
            Alertas Recientes
          </h2>
        </div>
        
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: alert.id * 0.1 }}
              className={`border-l-4 p-4 rounded-r-lg ${getAlertColor(alert.type)} ${
                !alert.read ? 'shadow-sm' : 'opacity-75'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-smartax-text font-semibold text-smartax-blue-prussia">
                        {alert.title}
                      </h3>
                      {!alert.read && (
                        <span className="w-2 h-2 bg-smartax-copper rounded-full"></span>
                      )}
                    </div>
                    <p className="font-smartax-secondary text-smartax-blue-graphite mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center space-x-4 text-xs font-smartax-secondary text-smartax-blue-graphite/70">
                      <span>Hace {alert.time}</span>
                      <span>•</span>
                      <span>{alert.type === 'error' ? 'Crítica' : 
                           alert.type === 'warning' ? 'Advertencia' :
                           alert.type === 'info' ? 'Informativa' : 'Completada'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!alert.read && (
                    <button className="smartax-button-secondary text-xs px-3 py-1">
                      Marcar leída
                    </button>
                  )}
                  <button className="p-1 text-smartax-blue-graphite/50 hover:text-smartax-blue-graphite transition-colors">
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="smartax-card">
        <h3 className="text-lg font-smartax-text font-semibold text-smartax-blue-prussia mb-4">
          Configuración de Alertas
        </h3>
        <div className="space-y-4">
          {[
            { id: 'vencimientos', label: 'Alertas de vencimientos', enabled: true },
            { id: 'errores', label: 'Errores de validación', enabled: true },
            { id: 'normativas', label: 'Actualizaciones normativas', enabled: false },
            { id: 'declaraciones', label: 'Recordatorios de declaraciones', enabled: true },
          ].map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <span className="font-smartax-secondary text-smartax-blue-graphite">
                {setting.label}
              </span>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  setting.enabled ? 'bg-smartax-copper' : 'bg-smartax-blue-graphite/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    setting.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default AlertsModule; 