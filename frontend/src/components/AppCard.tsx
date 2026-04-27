import { Briefcase, Calendar, DollarSign, MapPin, Pen, Star, StarOff, Trash2, X } from "lucide-react";
import type { Application } from "../types/application";
import { formatDate } from "../utilities/formatDate";
import { formatSalary } from "../utilities/formatSalary";

interface AppCardProps {
  app: Application;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function AppCard({ app, onClose, onEdit, onDelete }: AppCardProps) {
  const isFavorite = app.extras?.favorite as boolean | undefined;
  const jobType = app.extras?.jobNature || "Not Specified";
  
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="surface max-w-4xl flex-1 rounded-2xl shadow-2xl">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex gap-5 items-center">
              <div className="rounded-3xl bg-[#b4b4b41a] px-3 py-1 text-sm font-medium capitalize text-white">
                {app.status.replace('_', ' ')}
              </div>
              <div className="text-gray-400 text-sm">
                {formatDate(app.applied_at, "short")}
              </div>
            </div>
            
            <div className="flex gap-4 text-gray-400">
              <button className="hover:text-yellow-400 cursor-pointer transition-colors">
                {isFavorite ? <Star fill="currentColor" /> : <StarOff />}
              </button>
              {onEdit && (
                <button onClick={onEdit} className="hover:text-white cursor-pointer transition-colors">
                  <Pen size={20} />
                </button>
              )}
              {onDelete && (
                <button onClick={onDelete} className="hover:text-red-400 cursor-pointer transition-colors">
                  <Trash2 size={20} />
                </button>
              )}
              <button onClick={onClose} className="hover:text-white cursor-pointer transition-colors ml-2">
                <X size={24} />
              </button>
            </div>
          </div>
          
          <div className="mt-5">
            <div className="mb-1 text-2xl font-bold text-white">{app.role}</div>
            <div className="text-gray-400 text-lg">{app.company_name}</div>
          </div>
        </div>
        
        <hr className="border-[#b4b4b41a]" />
        
        <div className="grid grid-cols-2 grid-rows-2 gap-6 p-6">
          <div className="flex gap-3 text-gray-400">
            <div className="pt-1"><MapPin size={20} /></div>
            <div>
              <div className="text-xs uppercase tracking-wider mb-1">Location</div>
              <div className="text-white text-sm">
                {app.location || "Not specified"}
                {app.extras?.workType && ` (${app.extras.workType})`}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 text-gray-400">
            <div className="pt-1"><Briefcase size={20} /></div>
            <div>
              <div className="text-xs uppercase tracking-wider mb-1">Job Type</div>
              <div className="text-white text-sm">{jobType}</div>
            </div>
          </div>
          
          <div className="flex gap-3 text-gray-400">
            <div className="pt-1"><Calendar size={20} /></div>
            <div>
              <div className="text-xs uppercase tracking-wider mb-1">Applied</div>
              <div className="text-white text-sm">{formatDate(app.applied_at, "short")}</div>
            </div>
          </div>
          
          <div className="flex gap-3 text-gray-400">
            <div className="pt-1"><DollarSign size={20} /></div>
            <div>
              <div className="text-xs uppercase tracking-wider mb-1">Salary</div>
              <div className="text-white text-sm">
                 {app.extras?.noSalaryRange || (!app.salary_min && !app.salary_max) 
                    ? 'Not provided' 
                    : `$${formatSalary(app.salary_min)} – $${formatSalary(app.salary_max)}`
                }
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-[#b4b4b40a]">
          {app.notes && (
            <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Notes</div>
                <div className="text-white text-sm whitespace-pre-wrap">{app.notes}</div>
            </div>
          )}
          
          <div className="mt-2 text-xs tracking-wider uppercase text-gray-400 mb-2">Status Timeline</div>
          <div>
            <div className="text-white capitalize">{app.status.replace('_', ' ')}</div>
            <div className="text-xs text-gray-500">
              {formatDate(app.applied_at, "short")}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-6 rounded-b-2xl">
          <div className="text-gray-400 uppercase tracking-wider text-xs">Tasks</div>
          <button className="text-[#EEFF2B] hover:text-[#d4e51f] text-sm font-medium transition-colors">
            + Add Tasks
          </button>
        </div>
      </div>
    </div>
  );
}