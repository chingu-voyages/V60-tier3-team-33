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
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

type SideBarProps = {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
};

function Sidebar({ isDark, setIsDark }: SideBarProps) {
  const [isBoardsOpen, setIsBoardsOpen] = useState<boolean>(false);

  const toggleBoards = () => {
    setIsBoardsOpen((prev) => !prev);
  };

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
                <NavLink to="/boards/all">
                  <li className="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left hover:bg-[#222222] hover:text-gray-100">
                    All
                  </li>
                </NavLink>
                <NavLink to="/boards/applied">
                  <li className="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left hover:bg-[#222222] hover:text-gray-100">
                    Applied
                  </li>
                </NavLink>
                <NavLink to="/boards/interviewed">
                  <li className="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left hover:bg-[#222222] hover:text-gray-100">
                    Interviewed
                  </li>
                </NavLink>
                <NavLink to="/boards/offer">
                  <li className="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left hover:bg-[#222222] hover:text-gray-100">
                    Offer
                  </li>
                </NavLink>
                <NavLink to="/boards/rejected">
                  <li className="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left hover:bg-[#222222] hover:text-gray-100">
                    Rejected
                  </li>
                </NavLink>
                <NavLink to="/boards/favorites">
                  <li className="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left hover:bg-[#222222] hover:text-gray-100">
                    Favorites
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

          <NavLink to="/account">
            <li className="w-full cursor-pointer rounded-lg p-2 text-left hover:bg-[#222222] hover:text-gray-100">
              <User fill={"gray"} size={18} className="float-left mr-3" />
              Account
            </li>
          </NavLink>
        </ul>
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-widest uppercase">Saved Links</p>
            <p className="mr-2">+</p>
          </div>
          <ul>
            <li className="w-full cursor-pointer rounded-lg p-1 text-left hover:bg-[#222222] hover:text-gray-100">
              saved link 1
            </li>
            <li className="w-full cursor-pointer rounded-lg p-1 text-left hover:bg-[#222222] hover:text-gray-100">
              saved link 2
            </li>
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
          <button className="w-full cursor-pointer rounded-lg p-2 text-left hover:bg-[#222222] hover:text-gray-100">
            <Settings size={18} className="float-left mr-3" />
            Settings
          </button>
          <button className="w-full cursor-pointer rounded-lg p-2 text-left hover:bg-[#222222] hover:text-gray-100">
            <LogOut size={18} className="float-left mr-3" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
