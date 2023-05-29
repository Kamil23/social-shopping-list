import { Item } from "@/types/sessionList";
import clsx from "clsx";
import { Dispatch, SetStateAction, useState } from "react";
import { FiTrash } from "react-icons/fi";

export default function ListItem({
  data,
  isDragging,
  draggableId,
  toggleCheck,
  handleDelete,
}: {
  data: Item;
  isDragging: boolean;
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

  return (
    <div
      className={`w-full flex p-2 space-x-2 items-center text-slate-800 ${clsx({
        ["line-through text-slate-400"]: isChecked,
        ["bg-yellow-300 text-slate-300"]: isDragging && draggableId === id,
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
      </div>

      <div className="flex h-0 items-end">
        <div className="text-[8px]">
          {renderDate(updatedAt)}
        </div>
      </div>
      <button className="px-2" onClick={() => handleDelete(id)}>
        <FiTrash className="text-xl" />
      </button>
    </div>
  );
}
