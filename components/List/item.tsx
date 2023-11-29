import { Item } from "@/types/sessionList";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RiLoader5Fill } from "react-icons/ri";
import Checkbox from "../Checkbox";
import Image from "next/image";

export default function ListItem({
  data,
  isDragging,
  isLoading,
  draggableId,
  toggleCheck,
  handleDelete,
}: {
  data: Item;
  isDragging: boolean;
  isLoading: boolean;
  draggableId: string;
  toggleCheck: (
    id: string,
    isChecked: boolean,
    setIsChecked: Dispatch<SetStateAction<boolean>>,
    setUpdateTime: Dispatch<SetStateAction<string>>
  ) => void;
  handleDelete: (id: string) => void;
}) {
  const { id, title, updatedAt, isDisabled } = data;
  const [isChecked, setIsChecked] = useState(isDisabled || false);
  const [updateTime, setUpdateTime] = useState(updatedAt);

  const renderDate = (itemDateString: string) => {
    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
    const nowUnix = new Date().getTime();
    const itemDateUnix = new Date(itemDateString).getTime();

    if (nowUnix - itemDateUnix <= ONE_DAY_IN_MS) {
      return new Date(updateTime).toLocaleTimeString().slice(0, -3);
    }
    return new Date(updateTime).toLocaleDateString();
  };

  useEffect(() => {
    setIsChecked(isDisabled);
    setUpdateTime(updatedAt);
  }, [isDisabled, updatedAt]);
  return (
    <div
      className={`w-full flex px-4 py-2 space-x-2 items-center ${clsx({
        ["line-through text-slate-400"]: isChecked,
        ["bg-light-blue text-slate-300"]: isDragging && draggableId === id,
      })}`}
    >
      <Checkbox isChecked={isChecked} isDisabled={false} onChange={() => toggleCheck(id, isChecked, setIsChecked, setUpdateTime)} id={id}/>
      <div className="flex w-full justify-between items-center">
        <div className={`mx-4 font-anek-latin text-base font-light text-[#3D3D3E] ${clsx({
        ["opacity-50"]: isChecked,
      })}`}>{title}</div>
        <div className="flex relative items-center">
          {isLoading && draggableId === id ? (
            <RiLoader5Fill
              className={`animate-spin text-lg absolute right-2 text-slate-300`}
            />
          ) : null}
        </div>
      </div>
      {/** TODO next feature */}
      {/* <div className="flex items-center">
        <button className="w-12 mr-4 flex justify-center items-center">
          <Image
            src="/icons/urgent!.svg"
            alt="ikona przycisku dodaj do ulubionych"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
      </div> */}
      <button className="w-12" onClick={() => handleDelete(id)}>
      <Image
            src="/icons/close.svg"
            alt="ikona przycisku usuń element"
            width={16}
            height={16}
            className="w-3 h-3"
          />
      </button>
      </div>
  );
}
