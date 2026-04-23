import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConversionDashboard } from './components/ConversionDashboard';
import { InsightsPage } from './pages/InsightsPage';

function App() {
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
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-[#09090B] transition-colors duration-200">
        
        <button 
            onClick={() => setIsDark(!isDark)}
            className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] shadow-lg text-gray-800 dark:text-white"
        >
            {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>

        <Routes>
          <Route path="/" element={<ConversionDashboard />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;