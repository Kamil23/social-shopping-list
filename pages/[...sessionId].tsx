import ListItem from "@/components/List/item";
import ListHeader from "@/components/List/header";
import Layout from "@/components/layout";
import Head from "next/head";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { DraggableData, Item, SessionData } from "@/types/sessionList";
import Input from "@/components/List/input";
import {
  Dispatch,
  FormEvent,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Empty from "@/components/Empty";
import { APIUrl, WebsocketMessageType } from "@/enum";
import {
  constructWebsocketPayloadMsg,
  convertBlobToJSON,
  scrollToBottomWithKeyboardAdjustment,
  sortBySortOrder,
} from "@/helpers";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "@/helpers/StrictModeDroppable";
import { updateSession } from "@/requests";
import TypingComponent from "@/components/TypingComponent";
import DeleteItemModal from "@/components/Modal/DeleteItem";
import Line from "@/components/Line";
import ProgressBar from "@/components/ProgressBar";
import useConfetti from "@/hooks/useConfetti";
import AddButton from "@/components/AddButton";

export default function SessionList({
  sessionData,
  websocketUrl,
}: {
  sessionData: SessionData;
  websocketUrl: string;
}) {
  const router = useRouter();
  const { items, id, name } = sessionData || {};
  const [listName, setListName] = useState(sessionData?.name || "Lista" || "");
  const [inputValue, setInputValue] = useState("");
  const [localItems, setLocalItems] = useState(
    items?.sort(sortBySortOrder) || []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [draggableId, setDraggableId] = useState("");
  const [connectionCount, setConnectionCount] = useState(0);
  const [myTyping, setMyTyping] = useState(false);
  const [receivedTyping, setReceivedTyping] = useState(false);
  const [clientWebsocketId, setClientWebsocketId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  const [itemsCheckedCount, setItemsCheckedCount] = useState(
    items?.filter((item) => item.isDisabled).length || 0
  );
  const [activeInput, setActiveInput] = useState(false);
  const { setTriggered: triggerConfetti } = useConfetti();
  debugger;

  useEffect(() => {
    if (name) {
      setListName(name);
    }
    if (items) {
      setLocalItems(items.sort(sortBySortOrder));
    }
  }, [name, items]);

  useEffect(() => {
    const itemsCheckedCount = localItems.filter(
      (item) => item.isDisabled
    ).length;
    setItemsCheckedCount(itemsCheckedCount);
  }, [localItems]);

  useEffect(() => {
    if (itemsCheckedCount && itemsCheckedCount === localItems.length) {
      triggerConfetti(true);
    }
  }, [itemsCheckedCount, localItems, triggerConfetti]);

  /** WEBSOCKET */
  const wsRef: MutableRefObject<WebSocket | undefined> = useRef();

  useEffect(() => {
    if (sessionData?.id && !wsRef.current) {
      wsRef.current = new WebSocket(`${websocketUrl}/${sessionData.id}`);

      wsRef.current.onopen = (event) => {};

      wsRef.current.onerror = (event) => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    }
  }, [sessionData, websocketUrl]);

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.onmessage = async (event) => {
        let json;
        if (typeof event.data === "string") {
          json = JSON.parse(event.data);
        } else {
          json = await convertBlobToJSON(event.data);
        }

        const { type, data } = json;

        switch (type) {
          case WebsocketMessageType.CLIENT_CONNECTED:
            setClientWebsocketId(data);
            break;
          case WebsocketMessageType.CREATE:
            const {
              id,
              title,
              createdAt,
              updatedAt,
              sessionId,
              isDisabled,
              sortOrder,
            } = data || undefined;
            try {
              if (typeof json === "object") {
                const obj = {
                  id,
                  title,
                  createdAt,
                  updatedAt,
                  sessionId,
                  isDisabled,
                  sortOrder,
                };
                const shouldUpdate = !localItems.find(
                  (item) => item.id === obj.id
                );
                shouldUpdate &&
                  setLocalItems([...localItems, obj].sort(sortBySortOrder));
                setReceivedTyping(false);
              }
            } catch (err) {
              console.error(err);
            }
            break;
          case WebsocketMessageType.UPDATE:
            const indexOfUpdatedItem = localItems.findIndex(
              (item) => item.id === data.id
            );
            localItems[indexOfUpdatedItem].updatedAt = data.updatedAt;
            localItems[indexOfUpdatedItem].title = data.title;
            setLocalItems([...localItems]);
            break;
          case WebsocketMessageType.DELETE:
            const filteredItems = localItems.filter(
              (item) => item.id !== data.id
            );
            setLocalItems([...filteredItems]);
            break;
          case WebsocketMessageType.TOGGLE_CHECK:
            const indexOfSelectedItem = localItems.findIndex(
              (item) => item.id === data.id
            );
            localItems[indexOfSelectedItem].updatedAt = data.updatedAt;
            localItems[indexOfSelectedItem].isDisabled = data.isDisabled;
            const sortedItems = localItems.sort(sortBySortOrder);
            setLocalItems([...sortedItems]);
            break;
          case WebsocketMessageType.POSITION_CHANGE:
            setLocalItems([...data]);
            break;
          case WebsocketMessageType.CONNECTION_COUNT:
            setConnectionCount(data);
            break;
          case WebsocketMessageType.START_TYPING:
            setReceivedTyping(data.clientId !== clientWebsocketId);
            setMyTyping(data.clientId === clientWebsocketId);
            debugger;
            break;
          case WebsocketMessageType.STOP_TYPING:
            setReceivedTyping(false);
            break;
          default:
            break;
        }
      };
    }
  }, [localItems, clientWebsocketId]);

  const handleAddItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const now = new Date();
      const itemsLength = localItems.length;
      const submittedData = {
        id: window.crypto.randomUUID(),
        title: inputValue,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        sessionId: sessionData.id,
        isDisabled: false,
        sortOrder: itemsLength + 1,
      };

      const section = document.getElementsByTagName("section")[0];
      const keyboardHeight = 250;
      const formHeight = document.getElementsByTagName("form")[0].clientHeight;
      if (
        section.clientHeight >=
        document.documentElement.scrollHeight - keyboardHeight - formHeight
      ) {
        setTimeout(function () {
          scrollToBottomWithKeyboardAdjustment();
        }, 100);
      }
      setInputValue("");

      const JSONdata = JSON.stringify(submittedData);
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONdata,
      };
      await fetch(APIUrl.CreateItem, options);

      setLocalItems([...localItems, submittedData].sort(sortBySortOrder));

      if (wsRef.current) {
        wsRef.current.send(
          constructWebsocketPayloadMsg(
            WebsocketMessageType.CREATE,
            submittedData
          )
        );
      }
    } catch (error) {
      console.error("Create item error: ", error);
    }
  };

  const handleOnDragStart = async (result: DraggableData) => {
    try {
      setIsDragging(true);
      setDraggableId(result.draggableId);
    } catch (error) {
      console.error("Drag start error: ", error);
    }
  };

  const handleOnDragEnd = async (result: any) => {
    try {
      if (!result.destination) return;

      const list = [...localItems];
      const [reorderedItem] = list.splice(result.source.index, 1);
      const now = new Date().toISOString();
      reorderedItem.updatedAt = now;

      if (result.source.index === result.destination.index) {
        setIsDragging(false);
        return;
      }

      setIsLoading(true);

      list.splice(result.destination.index, 0, reorderedItem);
      list.map((task, index) => (task.sortOrder = index + 1));

      setLocalItems(list.sort(sortBySortOrder));
      await updateSession(list, router.query.sessionId);
      setIsLoading(false);
      setIsDragging(false);
      if (wsRef.current) {
        wsRef.current.send(
          constructWebsocketPayloadMsg(
            WebsocketMessageType.POSITION_CHANGE,
            list
          )
        );
      }
    } catch (error) {
      console.error("Drag end error: ", error);
    }
  };

  const toggleCheck = async (
    id: string,
    isChecked: boolean,
    setIsChecked: Dispatch<SetStateAction<boolean>>,
    setUpdateTime: Dispatch<SetStateAction<string>>
  ) => {
    try {
      const now = new Date().toISOString();
      const modifiedData = {
        id,
        updatedAt: now,
        isDisabled: !isChecked,
      };
      setIsChecked(!isChecked);
      setUpdateTime(now);

      const indexOfSelectedItem = localItems.findIndex(
        (item) => item.id === id
      );
      localItems[indexOfSelectedItem].updatedAt = now;
      localItems[indexOfSelectedItem].isDisabled = !isChecked;
      const sortedItems = localItems.sort(sortBySortOrder);
      setLocalItems([...sortedItems]);
      setItemsCheckedCount(
        sortedItems.filter((item) => item.isDisabled).length
      );

      const JSONdata = JSON.stringify(modifiedData);
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONdata,
      };
      await fetch(APIUrl.UpdateItem, options);
      if (wsRef.current) {
        wsRef.current.send(
          constructWebsocketPayloadMsg(
            WebsocketMessageType.TOGGLE_CHECK,
            modifiedData
          )
        );
      }
    } catch (error) {
      console.error("Modify list item error: ", error);
    }
  };

  const handleEditItem = async (id: string, title: string) => {
    try {
      const now = new Date().toISOString();
      const modifiedData = {
        id,
        title,
        updatedAt: now,
      };

      const indexOfSelectedItem = localItems.findIndex(
        (item) => item.id === id
      );
      localItems[indexOfSelectedItem].updatedAt = now;
      localItems[indexOfSelectedItem].title = title;
      const sortedItems = localItems.sort(sortBySortOrder);
      setLocalItems([...sortedItems]);

      const JSONdata = JSON.stringify(modifiedData);
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONdata,
      };
      await fetch(APIUrl.UpdateItem, options);
      if (wsRef.current) {
        wsRef.current.send(
          constructWebsocketPayloadMsg(
            WebsocketMessageType.UPDATE,
            modifiedData
          )
        );
      }
    } catch (error) {
      console.error("Modify list item error: ", error);
    }
  };

  const _tempList = JSON.parse(JSON.stringify(localItems));
  const lastUpdate =
    _tempList.sort((a: Item, b: Item) =>
      b.updatedAt.localeCompare(a.updatedAt)
    )[0]?.updatedAt || sessionData?.updatedAt;

  const handleDeleteItem = async (id: string) => {
    const itemToDelete = localItems.find((item: Item) => item.id === id);
    setSelectedItem(itemToDelete);
    setIsModalOpen(true);
  };

  const handleChangeInput = (value: string) => {
    try {
      setInputValue(value);
      if (myTyping) return;

      setTimeout(() => {
        if (wsRef.current) {
          wsRef.current.send(
            constructWebsocketPayloadMsg(WebsocketMessageType.STOP_TYPING, {
              value,
              clientId: clientWebsocketId,
            })
          );
        }
        setMyTyping(false);
      }, 5000);

      if (wsRef.current) {
        wsRef.current.send(
          constructWebsocketPayloadMsg(WebsocketMessageType.START_TYPING, {
            value,
            clientId: clientWebsocketId,
          })
        );
      }
    } catch (error) {
      console.error("Typing error: ", error);
    }
  };

  const renderContent = () => {
    if (!sessionData?.id) {
      return (
        <div className="flex justify-center items-center h-full">
          <Empty />
        </div>
      );
    }
    return (
      <>
        <DragDropContext
          onDragEnd={handleOnDragEnd}
          onDragStart={handleOnDragStart}
        >
          <StrictModeDroppable droppableId={id}>
            {(provided) => {
              return (
                <section {...provided.droppableProps} ref={provided.innerRef}>
                  <ListHeader
                    updatedAt={lastUpdate}
                    connectionCount={connectionCount}
                    listName={listName}
                    setListName={setListName}
                    sessionData={sessionData}
                  />
                  <Line />
                  <div
                    className={`flex flex-col m-1 ${
                      itemsCheckedCount > 0 && !activeInput
                        ? "mb-[150px]"
                        : "mb-0"
                    }`}
                  >
                    {localItems?.map((item: Item, index) => {
                      return (
                        <Draggable
                          draggableId={item.id}
                          key={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <article
                              className="w-full"
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <ListItem
                                key={item.id}
                                data={item}
                                isDragging={isDragging}
                                isLoading={isLoading}
                                draggableId={draggableId}
                                toggleCheck={toggleCheck}
                                handleDelete={handleDeleteItem}
                                handleEdit={handleEditItem}
                              />
                            </article>
                          )}
                        </Draggable>
                      );
                    })}
                  </div>
                  {provided.placeholder}
                </section>
              );
            }}
          </StrictModeDroppable>
          {!myTyping && receivedTyping ? <TypingComponent /> : null}
          {activeInput ? (
            <Input
              handleChange={handleChangeInput}
              handleSubmit={handleAddItem}
              value={inputValue}
              itemsCheckedCount={itemsCheckedCount}
            />
          ) : null}
        </DragDropContext>
        {activeInput ? null : (
          <AddButton
            handler={() => setActiveInput(true)}
            itemsCheckedCount={itemsCheckedCount}
          />
        )}
        {itemsCheckedCount === 0 ? null : (
          <ProgressBar
            allItemsCount={localItems.length}
            itemsCheckedCount={itemsCheckedCount}
          />
        )}
      </>
    );
  };

  return (
    <Layout>
      <Head>
        <title>{`${listName} | freshlist.pl`}</title>
      </Head>
      <DeleteItemModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        selectedItem={selectedItem}
        localItems={localItems}
        setLocalItems={setLocalItems}
        ref={wsRef}
      />
      {renderContent()}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { sessionId } = context.params;
  try {
    const sessionData = await prisma.session.findUnique({
      where: { id: sessionId[0] },
      include: {
        items: true,
      },
    });
    return {
      props: {
        sessionData: JSON.parse(JSON.stringify(sessionData)),
        websocketUrl: process.env.WEBSOCKET_URL,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
};
