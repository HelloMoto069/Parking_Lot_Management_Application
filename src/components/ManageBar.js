import React from "react";
import useGlobalContext from "context";
import { RiCloseFill } from "react-icons/ri";
import { BiExit } from "react-icons/bi";

function ManageBar() {
  const { ForManaging, ParkingSlots, Exited, MockDate } = useGlobalContext();
  const [forManaging, setForManaging] = ForManaging;
  const [, setParkingSlots] = ParkingSlots;
  const data = forManaging?.content;
  const [exited, setExited] = Exited;
  const [mockDate] = MockDate;

  const hours = (
    Math.abs(
      (mockDate ? new Date(mockDate) : new Date()) - new Date(data?.entry)
    ) / 36e5
  ).toFixed(2);

  const price = {
    small: 20,
    medium: 60,
    large: 100,
  };

  const getBill = (hours) => {
    if (hours >= 24) return 5000;
    if (hours <= 3 && !data.returner) return 40;
    if (hours > 3 && !data.returner)
      return 40 + (hours - 3) * price[data?.size];

    return hours * price[data?.size];
  };

  const handleExit = () => {
    setParkingSlots((P) =>
      P.map((p) =>
        p.occupied === data?.occupied ? { ...p, occupied: false } : p
      )
    );
    setExited([...exited, { exit: new Date(), plate: data.occupied }]);
    setForManaging({});
  };

  return (
    <div
      className={`${
        !forManaging.open && "translate-y-full z-50"
      } transform duration-500 fixed bottom-0 inset-x-0`}
    >
      <div className="bg-blue-500 mx-auto min-w-max w-96  p-4 px-6 rounded-t-lg relative flex text-2xl justify-between items-end text-white">
        <RiCloseFill
          onClick={() => setForManaging({})}
          className="absolute right-1 top-1 cursor-pointer"
        />
        <div>
          <p>plate: {data?.occupied}</p>
          <p>time: {hours} hr/s</p>
          <p>bill: {getBill(Math.ceil(hours))} ₹</p>
        </div>

        <BiExit
          title="UNPARK"
          className="text-4xl cursor-pointer"
          onClick={() => handleExit()}
        />
      </div>
    </div>
  );
}

export default ManageBar;
