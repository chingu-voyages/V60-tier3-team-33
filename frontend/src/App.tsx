import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import { InsightsPage } from './pages/InsightsPage';
import Boards from './pages/Boards';
import { useState, useEffect } from 'react';


export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<div>Login Page Placeholder</div>} />
        <Route path="/register" element={<div>Register Page Placeholder</div>} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout isDark={isDark} setIsDark={setIsDark} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/boards" element={<Boards />} />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}