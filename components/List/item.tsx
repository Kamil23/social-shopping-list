import { Item } from "@/types/sessionList";
import clsx from "clsx";
import { Dispatch, SetStateAction, useState } from "react";
import { RiLoader5Fill } from "react-icons/ri";
import { RxDragHandleDots2 } from "react-icons/rx";

export default function ListItem({
  data,
  isDragging,
  isLoading,
  draggableId,
  toggleCheck,
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
}) {
  const { id, title, updatedAt, isDisabled } = data;
  const [isChecked, setIsChecked] = useState(isDisabled || false);
  const [updateTime, setUpdateTime] = useState(updatedAt);

  return (
    <div
      className={`flex p-2 space-x-2 items-center text-slate-800 ${clsx({
        ["line-through text-slate-400"]: isChecked,
        ["bg-yellow-100 text-slate-300"]: isDragging && draggableId === id,
      })}`}
    >
      <input
        type="checkbox"
        className="w-6 h-6"
        checked={isChecked}
        onChange={() => toggleCheck(id, isChecked, setIsChecked, setUpdateTime)}
      />
      <div className="flex w-full justify-between items-center">
        <div>{title}</div>
        <div className="flex relative">
          <RxDragHandleDots2 className="mr-4 text-xl" />
          {isLoading && draggableId === id ? (
            <RiLoader5Fill
              className={`animate-spin text-xs absolute right-0`}
            />
          ) : null}
        </div>
      </div>

      <div className="flex h-0 items-baseline">
        <div className="text-[8px]">
          {new Date(updateTime).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
