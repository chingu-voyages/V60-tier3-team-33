import Boards from "./pages/Boards";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="h-screen bg-gray-900 text-gray-100">
      {/* <Dashboard/> */}
      <Boards boardsView={true} />
    </div>
  );
}
