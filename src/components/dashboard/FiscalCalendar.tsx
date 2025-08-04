'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { mockCalendarEvents } from '@/lib/mockData';

export default function FiscalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventsForDay = (day: Date) => {
    return mockCalendarEvents.filter(event => 
      isSameDay(new Date(event.date), day)
    );
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'deadline':
        return 'bg-danger-500';
      case 'meeting':
        return 'bg-primary-500';
      case 'reminder':
        return 'bg-warning-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-danger-200 bg-danger-50';
      case 'medium':
        return 'border-warning-200 bg-warning-50';
      case 'low':
        return 'border-primary-200 bg-primary-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <CalendarDaysIcon className="h-5 w-5 mr-2 text-primary-600" />
          Calendario Fiscal
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
          </button>
          <h4 className="text-sm font-medium text-gray-900 min-w-[120px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h4>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day, index) => {
          const events = getEventsForDay(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isDayToday = isToday(day);
          
          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              className={`min-h-[60px] p-1 border rounded-lg relative ${
                isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
              } ${isDayToday ? 'ring-2 ring-primary-500' : ''}`}
            >
              <div className={`text-xs font-medium mb-1 ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              } ${isDayToday ? 'text-primary-600' : ''}`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {events.slice(0, 2).map((event, eventIndex) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded text-white truncate ${getEventColor(event.type)}`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {events.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{events.length - 2}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Upcoming Events */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Próximos Eventos</h4>
        <div className="space-y-2">
          {mockCalendarEvents
            .filter(event => new Date(event.date) >= new Date())
            .slice(0, 3)
            .map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${getPriorityColor(event.priority)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getEventColor(event.type)}`} />
                      <span className="text-sm font-medium text-gray-900">{event.title}</span>
                    </div>
                    {event.description && (
                      <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(event.date), 'dd MMM', { locale: es })}
                  </div>
                </div>
              </motion.div>
            ))
          }
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="btn-secondary w-full">
          Ver Calendario Completo
        </button>
      </div>
    </div>
  );
} 