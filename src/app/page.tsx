'use client';

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Dashboard from '@/components/dashboard/Dashboard';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <LoginForm onLogin={handleLogin} />;
} 