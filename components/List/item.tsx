import { Item } from "@/types/sessionList";
import clsx from "clsx";
import {
  Dispatch,
  DragEvent,
  MutableRefObject,
  SetStateAction,
  useState,
} from "react";

export default function ListItem({
  data,
  toggleCheck,
  handleDragStart,
  handleDragEnter,
  dragging,
  currentDragItem,
}: {
  data: Item;
  toggleCheck: (
    id: string,
    isChecked: boolean,
    setIsChecked: Dispatch<SetStateAction<boolean>>,
    setUpdateTime: Dispatch<SetStateAction<string>>
  ) => void;
  handleDragStart: (e: DragEvent<HTMLDivElement>, item: Item) => void;
  handleDragEnter: (e: DragEvent<HTMLDivElement>, item: Item) => void;
  dragging: boolean;
  currentDragItem: MutableRefObject<Item>;
}) {
  const { id, title, updatedAt, isDisabled } = data;
  const [isChecked, setIsChecked] = useState(isDisabled || false);
  const [updateTime, setUpdateTime] = useState(updatedAt);

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, data)}
      onDragEnter={(e) => handleDragEnter(e, data)}
      className={`flex p-2 space-x-2 items-baseline text-slate-800 rounded-md ${clsx(
        {
          ["line-through text-slate-400"]: isChecked,
          ["bg-yellow-100 text-slate-300"]:
            dragging && currentDragItem.current.id === id,
        }
      )}`}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => toggleCheck(id, isChecked, setIsChecked, setUpdateTime)}
      />
      <div>{title}</div>
      <div className="text-[10px]">{updateTime}</div>
    </div>
  );
}
