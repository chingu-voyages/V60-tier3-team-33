import { Search } from "lucide-react";
import AppList from "../components/AppList";
import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Application } from "../types/application";
import { api } from "../services/api";
import { cap } from "../utilities/capitalize";

function Boards() {
  const [applications, setApplications] = useState<Application[]>([]);
  const { status } = useParams<{ status?: string }>();
  const search = undefined;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.getApplications(
          1,
          10,
          search,
          status === "all" ? undefined : status,
        );
        setApplications(data);
        console.log(status)
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplications();
  }, [status, search]);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div>
            <span className="text-text-muted">
              <NavLink to="/boards/all">Boards</NavLink> /{" "}
            </span>
            {cap(status || 'all')}
          </div>
          <div>
            <span className="pr-3 text-2xl font-bold">{cap(status || 'all')}</span>
            <span className="text-gray-500">{applications.length}</span>
          </div>
        </div>
        <div className="flex">
          <div className="flex items-center">
            <div className="absolute pl-3">
              <Search size={18} />
            </div>
            <input
              className="surface mr-3 h-10 rounded-xl pl-10 text-gray-400"
              placeholder="Search..."
            />
          </div>
          <button
            type="button"
            className="bg-primary cursor-pointer rounded-xl px-5 py-2 text-sm text-black"
            onClick={() => alert("add")}
          >
            + Add
          </button>
        </div>
      </div>
      <AppList boardsView={true} applications={applications} />
    </div>
  );
}

export default Boards;
