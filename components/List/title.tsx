import { updateSessionName } from "@/requests";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

const ListTitle = ({ isEditing, setIsEditing, name }) => {
  const [title, setTitle] = useState(name);
  const sessionId = window.location.pathname.split("/")[1];
  useEffect(() => {
    setTitle(name);
  }, [name]);
  return isEditing ? (
    <div className="flex flex-1 h-[56px]">
      <input
        type="text"
        autoFocus={true}
        value={title}
        className="w-full p-1 text-xl text-dark-blue focus:outline-none"
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex space-x-4">
        <button
          className="p-2 text-xl text-dark-blue"
          onClick={() => {
            setIsEditing(false);
            setTitle(name);
          }}
        >
          <XMarkIcon width={24} height={24} />
        </button>
        <button
          className="p-2 text-xl text-dark-blue"
          onClick={() => {
            updateSessionName({ name: title }, sessionId);
            setTitle(title);
            setIsEditing(false);
          }}
        >
          <CheckIcon width={24} height={24} />
        </button>
      </div>
    </div>
  ) : (
    <div
      className="p-1 text-xl text-dark-blue"
      onClick={() => setIsEditing(true)}
    >
      {title}
    </div>
  );
};

export default ListTitle;
