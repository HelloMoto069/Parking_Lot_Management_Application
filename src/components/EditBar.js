import React, { useState } from "react";
import { v4 as id } from "uuid";
import { IoMdAddCircleOutline } from "react-icons/io";

import useGlobalContext from "context";

function EditBar() {
  const { ParkingSlots, Entrances, Editing } = useGlobalContext();
  const [parkingSlots, setParkingSlots] = ParkingSlots;
  const [entrances, setEntrances] = Entrances;
  const [editing] = Editing;
  const [addingSlot, setAddingSlot] = useState(false);

  const getSlotsBySize = (str) => parkingSlots.filter((p) => p.size === str);

  const AddSlotsOrEntrance = (type) => {
    if (type)
      return setParkingSlots([
        ...parkingSlots,
        { id: id(), defaultPosition: { x: 100, y: 100 }, size: type },
      ]);

    return setEntrances([
      ...entrances,
      { id: id(), defaultPosition: { x: 100, y: 100 } },
    ]);
  };

  return (
    <div
      className={`${
        !editing && "translate-y-full"
      } duration-500 transform fixed inset-x-0 bottom-0 px-4 py-2 flex gap-8 tracking-wider`}
    >
      <div>
        <p className="mb-2">Entrances: {entrances?.length}</p>
        <button
          onClick={() => AddSlotsOrEntrance()}
          className="button bg-blue-500"
        >
          Add Entrance
        </button>
      </div>
      <div className="flex gap-4">
        <div>
          <p className="mb-2">Parking Slots:</p>
          <button
            className={`button  ${addingSlot ? "bg-red-500" : "bg-green-500"}`}
            onClick={() => setAddingSlot(!addingSlot)}
          >
            {addingSlot ? "Cancel" : "Add Slots"}
          </button>
        </div>

        {["small", "medium", "large"].map((s) => (
          <div key={s} className="capitalize">
            <p className="mb-2">
              {s}: {getSlotsBySize(s)?.length}
            </p>
            {addingSlot && (
              <IoMdAddCircleOutline
                className="text-3xl m-auto cursor-pointer"
                onClick={() => AddSlotsOrEntrance(s)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditBar;
