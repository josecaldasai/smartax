'use client';

import { motion } from 'framer-motion';
import FiscalMetricsGrid from './FiscalMetricsGrid';
import FiscalHealthIndicator from './FiscalHealthIndicator';
import FiscalCalendar from './FiscalCalendar';
import PendingObligations from './PendingObligations';
import RecentAlerts from './RecentAlerts';
import QuickActions from './QuickActions';

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-smartax-primary rounded-2xl p-8 text-smartax-ivory"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-smartax-display font-bold mb-2">
              Buen día, María 👋
            </h1>
            <p className="text-smartax-ivory/80 font-smartax-secondary text-lg">
              Tu situación fiscal está optimizada. Tienes 2 obligaciones pendientes que requieren atención.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="bg-smartax-ivory/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-smartax-text font-bold text-smartax-ivory">85%</div>
                <div className="text-sm font-smartax-secondary text-smartax-ivory/80">Salud Fiscal</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <QuickActions />
      </motion.div>

      {/* Fiscal Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-smartax-text font-semibold text-smartax-blue-prussia mb-4">Métricas Fiscales</h2>
        <FiscalMetricsGrid />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Health Indicator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <FiscalHealthIndicator />
        </motion.div>

        {/* Right Column - Calendar and Obligations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          <FiscalCalendar />
          <PendingObligations />
        </motion.div>
      </div>

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <RecentAlerts />
      </motion.div>
    </div>
  );
} 