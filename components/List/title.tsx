import { updateSessionName } from "@/requests";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

const ListTitle = ({ isEditing, setIsEditing, name, setListName }) => {
  const [title, setTitle] = useState(name);
  const sessionId = window.location.pathname.split("/")[1];

  const refreshLocalStorageData = (title, sessionId) => {
    if (!window) {
      return;
    }
    const favoritesList = window.localStorage.getItem("favoritesList");
    if (!favoritesList) {
      return;
    }
    const parsedFavoritesList = JSON.parse(favoritesList);
    const updatedFavoritesList = parsedFavoritesList.map((list) => {
      if (list.id === sessionId) {
        return {
          ...list,
          name: title,
        };
      }
      return list;
    });
    window.localStorage.setItem(
      "favoritesList",
      JSON.stringify(updatedFavoritesList)
    );
  };

  useEffect(() => {
    setTitle(name);
  }, [name]);

  return isEditing ? (
    <div className="flex flex-1 h-[56px]">
      <input
        type="text"
        autoFocus={true}
        value={title}
        className="w-full p-1 text-base text-dark-blue focus:outline-none"
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex space-x-4">
        <button
          className="p-2 text-lg text-dark-blue"
          onClick={() => {
            setIsEditing(false);
            setTitle(name);
          }}
        >
          <XMarkIcon width={24} height={24} />
        </button>
        <button
          className="p-2 text-lg text-dark-blue"
          onClick={() => {
            updateSessionName({ name: title }, sessionId);
            setTitle(title);
            setListName(title);
            setIsEditing(false);
            refreshLocalStorageData(title, sessionId);
          }}
        >
          <CheckIcon width={24} height={24} />
        </button>
      </div>
    </div>
  ) : (
    <div
      className="p-1 text-base text-dark-blue"
      onClick={() => setIsEditing(true)}
    >
      {title}
    </div>
  );
};

export default ListTitle;
