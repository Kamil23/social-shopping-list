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
  useRef,
  useState,
} from "react";
import Empty from "@/components/Empty";
import { APIUrl } from "@/enum";
import { sortByUpdatedAtAndIsDisabled } from "@/helpers";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "@/helpers/StrictModeDroppable";
import { updateSession } from "@/requests";

export default function SessionList({
  sessionData,
}: {
  sessionData: SessionData;
}) {
  const now = new Date();
  const router = useRouter();
  const { items } = sessionData || {};
  const [inputValue, setInputValue] = useState("");
  const [localItems, setLocalItems] = useState(
    items?.sort(sortByUpdatedAtAndIsDisabled) || []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [draggableId, setDraggableId] = useState("");

  const dragItem: MutableRefObject<Item> = useRef({} as Item);

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

      setLocalItems(
        [...localItems, submittedData].sort(sortByUpdatedAtAndIsDisabled)
      );
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

    const tasks = [...localItems];
    const [reorderedItem] = tasks.splice(result.source.index, 1);

    tasks.splice(result.destination.index, 0, reorderedItem);

    tasks.map((task, index) => (task.sortOrder = index + 1));

    setLocalItems(tasks.sort(sortByUpdatedAtAndIsDisabled));
    setIsDragging(false);

    await updateSession(tasks, router.query.sessionId);
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
      const sortedItems = localItems.sort(sortByUpdatedAtAndIsDisabled);
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
    } catch (error) {
      console.error("Modify list item error: ", error);
    }
  };

  const _tempList = JSON.parse(JSON.stringify(localItems));
  const lastUpdate = _tempList.sort((a: Item, b: Item) =>
    b.updatedAt.localeCompare(a.updatedAt)
  )[0]?.updatedAt;

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
              <ListTitle updatedAt={lastUpdate} />
              <div className="flex flex-col">
                {localItems?.map((item: Item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <article
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <ListItem
                          key={item.id}
                          data={item}
                          isDragging={isDragging}
                          draggableId={draggableId}
                          toggleCheck={toggleCheck}
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
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
};
