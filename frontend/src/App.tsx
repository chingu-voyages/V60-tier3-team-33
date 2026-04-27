import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';

const ConversionDashboard = lazy(() => 
  import('./components/ConversionDashboard').then(module => ({ default: module.ConversionDashboard }))
);
const InsightsPage = lazy(() => 
  import('./pages/InsightsPage').then(module => ({ default: module.InsightsPage }))
);

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
      <Suspense fallback={<div className="flex h-screen items-center justify-center text-gray-500">Loading...</div>}>
        <Routes>
          <Route element={<AppLayout isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />}>
            <Route path="/" element={<ConversionDashboard />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;