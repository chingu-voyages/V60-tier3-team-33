import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sun,
  TrendingUp,
  User,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDashboard } from "./DashboardProvider";
import { authService } from "../api/auth";

type SideBarProps = {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
};

function Sidebar({ isDark, setIsDark }: SideBarProps) {
  const {applications} = useDashboard();
  const [isBoardsOpen, setIsBoardsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  const toggleBoards = () => {
    setIsBoardsOpen((prev) => !prev);
  };
  
const stats = useMemo(() => {
  return applications.reduce(
    (tally, app) => {
      tally.all += 1;
      tally[app.status as keyof typeof tally] =
        (tally[app.status as keyof typeof tally] || 0) + 1;
      if (app.favorite) tally.favorites += 1;
      return tally;
    },
    {
      all: 0,
      applied: 0,
      interviewing: 0,
      offer_received: 0,
      accepted: 0,
      rejected: 0,
      favorites: 0,
    },
  )
}, [applications]);

  return (
    <div className="flex h-screen flex-col bg-[#141414]">
      <div className="mb-5 text-xl font-bold">APPLYTICS</div>
      <nav className="flex flex-col justify-between border-t border-t-gray-400 px-3 overflow-auto">
        <p className="my-2 pt-3 text-xs tracking-widest uppercase">Main</p>
        <ul className="space-y-2">
          <NavLink 
            to="/dashboard" 
            className="flex w-full cursor-pointer rounded-lg p-2 text-left hover:bg-[#222222] hover:text-gray-100"
          >
            <LayoutDashboard size={18} className="mr-3" />
            Dashboard
          </NavLink>

          <li>
            <button
              className="flex w-full cursor-pointer items-center justify-between rounded-lg p-2 text-left hover:bg-[#222222] hover:text-gray-100"
              onClick={toggleBoards}
            >
              <div>
                <LayoutDashboard size={18} className="float-left mr-3" />
                Boards
              </div>
              <div>
                {isBoardsOpen ? (
                  <ChevronDown size={10} />
                ) : (
                  <ChevronRight size={10} />
                )}
              </div>
            </button>
            {isBoardsOpen && (
              <ul className="mt-2 ml-4 space-y-1 border-l border-l-gray-400 pl-4 text-xs">
                <NavLink to="/boards">
                  <li className="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left hover:bg-[#222222] hover:text-gray-100">
                    All
                    <span>{stats.all}</span>
                  </li>
                </NavLink>
                <NavLink to="/boards?status=applied">
                  <li className="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left hover:bg-[#222222] hover:text-gray-100">
                    Applied
                    <span>{stats.applied}</span>
                  </li>
                </NavLink>
                <NavLink to="/boards?status=interviewed">
                  <li className="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left hover:bg-[#222222] hover:text-gray-100">
                    Interviewed
                    <span>{stats.interviewing}</span>
                  </li>
                </NavLink>
                <NavLink to="/boards?status=offer">
                  <li className="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left hover:bg-[#222222] hover:text-gray-100">
                    Offer
                    <span>{stats.offer_received}</span>
                  </li>
                </NavLink>
                <NavLink to="/boards?status=rejected">
                  <li className="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left hover:bg-[#222222] hover:text-gray-100">
                    Rejected
                    <span>{stats.rejected}</span>
                  </li>
                </NavLink>
                <NavLink to="/boards?favorites=true">
                  <li className="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left hover:bg-[#222222] hover:text-gray-100">
                    Favorites
                    <span>{stats.favorites}</span>
                  </li>
                </NavLink>
              </ul>
            )}
          </li>
          <NavLink to="/insights">
            <li className="w-full cursor-pointer rounded-lg p-2 text-left hover:bg-[#222222] hover:text-gray-100">
              <TrendingUp size={18} className="float-left mr-3" />
              Insights
            </li>
          </NavLink>

          <NavLink to="/settings">
            <li className="w-full cursor-pointer rounded-lg p-2 text-left hover:bg-[#222222] hover:text-gray-100 flex items-center">
              <User size={18} className="mr-3 text-[#94A3B8]" />
              Account
            </li>
          </NavLink>
        </ul>
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-widest uppercase">Saved Links</p>
            <NavLink to="/settings" className="mr-2 text-gray-400 hover:text-white">
              +
            </NavLink>
          </div>
          <ul className="mt-2 space-y-1">
            {useDashboard().savedLinks.map((link) => (
              <li
                key={link.id}
                onClick={() => {
                  navigator.clipboard.writeText(link.url);
                  // Optional: add a toast or notification
                }}
                className="w-full cursor-pointer rounded-lg p-2 text-left text-sm text-gray-400 transition-colors hover:bg-[#222222] hover:text-gray-100"
                title={`Click to copy: ${link.url}`}
              >
                {link.label}
              </li>
            ))}
            {useDashboard().savedLinks.length === 0 && (
              <p className="px-2 text-xs text-gray-500 italic">No links yet</p>
            )}
          </ul>
        </div>
      </nav>

      <div className="mt-auto w-full border-t border-t-gray-400">
        <div className="flex flex-col gap-1 p-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-full cursor-pointer rounded-lg p-2 text-left hover:bg-[#222222] hover:text-gray-100"
          >
            {isDark ? (
              <>
                <Sun size={18} className="float-left mr-3" /> Light Mode
              </>
            ) : (
              <>
                <Moon size={18} className="float-left mr-3" /> Dark Mode
              </>
            )}
          </button>
          <NavLink 
            to="/settings"
            className={({ isActive }) => 
              `w-full cursor-pointer rounded-lg p-2 text-left hover:bg-[#222222] hover:text-gray-100 flex items-center ${isActive ? 'bg-[#222222] text-gray-100' : ''}`
            }
          >
            <Settings size={18} className="mr-3" />
            Settings
          </NavLink>
          <button 
            onClick={handleLogout}
            className="w-full cursor-pointer rounded-lg p-2 text-left hover:bg-[#222222] hover:text-gray-100"
          >
            <LogOut size={18} className="float-left mr-3" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
