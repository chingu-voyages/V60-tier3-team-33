import AppList from "../components/AppList";
import { applicationData } from "../mocks/applicationData";

function Boards() {
  

  return (
    <div className="bg-background p-5">
      <div className="flex justify-between items-center">
        <div>
          <div><span className="text-text-muted">Boards / </span>All</div>
          <div>
            <span className="text-2xl font-bold pr-3">All</span>
            <span className="text-gray-500">{applicationData.length}</span>
          </div>
        </div>
        <div>
          <input
            className="surface rounded-xl text-text-muted h-10 mr-3"
            placeholder="Search..."
          />
          <button
            type="button"
            className="bg-primary rounded-xl text-black py-2 px-5 text-sm cursor-pointer"
            onClick={() => alert("add")}
          >
            + Add
          </button>
        </div>
      </div>
      <AppList boardsView={true}/>
    </div>
  );
}

export default Boards;
