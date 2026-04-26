import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConversionDashboard } from "./components/ConversionDashboard";
import { InsightsPage } from "./pages/InsightsPage";
import Dashboard from "./pages/Dashboard";
import Boards from "./pages/Boards";

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") !== "light";
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <div className="text-sm dark:bg-background min-h-screen bg-gray-50 text-black transition-colors duration-200 dark:text-white">
        <button
          onClick={() => setIsDark(!isDark)}
          className="fixed right-4 bottom-4 z-50 rounded-full border border-gray-200 bg-white p-3 text-gray-800 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl active:scale-95 dark:border-[#3F3F46] dark:bg-[#18181B] dark:text-white dark:hover:bg-[#27272A]"
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
        <Dashboard />
        {/* <Boards /> */}
        {/* <Routes>
       
          <Route path="/" element={<ConversionDashboard />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
