import React, { useRef, useState } from "react";
import Draggable from "react-draggable"; // The default
import useGlobalContext from "context";
import { FiEdit } from "react-icons/fi";
import { RiCloseFill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import { GiGate } from "react-icons/gi";
import ParkModal from "./ParkModal";

export default function ParkingLot() {
  const {
    ParkingSlots,
    Entrances,
    Editing,
    ForManaging,
    Notification,
    Exited
  } = useGlobalContext();
  const [, setForManaging] = ForManaging;
  const [exited, setExited] = Exited;
  const [parkingSlots, setParkingSlots] = ParkingSlots;
  const [entrances, setEntrances] = Entrances;
  const [editing, setEditing] = Editing;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isParking, setIsParking] = useState(false);
  const [selectedGate, setSelectedGate] = useState(false);
  const [, setNotification] = Notification;
  const entrancesRef = useRef([]);
  const parkingSlotsRef = useRef([]);
  const [car, setCar] = useState({ size: "small" });

  const handlePark = (e) => {
    e.preventDefault();
    const exitedVehicles = exited.map((e) => e.plate);

    /* ------------------------- CHECK IF ALREADY PARKED ------------------------ */

    const isParkedAlready = parkingSlots
      .map((p) => p.occupied)
      .includes(car?.plateNumber);

    if (isParkedAlready)
      return setNotification({
        message: `${car?.plateNumber} is parked already`,
        color: "red"
      });

    /* -------------------- CHECK IF THERE IS AVAILABLE SLOT -------------------- */

    const Available = (size) => {
      const available = parkingSlots.filter(
        (F) => F.size === size && !F.occupied
      );
      return available.length > 0 ? available : false;
    };

    const availableSlots = {
      small: Available("small") || Available("medium") || Available("large"),
      medium: Available("medium") || Available("large"),
      large: Available("large")
    };

    if (!availableSlots[car.size])
      return setNotification({
        message: "no available parking",
        color: "red"
      });

    /* ---------------------------- GET CLOSEST SLOT ---------------------------- */

    const getClosest = () => {
      const distance = (p) =>
        Math.sqrt(Math.pow(point.x - p.x, 2) + Math.pow(point.y - p.y, 2));

      const point = { x: selectedGate.x, y: selectedGate.y },
        points = availableSlots[car.size]
          .filter((f) => !f.occupied)
          .map((p) => p.defaultPosition),
        closest = points.reduce((a, b) => (distance(a) < distance(b) ? a : b));
      return availableSlots[car.size].find(
        (f) => f.defaultPosition === closest
      );
    };

    /* -------------------------------- PARK CAR -------------------------------- */

    const returner = exitedVehicles.includes(car?.plateNumber);

    setParkingSlots(
      parkingSlots.map((p) =>
        p.id === getClosest().id
          ? { ...p, occupied: car?.plateNumber, entry: new Date(), returner }
          : p
      )
    );

    handleCloseModal();

    /* ------------------ CHECK IF CAR RETURNED WITHIN AN HOUR ------------------ */

    if (returner) {
      setExited(exited.filter((e) => e.plate !== car?.plateNumber));
      return setNotification({
        message: `${car?.plateNumber} returned within 1 hour !!`,
        color: "green"
      });
    }
  };

  const handleCloseModal = () => {
    setIsParking(false);
    setNotification({});
    setCar({ size: "small" });
    setSelectedGate(false);
  };

  const updatePosition = (arr, id, ref) => {
    if (isDeleting) return arr.filter((A) => A.id !== id);
    return arr.map((A) =>
      A.id === id
        ? {
            ...A,
            defaultPosition: { x: ref?.state.x, y: ref?.state.y }
          }
        : A
    );
  };

  const handleParking = (i) => {
    setIsParking(true);
    setForManaging({});
    setSelectedGate(entrancesRef.current[i].state);
  };

  return (
    <>
      <div className={`text-5xl ${isParking && "filter blur-sm"} z-50`}>
        <button
          title="EDIT"
          className="fixed text-4xl m-3 cursor-pointer z-50"
          onClick={() => setEditing(!editing)}
        >
          {editing ? <RiCloseFill /> : <FiEdit />}
        </button>

        <button>
          <FaTrashAlt
            className={`${
              !editing && "opacity-0 pointer-events-none"
            } duration-500 fixed right-0 bottom-0 text-4xl m-5 text-red-400  z-50 cursor-pointer transform hover:scale-125`}
            onMouseOver={() => setIsDeleting(true)}
            onMouseLeave={() => setIsDeleting(false)}
          />
        </button>

        {entrances.map((entrance, i) => (
          <Draggable
            ref={(el) => {
              entrancesRef.current[i] = el;
            }}
            disabled={!editing}
            key={entrance.id}
            defaultPosition={entrance.defaultPosition}
            onStop={() =>
              setEntrances(
                updatePosition(entrances, entrance.id, entrancesRef.current[i])
              )
            }
          >
            <GiGate
              title="ENTRANCE"
              onClick={() => (!editing ? handleParking(i) : null)}
              className={`text-green-400 absolute ${
                editing ? "cursor-move" : "cursor-pointer"
              }`}
            />
          </Draggable>
        ))}

        {parkingSlots.map((slot, i) => (
          <Draggable
            ref={(el) => {
              parkingSlotsRef.current[i] = el;
            }}
            key={slot.id}
            disabled={!editing}
            defaultPosition={slot.defaultPosition}
            onStop={(el) =>
              setParkingSlots(
                updatePosition(
                  parkingSlots,
                  slot.id,
                  parkingSlotsRef.current[i]
                )
              )
            }
          >
            <div
              title={`${slot.size} parking`}
              onClick={() =>
                slot.occupied && !editing
                  ? setForManaging({ open: true, content: slot })
                  : null
              }
              className={`${slot.occupied && "bg-red-300 cursor-pointer"} ${
                editing && "cursor-move"
              }  h-12 w-12 border-2 border-yellow-200 grid place-content-center absolute text-2xl`}
            >
              {slot.size?.charAt(0).toUpperCase()}
            </div>
          </Draggable>
        ))}
      </div>

      {isParking && (
        <ParkModal
          park={handlePark}
          closeModal={handleCloseModal}
          car={car}
          setCar={setCar}
        />
      )}
    </>
  );
}
