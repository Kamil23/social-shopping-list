import clsx from "clsx";
import { Dispatch, SetStateAction, useState } from "react";

export default function ListItem({
  id,
  name,
  updatedAt,
  isDisabled,
  toggleCheck
}: {
  id: string;
  name: string;
  updatedAt: string;
  isDisabled: boolean;
  toggleCheck: (id: string, isChecked: boolean, setIsChecked: Dispatch<SetStateAction<boolean>>, setUpdateTime: Dispatch<SetStateAction<string>>) => void
}) {
  const [isChecked, setIsChecked] = useState(isDisabled || false);
  const [updateTime, setUpdateTime] = useState(updatedAt);

  return (
    <div className={`flex space-x-2 items-baseline ${clsx({
      ['line-through text-gray-400']: isChecked
    })}`}>
      <input type="checkbox" checked={isChecked} onChange={() => toggleCheck(id, isChecked, setIsChecked, setUpdateTime)} />
      <div>{name}</div>
      <div className="text-[10px]">{updateTime}</div>
    </div>
  );
}
