import ListItem from "@/components/List/item";
import ListTitle from "@/components/List/title";
import Layout from "@/components/layout";
import Head from "next/head";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { Item, Nullable, SessionData } from "@/types/sessionList";
import Input from "@/components/List/input";
import {
  Dispatch,
  DragEvent,
  FormEvent,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
import Empty from "@/components/Empty";
import { APIUrl } from "@/enum";
import { sortByUpdatedAtAndIsDisabled } from "@/helpers";

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
  const [dragging, setDragging] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const submittedData = {
        id: window.crypto.randomUUID(),
        title: inputValue,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        sessionId: sessionData.id,
        isDisabled: false,
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
      await fetch(APIUrl.ModifyItem, options);
    } catch (error) {
      console.error("Modify list item error: ", error);
    }
  };
  const dragItem: MutableRefObject<Item> = useRef({} as Item);
  const dragNode: MutableRefObject<Nullable<EventTarget>> = useRef(
    {} as HTMLInputElement
  );

  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: Item) => {
    setTimeout(() => {
      setDragging(true);
    }, 0);
    dragItem.current = item;
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", handleDragEnd);
  };

  const handleDragEnd = () => {
    setDragging(false);
    //@ts-ignore
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    dragItem.current = {} as Item;
    dragNode.current = null;
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>, item: Item) => {
    if (e.target !== dragNode.current) {
      setLocalItems((oldItems) => {
        const newItems: Item[] = JSON.parse(JSON.stringify(oldItems));
        const currentItemIndex = localItems.findIndex(
          (element) => element.id === dragItem.current.id
        );
        const dragItemIndex = localItems.findIndex(
          (element) => element.id === item.id
        );
        newItems.splice(
          dragItemIndex,
          0,
          newItems.splice(currentItemIndex, 1)[0]
        );
        dragItem.current = newItems[dragItemIndex];
        return newItems;
      });
    }
  };

  const _tempList = JSON.parse(JSON.stringify(localItems));
  const lastUpdate = _tempList.sort((a: Item, b: Item) => b.updatedAt.localeCompare(a.updatedAt))[0]?.updatedAt;

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
        <ListTitle updatedAt={lastUpdate} />
        <div className="flex flex-col">
          {localItems?.map((item: Item) => (
            <ListItem
              key={item.id}
              data={item}
              toggleCheck={toggleCheck}
              handleDragStart={handleDragStart}
              handleDragEnter={handleDragEnter}
              dragging={dragging}
              currentDragItem={dragItem}
            />
          ))}
        </div>
        <Input
          handleChange={setInputValue}
          handleSubmit={handleSubmit}
          value={inputValue}
        />
      </>
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
