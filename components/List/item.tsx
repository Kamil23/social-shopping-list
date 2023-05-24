import { APIUrl } from "@/enum";
import clsx from "clsx";
import { useState } from "react";

export default function ListItem({
  id,
  name,
  updatedAt,
  isDisabled,
}: {
  id: string;
  name: string;
  updatedAt: string;
  isDisabled: boolean;
}) {
  const [isChecked, setIsChecked] = useState(isDisabled || false);
  const [updateTime, setUpdateTime] = useState(updatedAt);
  const handleCheck = async () => {
    try {
      const now = new Date().toISOString();
      const modifiedData = {
        id,
        updatedAt: now,
        isDisabled: !isChecked,
      };
      setIsChecked(!isChecked);
      setUpdateTime(now);

      const JSONdata = JSON.stringify(modifiedData);
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONdata,
      };
      await fetch(APIUrl.ModifyItem, options);
    } catch (error) {
      console.error("Modify list item error: ", error);
    }
  };
  return (
    <div className={`flex space-x-2 items-baseline ${clsx({
      ['line-through text-gray-400']: isChecked
    })}`}>
      <input type="checkbox" checked={isChecked} onChange={handleCheck} />
      <div>{name}</div>
      <div className="text-[10px]">{updateTime}</div>
    </div>
  );
}
