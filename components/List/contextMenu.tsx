import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { createSession } from "@/requests";
import { useRouter } from "next/router";

const ContextMenu = ({ setIsEditing, handleShare, sessionData }) => {
  const router = useRouter();
  const handleCreateSession = async () => {
    const sessionId = await createSession();
    router.push(sessionId);
  };
  const handleAddToFavorites = () => {
    if (!window) {
      return;
    }
    const favoritesList = window.localStorage.getItem("favoritesList");
    if (!favoritesList) {
      window.localStorage.setItem(
        "favoritesList",
        JSON.stringify([sessionData])
      );
      return;
    }
    const parsedFavoritesList = JSON.parse(favoritesList);
    const isListAlreadyAdded = parsedFavoritesList.find(
      (list) => list.id === sessionData.id
    );
    if (isListAlreadyAdded) {
      return;
    }
    parsedFavoritesList.push(sessionData);
    window.localStorage.setItem(
      "favoritesList",
      JSON.stringify(parsedFavoritesList)
    );
  };
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex flex-col space-y-[3px] px-7 py-5">
          <Image
            src="/icons/dot.svg"
            alt="kropka z menu"
            width={3}
            height={3}
          />
          <Image
            src="/icons/dot.svg"
            alt="kropka z menu"
            width={3}
            height={3}
          />
          <Image
            src="/icons/dot.svg"
            alt="kropka z menu"
            width={3}
            height={3}
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 p-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1 space-y-2">
            <Menu.Item>
              <button
                className={`group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={() => setIsEditing(true)}
              >
                <div className="flex space-x-2">
                  <Image
                    src="/icons/pen.svg"
                    alt="ikona długopisu"
                    width={18}
                    height={18}
                    className="mx-2"
                  />
                  <span className="text-base text-[#000F1D]">Edytuj nazwę</span>
                </div>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={`group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={() => handleShare()}
              >
                <div className="flex space-x-2">
                  <Image
                    src="/icons/link.svg"
                    alt="ikona udostępniania"
                    width={18}
                    height={18}
                    className="mx-2"
                  />
                  <span className="text-base text-[#000F1D]">
                    Udostępnij listę
                  </span>
                </div>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={`group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={() => handleAddToFavorites()}
              >
                <div className="flex space-x-2">
                  <Image
                    src="/icons/heart.svg"
                    alt="ikona dodaj do ulubionych"
                    width={18}
                    height={18}
                    className="mx-2"
                  />
                  <span className="text-base text-[#000F1D]">
                    Dodaj do ulubionych
                  </span>
                </div>
              </button>
            </Menu.Item>
          </div>
          <div className="px-1 py-5 space-y-2">
            <Menu.Item>
              <button
                className={`group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={() => router.push('/')}
              >
                <div className="flex space-x-2">
                    <Image
                      src="/icons/document.svg"
                      alt="ikona moje listy"
                      width={16}
                      height={28}
                      className="mx-2"
                    />

                  <span className="text-base text-[#000F1D]">
                    Moje listy
                  </span>
                </div>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={`group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={() => handleCreateSession()}
              >
                <div className="flex space-x-2 justify-center items-center">
                  <div className="mx-2 flex justify-center items-center border rounded-[4px] border-[#579AD9] w-4 h-4">
                    <Image
                      src="/icons/plus-context.svg"
                      alt="ikona dodaj nową listę"
                      width={7}
                      height={7}
                    />
                  </div>

                  <span className="text-base text-[#000F1D]">
                    Stwórz nową listę
                  </span>
                </div>
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ContextMenu;
