import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

interface LayoutProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}

function Layout({ isDark, setIsDark }: LayoutProps) {
  return (
    <div className="dark:bg-background flex h-screen overflow-hidden bg-gray-50 text-sm text-black transition-colors duration-200 dark:text-white">
      <aside className="bg-background w-56 shrink-0 text-gray-400 h-full">
        <Sidebar isDark={isDark} setIsDark={setIsDark} />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;