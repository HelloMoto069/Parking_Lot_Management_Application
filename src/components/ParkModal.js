import React from "react";
import { RiCloseFill } from "react-icons/ri";

function ParkModal({ park, closeModal, car, setCar }) {
  const handleChange = (e, key) => {
    setCar((c) => ({ ...c, [key]: e.target.value }));
  };

  return (
    <form
      onSubmit={(e) => park(e)}
      className="fixed text-4xl inset-0 grid place-content-center z-50 text-black"
    >
      <div className="border-2 relative rounded-lg p-4 pt-8 flex flex-col gap-4 items-center bg-yellow-400">
        <RiCloseFill
          onClick={() => closeModal(false)}
          className="absolute top-1 right-1 cursor-pointer"
        />
        <p>Enter Plate Number</p>
        <input
          className="outline-none px-4 py-2 text-2xl"
          value={car?.plateNumber || ""}
          onChange={(e) => handleChange(e, "plateNumber")}
        />
        <p>Select Size</p>
        <select
          name="cars"
          id="cars"
          onChange={(e) => handleChange(e, "size")}
          className="w-full text-center"
        >
          {["small", "medium", "large"].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!car?.plateNumber}
          className={`${
            !car?.plateNumber &&
            "opacity-50 hover:opacity-50 cursor-not-allowed"
          } px-2 py-1 rounded-md duration-200 text-white border-2 tracking-widest w-full`}
        >
          Enter
        </button>
      </div>
    </form>
  );
}

export default ParkModal;
