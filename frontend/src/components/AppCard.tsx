import type { Application } from "../types/application";
import { formatDate } from "../utilities/formatDate";
import { formatSalary } from "../utilities/formatSalary";
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
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="surface relative max-h-4/5 w-full max-w-2xl flex-1 overflow-auto rounded-2xl shadow-xl">
        {/* card header */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5 text-gray-400 dark:text-gray-500">
              <div className="rounded-3xl bg-[#b4b4b41a] px-3 py-1">
                {app.status}
              </div>
              {formatDate(app.applied_at, "short")}
            </div>
            {/* icons */}
            <div className="flex gap-5 text-gray-400 dark:text-gray-500">
              <div className="dark:hover:text-primary cursor-pointer">
                {app.favorite ? <Star size={18} /> : <StarOff size={18} />}
              </div>
              <div
                className="hover:text-primary cursor-pointer"
                onClick={onEdit}
              >
                <Pen size={18} />
              </div>
              <div
                className="cursor-pointer hover:text-red-500"
                onClick={onDelete}
              >
                <Trash2 size={18} />
              </div>
              <div
                className="hover:text-primary cursor-pointer"
                onClick={onClose}
              >
                <X size={18} />
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-1 text-2xl dark:text-white">{app.role}</div>
            <div className="text-gray-400 dark:text-gray-500">
              {app.company_name}
            </div>
          </div>
        </div>
        <hr className="text-gray-300" />
        {/* card body */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 p-5">
          {/* location */}
          <div className="flex gap-3">
            <div className="pt-1 text-gray-400 dark:text-gray-500">
              <MapPin size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Location
              </div>
              <div className="dark:text-white">{app.location}</div>
            </div>
          </div>
          {/* job type */}
          <div className="flex gap-3">
            <div className="pt-1 text-gray-400 dark:text-gray-500">
              <Briefcase size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Job Type
              </div>
              <div className="dark:text-white">{app.extras?.workType}</div>
            </div>
          </div>
          {/* applied */}
          <div className="flex gap-3">
            <div>
              <div className="pt-1 text-gray-400 dark:text-gray-500">
                <Calendar size={20} />
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Applied
              </div>
              <div className="dark:text-white">{app.applied_at}</div>
            </div>
          </div>
          {/* salary */}
          <div className="flex gap-3">
            <div>
              <div className="pt-1 text-gray-400 dark:text-gray-500">
                <DollarSign size={20} />
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Salary
              </div>
              <div className="dark:text-white">
                {app.salary_min != null && app.salary_max != null
                  ? `${formatSalary(app.salary_min)} - ${formatSalary(app.salary_max)}`
                  : "None"}
              </div>
            </div>
          </div>
        </div>
        {/* timeline */}
        <div className="p-5">
          <div className="mt-5 tracking-wider uppercase">Status Timeline</div>
          <div>
            <div className="text-white">{app.status}</div>
            <div className="text-xs">{formatDate(app.applied_at, "short")}</div>
          </div>
        </div>
        {/* tasks */}
        <div className="flex items-center justify-between p-5">
          <div>Tasks</div>
          <div className="text-primary">+ Add Tasks</div>
        </div>
      </div>
    </div>
  );
}

export default AppCard;
