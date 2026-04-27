import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, LineChart, Sun, Moon, LogOut, Settings } from 'lucide-react';

export default function AppLayout({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) {
    const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
        isActive 
            ? 'bg-indigo-50 text-indigo-700 dark:bg-[#27272A] dark:text-white' 
            : 'text-gray-500 dark:text-[#A1A1AA] hover:bg-gray-100 dark:hover:bg-[#18181B]'
    }`;
  return (
    <div className="flex h-screen bg-background text-text-main transition-colors">
      
      <aside className="w-64 flex flex-col border-r border-border bg-surface transition-colors">
        <div className="p-6 text-xl font-bold flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 dark:bg-white rounded-sm"></div>
            Applytics
        </div>

        <nav className="flex-1 px-4 space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Main</div>
            
            <NavLink to="/" className={navLinkClasses}>
                <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            
            <NavLink to="/boards" className={navLinkClasses}>
                <Kanban size={18} /> Boards
            </NavLink>
            
            <NavLink to="/insights" className={navLinkClasses}>
                <LineChart size={18} /> Insights
            </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-dark-border">
            <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-top text-gray-600 dark:text-gray-400 transition-colors">
                {isDark ? <Sun size={18} /> : <Moon size={18} />} 
                {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-top text-gray-600 dark:text-gray-400 transition-colors">
                <Settings size={18} /> Settings
            </button>
            <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-top text-gray-600 dark:text-gray-400 transition-colors">
                <LogOut size={18} /> Log Out
            </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet /> 
      </main>

    </div>
  );
}