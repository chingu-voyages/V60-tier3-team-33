import Boards from "./pages/Boards";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="h-screen bg-[linear-gradient(135deg,#1a1b1c,#121314)] text-gray-100">
      <Dashboard/>
      {/* <Boards /> */}
    </div>
  );
}
