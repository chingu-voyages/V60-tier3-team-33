import type { Dispatch, SetStateAction } from "react";
import type { Application } from "../types/dashboard.types";
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

type AppCardType = {
  app: Application;
  setSelectedApp: Dispatch<SetStateAction<Application | null>>;
};

function AppCard({ app, setSelectedApp }: AppCardType) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="surface max-w-4xl flex-1 rounded-2xl">
        {/* card header */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex gap-5">
              <div className="rounded-3xl bg-[#b4b4b41a] px-3 py-1">
                {app.status}
              </div>
              {formatDate(app.dateApplied, "short")}
            </div>
            {/* icons */}
            <div className="flex gap-3">
              <div className="hover:text-primary cursor-pointer">
                {app.favorite ? <Star /> : <StarOff />}
              </div>
              <div className="hover:text-primary cursor-pointer">
                <Pen />
              </div>
              <div className="hover:text-primary cursor-pointer">
                <Trash2 />
              </div>
              <div
                className="hover:text-primary cursor-pointer"
                onClick={() => setSelectedApp(null)}
              >
                <X />
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-1 text-2xl text-white">{app.role}</div>
            <div>{app.company}</div>
          </div>
        </div>
        <hr />
        {/* card body */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 p-5">
          {/* location */}
          <div className="flex gap-3">
            <div className="pt-1">
              <MapPin size={20} />
            </div>
            <div>
              <div>Location</div>
              <div className="text-white">{app.location}</div>
            </div>
          </div>
          {/* job type */}
          <div className="flex gap-3">
            <div className="pt-1">
              <Briefcase size={20} />
            </div>{" "}
            <div>
              <div>Job Type</div>
              <div className="text-white">{app.type}</div>
            </div>
          </div>
          {/* applied */}
          <div className="flex gap-3">
            <div>
              <div className="pt-1">
                <Calendar size={20} />
              </div>{" "}
            </div>
            <div>
              <div>Applied</div>
              <div className="text-white">{app.dateApplied}</div>
            </div>
          </div>
          {/* salary */}
          <div className="flex gap-3">
            <div>
              <div className="pt-1">
                <DollarSign size={20} />
              </div>{" "}
            </div>
            <div>
              <div>Salary</div>
              <div className="text-white">
                ${formatSalary(app.minSalary)}-$
                {formatSalary(app.minSalary)}{" "}
              </div>
            </div>
          </div>
        </div>
        {/* timeline */}
        <div className="p-5">
          <div className="mt-5 tracking-wider uppercase">Status Timeline</div>
          <div>
            <div className="text-white">{app.status}</div>
            <div className="text-xs">
              {formatDate(app.dateApplied, "short")}
            </div>
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
