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

function AppCard({ app, isOpen, onClose, onEdit, onDelete, onStatusUpdate }: AppCardType) {
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

  if (!isOpen) return null;

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    onStatusUpdate(app.id, newStatus);
    setIsStatusDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-surface border-border text-text-main relative flex max-h-[90vh] w-full max-w-2xl flex-1 flex-col overflow-auto rounded-2xl border shadow-2xl">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-all hover:opacity-80 active:scale-95 ${getStatusStyles(app.status)}`}
                >
                  {app.status.replace("_", " ").toUpperCase()}
                  <ChevronDown size={14} />
                </button>

                {isStatusDropdownOpen && (
                  <div className="bg-surface border-border absolute top-full left-0 z-[60] mt-2 w-48 rounded-xl border shadow-xl">
                    <div className="py-2">
                      {STATUS_OPTIONS.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={`hover:bg-black/5 dark:hover:bg-white/5 w-full px-4 py-2 text-left text-sm transition-colors ${app.status === status ? "bg-primary/10 font-bold" : ""}`}
                        >
                          {status.replace("_", " ").toUpperCase()}
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
            <div className="text-text-muted flex gap-4">
              <button
                className="cursor-pointer transition-colors hover:text-yellow-400"
                onClick={() => {}}
              >
                {app.favorite ? (
                  <Star fill="currentColor" size={18} />
                ) : (
                  <StarOff size={18} />
                )}
              </button>
              <button
                className="hover:text-primary cursor-pointer transition-colors"
                onClick={onEdit}
              >
                <Pen size={18} />
              </button>
              <button
                className="cursor-pointer transition-colors hover:text-red-500"
                onClick={onDelete}
              >
                <Trash2 size={18} />
              </button>
              <button
                className="hover:text-text-main cursor-pointer transition-colors"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div>
            <h2 className="mb-1 text-2xl font-bold">{app.role}</h2>
            <div className="text-text-muted text-lg">{app.company_name}</div>
          </div>
        </div>

        <hr className="border-border" />

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6 p-6">
          <div className="flex gap-3">
            <div className="text-text-muted pt-1">
              <MapPin size={20} />
            </div>
            <div>
              <div className="text-text-muted mb-1 text-xs tracking-wider uppercase">
                Location
              </div>
              <div className="font-medium">
                {app.location || "Not specified"}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-text-muted pt-1">
              <Briefcase size={20} />
            </div>
            <div>
              <div className="text-text-muted mb-1 text-xs tracking-wider uppercase">
                Job Type
              </div>
              <div className="font-medium">
                {app.extras?.workType || "Not specified"}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-text-muted pt-1">
              <Calendar size={20} />
            </div>
            <div>
              <div className="text-text-muted mb-1 text-xs tracking-wider uppercase">
                Applied
              </div>
              <div className="font-medium">
                {formatDate(app.applied_at, "short")}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-text-muted pt-1">
              <DollarSign size={20} />
            </div>
            <div>
              <div className="text-text-muted mb-1 text-xs tracking-wider uppercase">
                Salary
              </div>
              <div className="font-medium">
                {app.salary_min != null && app.salary_max != null
                  ? `${formatSalary(app.salary_min)} - ${formatSalary(app.salary_max)}`
                  : "None"}
              </div>
            </div>
          </div>
        </div>

        <div className="border-border border-t bg-black/5 p-6 dark:bg-white/5">
          <div className="text-text-muted mb-3 text-xs font-semibold tracking-wider uppercase">
            Status Timeline
          </div>
          <div className="flex flex-col">
            <span
              className={`mb-2 inline-block w-fit rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${getStatusStyles(app.status)}`}
            >
              {app.status.replace("_", " ").toUpperCase()}
            </span>
            <div className="text-text-muted text-sm">
              {formatDate(app.applied_at, "long")}
            </div>
          </div>
        </div>

        <div className="border-border mt-auto flex items-center justify-between rounded-b-2xl border-t bg-black/5 p-6 dark:bg-white/5">
          <div className="font-medium">Tasks</div>
          <button className="text-primary cursor-pointer font-medium transition-colors hover:text-indigo-500 dark:hover:text-[#EEFF2B]">
            + Add Tasks
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppCard;
