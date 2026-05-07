import {
  ChevronDown,
  ChevronRight,
  Copy,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sun,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDashboard } from "./DashboardProvider";
import { authService } from "../api/auth";
import logo from "../assets/applytics-logo.svg";

type SideBarProps = {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
};

function Sidebar({ isDark, setIsDark }: SideBarProps) {
  const { applications, savedLinks, removeSavedLink } = useDashboard();
  const [isBoardsOpen, setIsBoardsOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  const toggleBoards = () => {
    setIsBoardsOpen((prev) => !prev);
  };

  const handleCopyLink = (id: string | number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
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
    );
  }, [applications]);

  /** Shared style builder for main nav links */
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium text-left transition-colors ${
      isActive
        ? "bg-[#2A2A2A] text-white"
        : "text-[#71717A] hover:bg-[#1E1F20] hover:text-gray-100"
    }`;

  /** Shared style for board sub-items */
  const boardItemClass =
    "flex w-full cursor-pointer items-center justify-between rounded px-2 py-1.5 text-xs text-[#71717A] text-left hover:bg-[#1E1F20] hover:text-gray-200 transition-colors";

  return (
    <div className="flex h-screen flex-col bg-[#141414]">
      {/* Logo — same SVG as auth pages */}
      <div className="px-6 pt-8 pb-8">
        <img src={logo} alt="Applytics" className="h-6 w-auto" />
      </div>

      {/* Top divider */}
      <div className="mx-3 border-t border-[#1E1F20]" />

      <nav className="flex flex-1 flex-col justify-between px-3 overflow-auto">
        <div>
          {/* MAIN section */}
          <p className="px-3 pt-4 pb-2 text-[10px] font-semibold tracking-wider uppercase text-[#45454A]">
            Main
          </p>
          <ul className="space-y-1">
            {/* Dashboard */}
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard size={16} className="mr-3" />
              Dashboard
            </NavLink>

            {/* Boards (expandable) */}
            <li>
              <button
                className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-left text-[#71717A] hover:bg-[#1E1F20] hover:text-gray-100 transition-colors"
                onClick={toggleBoards}
              >
                <div className="flex items-center">
                  <LayoutDashboard size={16} className="mr-3" />
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
                <ul className="mt-1 ml-5 space-y-0.5 border-l border-[#1E1F20] pl-4">
                  <NavLink to="/boards">
                    <li className={boardItemClass}>
                      All
                      <span>{stats.all}</span>
                    </li>
                  </NavLink>
                  <NavLink to="/boards?status=applied">
                    <li className={boardItemClass}>
                      Applied
                      <span>{stats.applied}</span>
                    </li>
                  </NavLink>
                  <NavLink to="/boards?status=interviewed">
                    <li className={boardItemClass}>
                      Interviewed
                      <span>{stats.interviewing}</span>
                    </li>
                  </NavLink>
                  <NavLink to="/boards?status=offer">
                    <li className={boardItemClass}>
                      Offer
                      <span>{stats.offer_received}</span>
                    </li>
                  </NavLink>
                  <NavLink to="/boards?status=rejected">
                    <li className={boardItemClass}>
                      Rejected
                      <span>{stats.rejected}</span>
                    </li>
                  </NavLink>
                  <NavLink to="/boards?favorites=true">
                    <li className={boardItemClass}>
                      Favorites
                      <span>{stats.favorites}</span>
                    </li>
                  </NavLink>
                </ul>
              )}
            </li>

            {/* Insights */}
            <NavLink to="/insights" className={navLinkClass}>
              <TrendingUp size={16} className="mr-3" />
              Insights
            </NavLink>

            {/* Account */}
            <NavLink to="/settings" className={navLinkClass}>
              <UserRound size={16} className="mr-3" fill="currentColor" />
              Account
            </NavLink>
          </ul>

          {/* SAVED LINKS section */}
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 pb-2">
              <p className="text-[10px] font-semibold tracking-wider uppercase text-[#45454A]">
                Saved Links
              </p>
              <NavLink
                to="/settings?tab=Documents#saved-links-section"
                className="text-[#45454A] hover:text-white transition-colors text-sm"
              >
                +
              </NavLink>
            </div>
            <ul className="space-y-0.5">
              {savedLinks.map((link) => (
                <li
                  key={link.id}
                  className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs text-[#71717A] transition-colors hover:bg-[#1E1F20] hover:text-gray-100"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="truncate">{link.label}</span>
                    <button
                      onClick={() => handleCopyLink(link.id, link.url)}
                      className="p-1 rounded hover:bg-[#2A2A2A] transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      title={`Copy: ${link.url}`}
                    >
                      <Copy
                        size={13}
                        className={
                          copiedId === link.id
                            ? "text-green-400"
                            : "text-[#71717A]"
                        }
                      />
                    </button>
                  </div>
                  <button
                    onClick={() => removeSavedLink(link.id)}
                    className="p-1 rounded hover:bg-red-500/20 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 shrink-0"
                    title="Remove link"
                  >
                    <X size={13} className="text-[#71717A] hover:text-red-400" />
                  </button>
                </li>
              ))}
              {savedLinks.length === 0 && (
                <p className="px-3 text-xs text-[#45454A] italic">
                  No links yet
                </p>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pb-4">
          {/* Bottom divider */}
          <div className="mx-0 mb-2 border-t border-[#1E1F20]" />
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-[#71717A] text-left hover:bg-[#1E1F20] hover:text-gray-100 transition-colors"
            >
              {isDark ? (
                <>
                  <Sun size={16} className="mr-3" /> Light Mode
                </>
              ) : (
                <>
                  <Moon size={16} className="mr-3" /> Dark Mode
                </>
              )}
            </button>
            <NavLink to="/settings" className={navLinkClass}>
              <Settings size={16} className="mr-3" />
              Settings
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-[#71717A] text-left hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} className="mr-3" />
              Log Out
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
