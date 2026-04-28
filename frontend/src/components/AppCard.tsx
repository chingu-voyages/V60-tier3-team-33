import type { Application } from "../types/application";
import { formatDate } from "../utilities/formatDate";
import { formatSalary } from "../utilities/formatSalary";
import { getStatusStyles } from "../utilities/themeUtils";
import {
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  Pen,
  Star,
  StarOff,
  Trash2,
  X,
} from "lucide-react";

interface AppCardType {
  app: Application;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function AppCard({ app, isOpen, onClose, onEdit, onDelete }: AppCardType) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border-border text-text-main relative max-h-[90vh] w-full max-w-2xl flex-1 overflow-auto rounded-2xl border shadow-2xl flex flex-col">
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className={`inline-block rounded-full px-3 py-1 border text-xs font-semibold tracking-wide ${getStatusStyles(app.status)}`}>
                {app.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-text-muted text-sm">{formatDate(app.applied_at, "short")}</span>
            </div>
            <div className="flex gap-4 text-text-muted">
              <button className="hover:text-yellow-400 transition-colors cursor-pointer" onClick={() => {}}>
                {app.favorite ? <Star fill="currentColor" size={18} /> : <StarOff size={18} />}
              </button>
              <button className="hover:text-primary transition-colors cursor-pointer" onClick={onEdit}>
                <Pen size={18} />
              </button>
              <button className="hover:text-red-500 transition-colors cursor-pointer" onClick={onDelete}>
                <Trash2 size={18} />
              </button>
              <button className="hover:text-text-main transition-colors cursor-pointer" onClick={onClose}>
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
            <div className="pt-1 text-text-muted"><MapPin size={20} /></div>
            <div>
              <div className="text-xs text-text-muted mb-1 uppercase tracking-wider">Location</div>
              <div className="font-medium">{app.location || 'Not specified'}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="pt-1 text-text-muted"><Briefcase size={20} /></div>
            <div>
              <div className="text-xs text-text-muted mb-1 uppercase tracking-wider">Job Type</div>
              <div className="font-medium">{app.extras?.workType || 'Not specified'}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="pt-1 text-text-muted"><Calendar size={20} /></div>
            <div>
              <div className="text-xs text-text-muted mb-1 uppercase tracking-wider">Applied</div>
              <div className="font-medium">{formatDate(app.applied_at, "short")}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="pt-1 text-text-muted"><DollarSign size={20} /></div>
            <div>
              <div className="text-xs text-text-muted mb-1 uppercase tracking-wider">Salary</div>
              <div className="font-medium">
                {app.salary_min != null && app.salary_max != null
                  ? `${formatSalary(app.salary_min)} - ${formatSalary(app.salary_max)}`
                  : "None"}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-black/5 dark:bg-white/5 border-t border-border">
          <div className="mb-3 text-xs font-semibold tracking-wider text-text-muted uppercase">Status Timeline</div>
          <div>
            <span className={`inline-block rounded-full px-3 py-1 border text-xs font-semibold tracking-wide mb-2 ${getStatusStyles(app.status)}`}>
              {app.status.replace('_', ' ').toUpperCase()}
            </span>
            <div className="text-sm text-text-muted">{formatDate(app.applied_at, "long")}</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border bg-black/5 dark:bg-white/5 mt-auto rounded-b-2xl">
          <div className="font-medium">Tasks</div>
          <button className="text-primary hover:text-indigo-500 dark:hover:text-[#EEFF2B] font-medium transition-colors cursor-pointer">
            + Add Tasks
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default AppCard;