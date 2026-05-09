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
  Copy,
  X
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDashboard } from "./DashboardProvider";
import { authService } from "../api/auth";

type SideBarProps = {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
};

function Sidebar({ isDark, setIsDark }: SideBarProps) {
  const { applications, savedLinks, setSavedLinks } = useDashboard();
  const [isBoardsOpen, setIsBoardsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const navItemBase = "flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left transition-colors";
  const navItemActive = "bg-[#222222] text-gray-100";
  const navItemInactive = "text-[#71717A] hover:bg-[#222222] hover:text-gray-100";
  const subItemBase = "flex w-full cursor-pointer items-center justify-between rounded px-2 py-[6px] text-left transition-colors";
  const subheaderStyles = "text-[10px] text-[#45454A] font-bold tracking-widest uppercase mb-2 mt-3 px-3";

  const isExactBoards = location.pathname === '/boards' && !location.search;
  const isApplied = location.search === '?status=applied';
  const isInterviewed = location.search === '?status=interviewed';
  const isOffer = location.search === '?status=offer';
  const isRejected = location.search === '?status=rejected';
  const isFavorites = location.search === '?favorites=true';

  return (
    <div className="flex h-screen flex-col bg-[#141414]">
      <div className="mb-5 px-3 pt-5 text-xl font-bold text-white">APPLYTICS</div>
      <nav className="flex flex-col justify-between border-t border-[#1E1F20] px-3 overflow-auto">
        <p className={subheaderStyles}>Main</p>
        <ul className="space-y-1">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
          >
            <LayoutDashboard size={18} className="mr-3" />
            Dashboard
          </NavLink>

          <li>
            <button
              className={`${navItemBase} justify-between ${location.pathname.startsWith('/boards') ? 'text-gray-100' : 'text-[#71717A] hover:bg-[#222222] hover:text-gray-100'}`}
              onClick={toggleBoards}
            >
              <div className="flex items-center">
                <LayoutDashboard size={18} className="mr-3" />
                Boards
              </div>
              <div>
                {isBoardsOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>
            </button>
            {isBoardsOpen && (
              <ul className="mt-1 ml-4 space-y-0.5 border-l border-[#1E1F20] pl-3 text-xs">
                <NavLink to="/boards">
                  <li className={`${subItemBase} ${isExactBoards ? navItemActive : navItemInactive}`}>
                    All
                    <span>{stats.all}</span>
                  </li>
                </NavLink>
                <NavLink to="/boards?status=applied">
                  <li className={`${subItemBase} ${isApplied ? navItemActive : navItemInactive}`}>
                    Applied
                    <span>{stats.applied}</span>
                  </li>
                </NavLink>
                <NavLink to="/boards?status=interviewed">
                  <li className={`${subItemBase} ${isInterviewed ? navItemActive : navItemInactive}`}>
                    Interviewed
                    <span>{stats.interviewing}</span>
                  </li>
                </NavLink>
                <NavLink to="/boards?status=offer">
                  <li className={`${subItemBase} ${isOffer ? navItemActive : navItemInactive}`}>
                    Offer
                    <span>{stats.offer_received}</span>
                  </li>
                </NavLink>
                <NavLink to="/boards?status=rejected">
                  <li className={`${subItemBase} ${isRejected ? navItemActive : navItemInactive}`}>
                    Rejected
                    <span>{stats.rejected}</span>
                  </li>
                </NavLink>
                <NavLink to="/boards?favorites=true">
                  <li className={`${subItemBase} ${isFavorites ? navItemActive : navItemInactive}`}>
                    Favorites
                    <span>{stats.favorites}</span>
                  </li>
                </NavLink>
              </ul>
            )}
          </li>
          <NavLink 
            to="/insights"
            className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
          >
            <TrendingUp size={18} className="mr-3" />
            Insights
          </NavLink>

          <NavLink 
            to="/settings"
            className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
          >
            <User size={18} className="mr-3" />
            Account
          </NavLink>
        </ul>

        <div className="mt-5">
          <div className="flex items-center justify-between pr-3">
            <p className={subheaderStyles}>Saved Links</p>
            <NavLink to="/settings" className="text-[#71717A] hover:text-white mt-1">
              +
            </NavLink>
          </div>
          <ul className="mt-1 flex flex-col gap-0.5">
            {savedLinks.map((link) => (
              <li
                key={link.id}
                className="group relative flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-[#71717A] transition-colors hover:bg-[#222222] hover:text-gray-100"
              >
                <span
                  className="truncate pr-14 flex-1"
                  onClick={() => navigator.clipboard.writeText(link.url)}
                  title={`Click to copy: ${link.url}`}
                >
                  {link.label}
                </span>
                <div className="absolute right-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 bg-[#222222] pl-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(link.url);
                    }}
                    className="p-1 hover:text-white"
                    title="Copy link"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSavedLinks((prev) => prev.filter((l) => l.id !== link.id));
                    }}
                    className="p-1 hover:text-red-400"
                    title="Delete link"
                  >
                    <X size={14} />
                  </button>
                </div>
              </li>
            ))}
            {savedLinks.length === 0 && (
              <p className="px-3 text-xs text-[#45454A] italic mt-1">No links yet</p>
            )}
          </ul>
        </div>
      </nav>

      <div className="mt-auto w-full border-t border-[#1E1F20]">
        <div className="flex flex-col gap-1 p-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className={navItemInactive + " px-3 py-2 rounded-lg flex items-center w-full"}
          >
            {isDark ? (
              <>
                <Sun size={18} className="mr-3" /> Light Mode
              </>
            ) : (
              <>
                <Moon size={18} className="mr-3" /> Dark Mode
              </>
            )}
          </button>
          <NavLink 
            to="/settings"
            className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
          >
            <Settings size={18} className="mr-3" />
            Settings
          </NavLink>
          <button 
            onClick={handleLogout}
            className={navItemInactive + " px-3 py-2 rounded-lg flex items-center w-full"}
          >
            <LogOut size={18} className="mr-3" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;