import AppList from "../components/AppList";
import { applicationData } from "../mocks/applicationData";

function Boards() {
  return (
    <div className="bg-background p-5">
      <div className="flex items-center justify-between">
        <div>
          <div>
            <span className="text-text-muted">Boards / </span>All
          </div>
          <div>
            <span className="pr-3 text-2xl font-bold">All</span>
            <span className="text-gray-500">{applicationData.length}</span>
          </div>
        </div>
        <div>
          <input
            className="surface text-text-muted mr-3 h-10 rounded-xl"
            placeholder="Search..."
          />
          <button
            type="button"
            className="bg-primary cursor-pointer rounded-xl px-5 py-2 text-sm text-black"
            onClick={() => alert("add")}
          >
            + Add
          </button>
        </div>
      </div>
      <AppList boardsView={true} />
    </div>
  );
}

export default Boards;
