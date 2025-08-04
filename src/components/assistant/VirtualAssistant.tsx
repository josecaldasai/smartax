'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { mockChatMessages } from '@/lib/mockData';

interface VirtualAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VirtualAssistant({ isOpen, onClose }: VirtualAssistantProps) {
  const [messages, setMessages] = useState(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      message: newMessage,
      sender: 'user' as const,
      timestamp: new Date(),
      type: 'text' as const,
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simular respuesta del asistente
    setTimeout(() => {
      const responses = [
        'Te ayudo con esa consulta fiscal. Déjame revisar la información más reciente.',
        'Basado en tu situación fiscal actual, te recomiendo revisar las siguientes opciones.',
        'Puedo generar un reporte detallado sobre ese tema. ¿Te gustaría que lo haga?',
        'Esa es una excelente pregunta. La normativa fiscal mexicana establece que...',
      ];
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        message: responses[Math.floor(Math.random() * responses.length)],
        sender: 'assistant' as const,
        timestamp: new Date(),
        type: 'text' as const,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 320 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 320 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed right-0 top-0 h-full w-80 bg-smartax-ivory shadow-2xl border-l border-smartax-blue-graphite/20 z-50 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-smartax-blue-graphite/20 bg-gradient-smartax-primary">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-smartax-ivory/20 rounded-full flex items-center justify-center animate-smartax-glow">
                  <SparklesIcon className="h-5 w-5 text-smartax-ivory" />
                </div>
                <div>
                  <h3 className="text-smartax-ivory font-smartax-text font-semibold">Asistente Fiscal IA</h3>
                  <p className="text-smartax-ivory/80 font-smartax-secondary text-sm">Siempre disponible</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-smartax-ivory/10 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-smartax-ivory" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-smartax-warm text-smartax-ivory shadow-sm'
                      : 'bg-smartax-blue-graphite/10 text-smartax-blue-graphite border border-smartax-blue-graphite/20'
                  }`}
                >
                  <p className="text-sm font-smartax-secondary leading-relaxed">{message.message}</p>
                  <p className={`text-xs font-smartax-secondary mt-2 ${
                    message.sender === 'user' ? 'text-smartax-ivory/80' : 'text-smartax-blue-graphite/70'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('es-MX', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-smartax-blue-graphite/10 border border-smartax-blue-graphite/20 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-smartax-copper rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-smartax-copper rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-smartax-copper rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-smartax-blue-graphite/20 bg-smartax-blue-graphite/5">
            <h4 className="text-xs font-smartax-text font-medium text-smartax-blue-graphite/80 mb-2">Consultas frecuentes:</h4>
            <div className="flex flex-wrap gap-2">
              {[
                '¿Cuándo vencen mis declaraciones?',
                'Calcular ISR estimado',
                'Validar mis CFDI',
                'Optimizar deducciones',
              ].map((quickAction) => (
                <button
                  key={quickAction}
                  onClick={() => setNewMessage(quickAction)}
                  className="text-xs font-smartax-secondary px-3 py-1 bg-smartax-ivory border border-smartax-blue-graphite/30 rounded-full hover:bg-smartax-copper/10 hover:border-smartax-copper/50 hover:text-smartax-copper transition-colors text-smartax-blue-graphite"
                >
                  {quickAction}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-smartax-blue-graphite/20">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu consulta fiscal..."
                className="flex-1 px-3 py-2 border border-smartax-blue-graphite/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-smartax-copper focus:border-transparent text-sm font-smartax-secondary text-smartax-blue-graphite placeholder:text-smartax-blue-graphite/60 bg-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isTyping}
                className="p-2 bg-gradient-smartax-warm text-smartax-ivory rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 