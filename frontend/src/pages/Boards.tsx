import AppList from "../components/AppList";
import { applicationData } from "../mocks/applicationData";

function Boards({boardsView}: {boardsView: boolean}) {
  

  return (
    <div className="bg-gray-900 p-5">
      <div className="flex justify-between items-center">
        <div>
          <div>Boards / All</div>
          <div>
            <span className="text-2xl font-bold pr-3">All</span>
            <span className="text-gray-500">{applicationData.length}</span>
          </div>
        </div>
        <div>
          <input
            className="bg-gray-800 rounded-xl text-white h-10 mr-3"
            placeholder="Search"
          />
          <button
            type="button"
            className="bg-yellow-300 rounded-xl text-black py-2 px-5 text-sm cursor-pointer"
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
