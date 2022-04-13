import EditBar from "components/EditBar";
import Notification from "components/Notification";
import ManageBar from "components/ManageBar";
import StatusBar from "components/StatusBar";
import ParkingLot from "./components/ParkingLot";

function App() {
  return (
    <div className="App text-white">
      <Notification />
      <StatusBar />
      <EditBar />
      <ParkingLot />
      <ManageBar />
    </div>
  );
}

export default App;
