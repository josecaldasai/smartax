'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onLogin: () => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular autenticación
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-smartax-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mx-auto h-20 w-20 bg-gradient-smartax-warm rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-smartax-glow">
            <svg className="h-12 w-12 text-smartax-ivory" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-smartax-display font-bold text-smartax-blue-prussia mb-2">
            Bienvenido a SmarTax AI
          </h2>
          <p className="text-smartax-blue-graphite font-smartax-secondary text-lg">
            Gestión fiscal inteligente para tu PyME
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="smartax-card p-8"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-smartax-text font-medium text-smartax-blue-prussia mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-smartax-blue-graphite/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-smartax-copper focus:border-transparent bg-smartax-ivory font-smartax-secondary placeholder:text-smartax-blue-graphite/60 text-smartax-blue-graphite"
                placeholder="maria@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-smartax-text font-medium text-smartax-blue-prussia mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 pr-10 border border-smartax-blue-graphite/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-smartax-copper focus:border-transparent bg-smartax-ivory font-smartax-secondary placeholder:text-smartax-blue-graphite/60 text-smartax-blue-graphite"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-smartax-blue-graphite/60" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-smartax-blue-graphite/60" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-smartax-copper focus:ring-smartax-copper border-smartax-blue-graphite/30 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-smartax-secondary text-smartax-blue-graphite">
                  Recordarme
                </label>
              </div>

              <button
                type="button"
                className="text-sm text-smartax-copper hover:text-smartax-copper font-smartax-secondary font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="smartax-button-primary w-full relative flex justify-center items-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-smartax-ivory mr-2"></div>
                  <span className="font-smartax-text">Iniciando sesión...</span>
                </div>
              ) : (
                <span className="font-smartax-text">Iniciar Sesión</span>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-smartax-blue-graphite/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-smartax-ivory text-smartax-blue-graphite/70 font-smartax-secondary">¿Nuevo en SmarTax AI?</span>
              </div>
            </div>

            <button
              type="button"
              className="smartax-button-secondary w-full mt-4"
            >
              <span className="font-smartax-text">Crear cuenta empresarial</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-smartax-blue-graphite/70 font-smartax-secondary">
            Al continuar, aceptas nuestros{' '}
            <a href="#" className="text-smartax-copper hover:text-smartax-copper font-medium">
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a href="#" className="text-smartax-copper hover:text-smartax-copper font-medium">
              Política de Privacidad
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
} 