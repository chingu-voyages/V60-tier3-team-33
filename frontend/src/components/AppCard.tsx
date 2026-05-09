import type { Application, ApplicationStatus } from "../types/application";
import { formatDate } from "../utilities/formatDate";
import { formatSalary } from "../utilities/formatSalary";
import { getStatusStyles } from "../utilities/themeUtils";
import {
  Briefcase,
  Calendar,
  ChevronDown,
  DollarSign,
  MapPin,
  Pen,
  Star,
  StarOff,
  Trash2,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface AppCardType {
  app: Application;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  toggleFavorite: (id:number, app: Application) => void;
  onStatusUpdate: (id: number, status: ApplicationStatus) => void;
}

const STATUS_OPTIONS: ApplicationStatus[] = [
  "applied",
  "screening",
  "interviewing",
  "offer_received",
  "accepted",
  "rejected",
  "withdrawn",
];

const formatStatusTitleCase = (status: string) => {
  return status
    .replace("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function AppCard({ app, isOpen, onClose, onEdit, onDelete, toggleFavorite, onStatusUpdate }: AppCardType) {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    onStatusUpdate(app.id, newStatus);
    setIsStatusDropdownOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="border-border text-text-main relative flex max-h-[90vh] w-full max-w-2xl flex-1 flex-col overflow-auto rounded-2xl border shadow-2xl bg-white dark:bg-[linear-gradient(180deg,#242528_0%,#0F0F0F_100%)]">
        
        <div className="px-6 pt-6 pb-5 border-b border-gray-200 dark:border-white/10">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-all hover:opacity-80 active:scale-95 ${getStatusStyles(app.status)}`}
                >
                  {formatStatusTitleCase(app.status)}
                  <ChevronDown size={12} />
                </button>

                {isStatusDropdownOpen && (
                  <div className="animate-in fade-in zoom-in-95 absolute top-full left-0 z-60 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] shadow-xl duration-200">
                    <div>
                      {STATUS_OPTIONS.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={`w-full cursor-pointer px-4 py-2.5 text-left text-[13px] transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-[#9B6DFF]/10 hover:text-[#9B6DFF] dark:hover:bg-[#F2FF53]/10 dark:hover:text-[#F2FF53] ${
                            app.status === status 
                              ? "bg-[#9B6DFF]/5 font-medium text-[#9B6DFF] dark:bg-[#F2FF53]/5 dark:text-[#F2FF53]" 
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {formatStatusTitleCase(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-text-muted text-sm">
                {formatDate(app.applied_at, "short")}
              </span>
            </div>
            <div className="flex gap-4 text-text-muted">
              <button className="hover:text-yellow-400 transition-colors cursor-pointer" onClick={() => {toggleFavorite(app.id, app)}}>
                {app.favorite ? <Star fill="currentColor" size={16} /> : <StarOff size={16} />}
              </button>
              <button
                className="hover:text-primary cursor-pointer transition-colors"
                onClick={onEdit}
              >
                <Pen size={16} />
              </button>
              <button
                className="cursor-pointer transition-colors hover:text-red-500"
                onClick={onDelete}
              >
                <Trash2 size={16} />
              </button>
              <button
                className="hover:text-text-main cursor-pointer transition-colors"
                onClick={onClose}
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div>
            <h2 className="mb-0.5 text-xl font-semibold tracking-tight dark:text-gray-100">{app.role}</h2>
            <div className="text-text-muted text-sm">{app.company_name}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-6 px-6 pt-5 pb-6">
          <div className="flex gap-3.5">
            <div className="text-text-muted pt-0.5">
              <MapPin size={16} />
            </div>
            <div>
              <div className="text-text-muted mb-1 text-[13px]">
                Location
              </div>
              <div className="font-medium text-sm dark:text-gray-200">
                {app.location || "Not specified"}
                {app.extras?.workType && <span className="text-text-muted font-normal ml-1">({app.extras.workType.toLowerCase()})</span>}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3.5">
            <div className="text-text-muted pt-0.5">
              <Calendar size={16} />
            </div>
            <div>
              <div className="text-text-muted mb-1 text-[13px]">
                Applied
              </div>
              <div className="font-medium text-sm dark:text-gray-200">
                {formatDate(app.applied_at, "short")}
              </div>
            </div>
          </div>

          <div className="flex gap-3.5">
            <div className="text-text-muted pt-0.5">
              <Briefcase size={16} />
            </div>
            <div>
              <div className="text-text-muted mb-1 text-[13px]">
                Job Type
              </div>
              <div className="font-medium text-sm dark:text-gray-200">
                {app.extras?.jobNature || "Not specified"}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3.5">
            <div className="text-text-muted pt-0.5">
              <DollarSign size={16} />
            </div>
            <div>
              <div className="text-text-muted mb-1 text-[13px]">
                Salary
              </div>
              <div className="font-medium text-sm dark:text-gray-200">
                {app.salary_min != null && app.salary_max != null
                  ? `$${formatSalary(app.salary_min)} - $${formatSalary(app.salary_max)}`
                  : "None"}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2">
          <div className="text-text-muted mb-6 text-[11px] font-bold tracking-widest uppercase">
            STATUS TIMELINE
          </div>
          <div className="flex flex-col">
            <div className="font-semibold text-[15px] text-text-main tracking-tight mb-0.5">
              {formatStatusTitleCase(app.status)}
            </div>
            <div className="text-text-muted text-[13px]">
              {formatDate(app.applied_at, "short")}
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between p-6 pt-0">
          <div className="text-text-muted text-[11px] font-bold tracking-widest uppercase">
            TASKS
          </div>
          <button className="text-[#EEFF2B] cursor-pointer text-sm font-medium transition-colors hover:text-[#D4FA31]">
            + Add task
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppCard;
