'use client';

import { motion } from 'framer-motion';
import { CogIcon } from '@heroicons/react/24/outline';
import { mockAlerts } from '@/lib/mockData';

export default function RecentAlerts() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Alertas Recientes</h3>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <CogIcon className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-3">
        {mockAlerts.slice(0, 3).map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-3 rounded-lg bg-orange-50 border border-orange-200"
          >
            <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 