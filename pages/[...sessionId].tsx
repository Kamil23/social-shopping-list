import ListItem from "@/components/List/item";
import ListTitle from "@/components/List/title";
import Layout from "@/components/layout";
import Head from "next/head";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { Item, SessionData } from "@/types/sessionList";
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
  constructPayload,
  convertBlobToJSON,
  scrollToBottomWithKeyboardAdjustment,
  sortBySortOrder,
} from "@/helpers";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "@/helpers/StrictModeDroppable";
import { deleteItem, updateSession } from "@/requests";

export default function SessionList({
  sessionData,
  websocketUrl,
}: {
  sessionData: SessionData;
  websocketUrl: string;
}) {
  const now = new Date();
  const router = useRouter();
  const { items } = sessionData || {};
  const [inputValue, setInputValue] = useState("");
  const [localItems, setLocalItems] = useState(
    items?.sort(sortBySortOrder) || []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [draggableId, setDraggableId] = useState("");
  const [connectionCount, setConnectionCount] = useState(0);

  /** WEBSOCKET */
  const wsRef: MutableRefObject<WebSocket | undefined> = useRef();

  useEffect(() => {
    if (sessionData?.id && !wsRef.current) {
      wsRef.current = new WebSocket(`${websocketUrl}/${sessionData.id}`);

      wsRef.current.onopen = (event) => {
        // WebSocket opened
      };

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
                shouldUpdate && setLocalItems([...localItems, obj].sort(sortBySortOrder));
              }
            } catch (err) {
              console.error(err);
            }
            break;
          case WebsocketMessageType.UPDATE:
            alert("update");
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
          default:
            break;
        }
      };
    }
  }, [localItems]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
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
          constructPayload(WebsocketMessageType.CREATE, submittedData)
        );
      }
    } catch (error) {
      console.error("Create item error: ", error);
    }
  };

  interface DraggableData {
    draggableId: string;
    mode: string;
    source: {};
    type: string;
  }

  const handleOnDragStart = async (result: DraggableData) => {
    setIsDragging(true);
    setDraggableId(result.draggableId);
  };

  const handleOnDragEnd = async (result: any) => {
    if (!result.destination) return;

    const list = [...localItems];
    const [reorderedItem] = list.splice(result.source.index, 1);

    if (result.source.index === result.destination.index) {
      setIsDragging(false);
      return;
    }

    setIsLoading(true);

    list.splice(result.destination.index, 0, reorderedItem);

    list.map((task, index) => (task.sortOrder = index + 1));

    setLocalItems(list.sort(sortBySortOrder));
    setIsDragging(false);

    await updateSession(list, router.query.sessionId);
    setIsLoading(false);
    setIsDragging(false);
    if (wsRef.current) {
      wsRef.current.send(
        constructPayload(WebsocketMessageType.POSITION_CHANGE, list)
      );
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
        wsRef.current.send(constructPayload(WebsocketMessageType.TOGGLE_CHECK, modifiedData));
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
    const list = JSON.parse(JSON.stringify(localItems));
    const updatedList = list.filter((item: Item) => item.id !== id);
    setLocalItems([...updatedList.sort(sortBySortOrder)]);
    await deleteItem(id);
    if (wsRef.current) {
      wsRef.current.send(constructPayload(WebsocketMessageType.DELETE, { id }));
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
      <DragDropContext
        onDragEnd={handleOnDragEnd}
        onDragStart={handleOnDragStart}
      >
        <StrictModeDroppable droppableId="list">
          {(provided) => (
            <section {...provided.droppableProps} ref={provided.innerRef}>
              <ListTitle updatedAt={lastUpdate} connectionCount={connectionCount} />
              <div className="flex flex-col">
                {localItems?.map((item: Item, index) => (
                  <Draggable draggableId={item.id} key={item.id} index={index}>
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
                        />
                      </article>
                    )}
                  </Draggable>
                ))}
              </div>
              {provided.placeholder}
            </section>
          )}
        </StrictModeDroppable>
        <Input
          handleChange={setInputValue}
          handleSubmit={handleSubmit}
          value={inputValue}
        />
      </DragDropContext>
    );
  };

  return (
    <Layout>
      <Head>
        <title>{`Lista zakupowa: ${router.query.sessionId}`}</title>
      </Head>
      {renderContent()}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
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
