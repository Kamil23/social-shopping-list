import { formatDate } from "@/helpers";
import { Item } from "@/types/sessionList";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";

export default function ListItem({
  data,
  toggleCheck,
  handleDelete,
}: {
  data: Item;
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

  useEffect(() => {
    setUpdateTime(formatDate(updatedAt));
  }, [updatedAt]);

  return (
    <div
      className={`w-full flex p-2 space-x-2 items-center text-slate-800 ${clsx({
        ["line-through text-slate-400"]: isChecked,
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
          {updateTime}
        </div>
      </div>
      <button className="px-2" onClick={() => handleDelete(id)}>
        <FiTrash className="text-xl" />
      </button>
    </div>
  );
}
