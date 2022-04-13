import React from "react";
import Draggable from "react-draggable";
import { GiGate } from "react-icons/gi";

const Entrance = React.forwardRef(
  ({ onStop, editing, data, handleParking }, ref) => {
    return (
      <Draggable
        ref={ref}
        onStop={onStop}
        disabled={!editing}
        key={data?.id}
        defaultPosition={data?.defaultPosition}
      >
        <GiGate
          onClick={!editing && handleParking}
          className={`text-blue-500 absolute ${
            editing ? "cursor-move" : "cursor-pointer"
          }`}
        />
      </Draggable>
    );
  }
);

export default Entrance;
