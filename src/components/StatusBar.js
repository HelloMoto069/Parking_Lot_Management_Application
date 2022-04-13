import useGlobalContext from "context";
import React, { useEffect, useState } from "react";

function StatusBar() {
  const [time, setTime] = useState();
  const { Exited, MockDate, ParkingSlots } = useGlobalContext();
  const [exited, setExited] = Exited;
  const [mockDate, setMockDate] = MockDate;
  const [parkingSlots] = ParkingSlots;
  const [tab, setTab] = useState("Parked");

  const returnExpiration = exited.map(
    (e) =>
      Math.abs(
        (mockDate ? new Date(mockDate) : new Date()) - new Date(e.exit)
      ) / 36e5
  );

  useEffect(() => {
    setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);
  }, [exited]);

  useEffect(() => {
    if (returnExpiration.some((T) => T >= 1)) {
      setExited((E) =>
        E.filter(
          (e) =>
            Math.abs(
              (mockDate ? new Date(mockDate) : new Date()) - new Date(e.exit)
            ) /
              36e5 <
            1
        )
      );
    }
  }, [returnExpiration, setExited, mockDate]);

  const parked = parkingSlots.filter((p) => p.occupied);

  return (
    <div className="fixed right-0 top-0 p-7 grid gap-4">
      <div className="flex justify-between">
        <span>Real Time:</span>
        <span>{time}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span>Skip Time:</span>
        <span>
          <input
            type="datetime-local"
            className="text-black cursor-pointer"
            value={mockDate || ""}
            onChange={(e) => setMockDate(e.target.value)}
          />
        </span>
      </div>
      <div className="text-right">
        <div className="grid grid-cols-2 w-60 ml-auto bg-gray-700 border-2 border-black p-5 gap-3">
          {["Parked", "Just Exited"].map((T) => (
            <span
              key={T}
              onClick={() => setTab(T)}
              className={`${
                tab === T && "bg-gray-300 text-black"
              } hover:bg-gray-300 hover:text-black cursor-pointer text-center`}
            >
              {T}
            </span>
          ))}
        </div>
        {tab === "Parked"
          ? parked?.map((e) => (
              <p key={e.occupied}>
                {e.occupied}-{new Date(e.entry).toLocaleString()}
              </p>
            ))
          : exited?.map((e) => (
              <p key={e.plate}>
                {e.plate}-{new Date(e.exit).toLocaleString()}
              </p>
            ))}
      </div>
    </div>
  );
}

export default StatusBar;
