import { WebsocketMessageType } from "@/enum";
import { sortBySortOrder, constructWebsocketPayloadMsg } from "@/helpers";
import { deleteItem } from "@/requests";
import { Item } from "@/types/sessionList";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, forwardRef } from "react";
import Image from "next/image";

const DeleteItemModal = forwardRef(
  (
    {
      isOpen,
      selectedItem,
      setIsOpen,
      localItems,
      setLocalItems,
    }: {
      isOpen: boolean;
      selectedItem: Item;
      setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
      localItems: Item[];
      setLocalItems: React.Dispatch<React.SetStateAction<Item[]>>;
    },
    ref: React.MutableRefObject<WebSocket | null>
  ) => {
    const handleDeleteItem = async (id: string) => {
      const list = JSON.parse(JSON.stringify(localItems));
      const updatedList = list.filter((item: Item) => item.id !== id);
      setLocalItems([...updatedList.sort(sortBySortOrder)]);
      await deleteItem(id);
      if (ref.current) {
        ref.current.send(
          constructWebsocketPayloadMsg(WebsocketMessageType.DELETE, { id })
        );
      }
      setIsOpen(false);
    };

    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="mt-10 relative">
                    <p className="text-xl text-[#000F1D] font-anek-latin font-light leading-7 text-center">
                      Czy na pewno chcesz usunąć{" "}
                      <b className="text-primary-red font-semibold">
                        {selectedItem?.title}
                      </b>{" "}
                      ze swojej listy produktów?
                    </p>
                    <button
                      className="p-6 absolute -right-4 top-[-60px]"
                      onClick={() => setIsOpen(false)}
                    >
                      <Image
                        src="/icons/close-modal.svg"
                        alt="ikona zamknięcia modala"
                        width={10}
                        height={10}
                        className=""
                      />
                    </button>
                  </div>

                  <div className="mt-4 p-6 flex justify-center items-center">
                    <button
                      type="button"
                      className="px-6 py-4 rounded-lg bg-primary-red text-white-on-red font-anek-latin font-light text-base w-full"
                      onClick={() => handleDeleteItem(selectedItem.id)}
                    >
                      Usuń
                    </button>
                    <button
                      type="button"
                      className="px-6 py-4 rounded-lg text-[#000F1D]  font-anek-latin font-light text-base w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Nie usuwaj
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }
);

DeleteItemModal.displayName = "Modal";

export default DeleteItemModal;
