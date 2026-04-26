import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
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
    <div className="dark:bg-background flex h-screen min-h-screen bg-gray-50 text-sm text-black transition-colors duration-200 dark:text-white">
      {/* this is sidebar component */}
      <aside className="bg-background w-56 text-gray-400 h-full">
        <Sidebar isDark={isDark} setIsDark={setIsDark} />
      </aside>
      {/* main window wil be here */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
